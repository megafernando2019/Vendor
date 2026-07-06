import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addHabitacion,
  fetchRoomCosts,
  fetchRulesCotizacion,
  updateHabitacion,
} from "@/redux/slices/cotizacionSlice";
import type { DayPrice } from "@/utils/quoteWizardCalendar";
import type { QuoteWizardTour } from "@/utils/quoteWizardCotizar";
import type { WizardStep } from "../types";
import {
  getRoomRulesForTab,
  getRoomTabDisplay,
  ROOM_TAB_LABELS,
  tabToRoomType,
  type RoomTabLabel,
} from "@/interfaces/cotizacion-components";

type BedLayout = "matrimonial" | "twin";

type UseQuoteWizardHabitacionesParams = {
  tour: QuoteWizardTour;
  mt: string;
  departureFromWizard: DayPrice | null;
  onStepChange: (step: WizardStep) => void;
  editingRoomId?: string | null;
  onEditingComplete?: () => void;
};

export function useQuoteWizardHabitaciones({
  tour,
  mt,
  departureFromWizard,
  onStepChange,
  editingRoomId,
  onEditingComplete,
}: UseQuoteWizardHabitacionesParams) {
  const dispatch = useAppDispatch();
  const {
    selectedDeparture: departureFromStore,
    habitacionesSeleccionadas,
    rules,
    rulesLoading,
    rulesError,
    roomCostsPreview,
    roomCostsLoading,
    roomCostsError,
  } = useAppSelector((state) => state.cotizacion);

  const effectiveDeparture = useMemo(() => {
    if (departureFromWizard?.program === "selected") {
      return {
        blockadeUid: departureFromWizard.departureUid,
        currency: departureFromWizard.currency,
        departuredAt: departureFromWizard.departuredAt,
        price: departureFromWizard.price,
      };
    }
    if (departureFromStore) {
      return {
        blockadeUid: departureFromStore.blockadeUid,
        currency: departureFromStore.currency,
        departuredAt: departureFromStore.departuredAt,
        price: departureFromStore.price,
      };
    }
    return null;
  }, [departureFromStore, departureFromWizard]);

  useEffect(() => {
    if (!departureFromWizard || departureFromWizard.program !== "selected") return;
    if (rulesLoading) return;

    const sameDeparture =
      departureFromStore?.blockadeUid === departureFromWizard.departureUid;
    if (rules && sameDeparture) return;
    if (rulesError && sameDeparture) return;

    void dispatch(
      fetchRulesCotizacion({
        mt: tour.clv || mt,
        uid: departureFromWizard.departureUid,
        departuredAt: departureFromWizard.departuredAt,
        currency: departureFromWizard.currency,
        price: departureFromWizard.price,
      }),
    );
  }, [
    departureFromStore?.blockadeUid,
    departureFromWizard,
    dispatch,
    mt,
    rules,
    rulesError,
    rulesLoading,
    tour.clv,
  ]);

  const [activeTab, setActiveTab] = useState<RoomTabLabel>("doble");
  const [bedLayout, setBedLayout] = useState<BedLayout>("twin");
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(0);

  useEffect(() => {
    if (!rules) return;
    const firstTab = ROOM_TAB_LABELS.find(
      (tab) => getRoomRulesForTab(rules.roomRules, tab).length > 0,
    );
    if (firstTab && !editingRoomId) setActiveTab(firstTab);
  }, [rules, editingRoomId]);

  const editingRoom = useMemo(
    () =>
      editingRoomId
        ? habitacionesSeleccionadas.find((room) => room.id === editingRoomId)
        : undefined,
    [editingRoomId, habitacionesSeleccionadas],
  );

  useEffect(() => {
    if (!editingRoom || !rules) return;

    setActiveTab(editingRoom.roomLabel);
    const tabRules = getRoomRulesForTab(rules.roomRules, editingRoom.roomLabel);
    const ruleIndex = tabRules.findIndex(
      (rule) =>
        (rule.adt ?? 0) === editingRoom.adt &&
        (rule.mnrA ?? 0) === editingRoom.mnrA &&
        (rule.inf ?? 0) === editingRoom.inf,
    );
    if (ruleIndex >= 0) setSelectedRuleIndex(ruleIndex);
  }, [editingRoom, rules]);

  const currency = rules?.currency ?? effectiveDeparture?.currency ?? "USD";
  const roomRules = useMemo(
    () => (rules ? getRoomRulesForTab(rules.roomRules, activeTab) : []),
    [rules, activeTab],
  );

  const selectedRule = roomRules[selectedRuleIndex] ?? roomRules[0];

  useEffect(() => {
    setSelectedRuleIndex(0);
  }, [activeTab]);

  useEffect(() => {
    if (!rules || !effectiveDeparture || !selectedRule) return;

    void dispatch(
      fetchRoomCosts({
        destinationId: rules.destinationId,
        passengers: selectedRule,
        roomType: tabToRoomType(activeTab),
        blockadeUid: effectiveDeparture.blockadeUid,
      }),
    );
  }, [
    activeTab,
    dispatch,
    effectiveDeparture,
    rules,
    selectedRule,
    selectedRuleIndex,
  ]);

  const roomDescription = useMemo(() => {
    if (!rules) return "";
    if (activeTab === "sencilla") return rules.rulesText.sencilla;
    if (activeTab === "triple") return rules.rulesText.triple;
    return rules.rulesText.doble;
  }, [activeTab, rules]);

  const roomTitle = useMemo(() => {
    const label = getRoomTabDisplay(activeTab);
    if (activeTab === "doble" && bedLayout === "twin") {
      return `Habitación ${label} (Twin)`;
    }
    return `Habitación ${label}`;
  }, [activeTab, bedLayout]);

  const handleAddRoom = useCallback(() => {
    if (!rules || !effectiveDeparture || !selectedRule || !roomCostsPreview) {
      toast.warn("Selecciona una combinación de pasajeros con costos válidos", {
        position: "top-center",
      });
      return;
    }

    const payload = {
      id: editingRoomId ?? crypto.randomUUID(),
      roomLabel: activeTab,
      roomType: tabToRoomType(activeTab),
      adt: selectedRule.adt ?? 0,
      mnrA: selectedRule.mnrA ?? 0,
      inf: selectedRule.inf ?? 0,
      destinationId: rules.destinationId,
      blockadeUid: effectiveDeparture.blockadeUid,
      costs: roomCostsPreview,
      total: roomCostsPreview.grand_total,
      quantity: 1,
    };

    if (editingRoomId) {
      dispatch(
        updateHabitacion({
          ...payload,
          quantity: editingRoom?.quantity ?? 1,
        }),
      );
      onEditingComplete?.();
      toast.success("Habitación actualizada", { position: "top-center" });
      return;
    }

    dispatch(addHabitacion(payload));

    toast.success("Habitación agregada a la cotización", {
      position: "top-center",
    });
  }, [
    activeTab,
    dispatch,
    editingRoomId,
    onEditingComplete,
    roomCostsPreview,
    rules,
    editingRoom,
    effectiveDeparture,
    selectedRule,
  ]);

  const handleRetryRules = useCallback(() => {
    if (!departureFromWizard || departureFromWizard.program !== "selected") {
      if (!departureFromStore) return;
      void dispatch(
        fetchRulesCotizacion({
          mt: departureFromStore.mt,
          uid: departureFromStore.blockadeUid,
          departuredAt: departureFromStore.departuredAt,
          currency: departureFromStore.currency,
          price: departureFromStore.price,
        }),
      );
      return;
    }

    void dispatch(
      fetchRulesCotizacion({
        mt: tour.clv || mt,
        uid: departureFromWizard.departureUid,
        departuredAt: departureFromWizard.departuredAt,
        currency: departureFromWizard.currency,
        price: departureFromWizard.price,
      }),
    );
  }, [departureFromStore, departureFromWizard, dispatch, mt, tour.clv]);

  return {
    effectiveDeparture,
    rules,
    rulesLoading,
    rulesError,
    activeTab,
    setActiveTab,
    bedLayout,
    setBedLayout,
    selectedRuleIndex,
    setSelectedRuleIndex,
    currency,
    roomRules,
    roomDescription,
    roomTitle,
    roomCostsPreview,
    roomCostsLoading,
    roomCostsError,
    handleAddRoom,
    handleRetryRules,
    onStepChange,
    editingRoomId,
  };
}
