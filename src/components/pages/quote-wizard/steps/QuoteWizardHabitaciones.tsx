"use client";

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
  ruleKey,
  ROOM_TAB_LABELS,
  tabToRoomType,
  type RoomRule,
  type RoomTabLabel,
} from "@/interfaces/cotizacion-components";
import { formatUsdAmount, getRulePassengerLines } from "@/utils/cotizacionRules";
import QuoteWizardStepPlaceholder from "./QuoteWizardStepPlaceholder";

type BedLayout = "matrimonial" | "twin";

export type QuoteWizardHabitacionesProps = {
  tour: QuoteWizardTour;
  mt: string;
  selectedDeparture: DayPrice | null;
  onStepChange: (step: WizardStep) => void;
  editingRoomId?: string | null;
  onEditingComplete?: () => void;
};

function PassengerIcons({ rule }: { rule: RoomRule }) {
  const icons: { key: string; label: string; icon: string; tone: string }[] = [];

  for (let i = 0; i < (rule.adt ?? 0); i += 1) {
    icons.push({
      key: `adt-${i}`,
      label: "ADT",
      icon: "fa-user",
      tone: "adt",
    });
  }
  for (let i = 0; i < (rule.inf ?? 0); i += 1) {
    icons.push({
      key: `inf-${i}`,
      label: "INF",
      icon: "fa-baby-carriage",
      tone: "inf",
    });
  }
  for (let i = 0; i < (rule.mnrA ?? 0); i += 1) {
    icons.push({
      key: `mnr-${i}`,
      label: "MNR1",
      icon: "fa-child",
      tone: "mnr",
    });
  }

  return (
    <div className="d-flex flex-wrap gap-2 mb-2">
      {icons.map((item) => (
        <span
          key={item.key}
          className={`tg-quote-wizard-pax-icon tg-quote-wizard-pax-icon--${item.tone}`}
          title={item.label}
        >
          <i className={`fas ${item.icon}`} aria-hidden />
          <span className="tg-quote-wizard-pax-icon-label">{item.label}</span>
        </span>
      ))}
    </div>
  );
}

function RulePassengerDescriptions({ rule }: { rule: RoomRule }) {
  const lines = getRulePassengerLines(rule);

  return (
    <div className="small">
      {lines.map((line) => (
        <p key={line.code} className="mb-1">
          <strong>{line.code}</strong>
          {line.label.replace(line.code, "")}
        </p>
      ))}
    </div>
  );
}

const QuoteWizardHabitaciones = ({
  tour,
  mt,
  selectedDeparture: departureFromWizard,
  onStepChange,
  editingRoomId,
  onEditingComplete,
}: QuoteWizardHabitacionesProps) => {
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

  if (!effectiveDeparture) {
    return (
      <QuoteWizardStepPlaceholder
        icon="fa-bed"
        title="Pasajeros y Habitaciones"
        message="Selecciona una fecha de salida en el calendario para configurar las habitaciones."
      />
    );
  }

  if (rulesLoading && !rules) {
    return (
      <div className="tg-quote-wizard-habitaciones">
        <div className="text-center mb-4">
          <h2 className="h5 fw-bold mb-1">Pasajeros y Habitaciones</h2>
          <p className="text-muted small mb-0">
            Selecciona los tipos de pasajeros que ocuparan la habitación
          </p>
        </div>
        <div className="text-center text-muted py-5">
          <div className="spinner-border text-morado-custom mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mb-0">Cargando reglas de habitación...</p>
        </div>
      </div>
    );
  }

  if (rulesError || !rules) {
    return (
      <div className="tg-quote-wizard-habitaciones">
        <div className="text-center mb-4">
          <h2 className="h5 fw-bold mb-1">Pasajeros y Habitaciones</h2>
          <p className="text-muted small mb-0">
            Selecciona los tipos de pasajeros que ocuparan la habitación
          </p>
        </div>
        <div className="text-center py-5">
          <p className="text-muted mb-3">
            {rulesError ?? "No hay reglas disponibles para esta salida."}
          </p>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm me-2"
            onClick={() => onStepChange("fecha")}
          >
            Cambiar fecha
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleRetryRules}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tg-quote-wizard-habitaciones">
      <div className="text-center mb-4">
        <h2 className="h5 fw-bold mb-1">Pasajeros y Habitaciones</h2>
        <p className="text-muted small mb-0">
          Selecciona los tipos de pasajeros que ocuparan la habitación
        </p>
      </div>

      <ul className="nav nav-tabs tg-quote-wizard-room-tabs mb-0" role="tablist">
        {ROOM_TAB_LABELS.map((tab) => {
          const tabRules = getRoomRulesForTab(rules.roomRules, tab);
          if (tabRules.length === 0) return null;

          return (
            <li key={tab} className="nav-item" role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {getRoomTabDisplay(tab)}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="tg-quote-wizard-room-panel border rounded-bottom p-3 p-md-4 mb-4">
        <div className="row g-3 align-items-center mb-4">
          <div className="col-md-4">
            <div className="d-flex gap-3 align-items-start">
              <div className="tg-quote-wizard-room-thumb" aria-hidden>
                <i className="fas fa-bed" />
              </div>
              <div>
                <h3 className="h6 fw-semibold mb-1">{roomTitle}</h3>
                <p className="small text-muted mb-0">{roomDescription}</p>
              </div>
            </div>
          </div>

          {activeTab === "doble" ? (
            <div className="col-md-5">
              <p className="small fw-semibold mb-2">Seleccione el tipo de cama</p>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setBedLayout("matrimonial")}
                  className={`btn btn-sm tg-quote-wizard-bed-btn ${
                    bedLayout === "matrimonial" ? "active" : ""
                  }`}
                >
                  <i className="fas fa-bed me-1" aria-hidden />
                  Habitación doble
                </button>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="bed-layout-toggle"
                    checked={bedLayout === "twin"}
                    onChange={(e) =>
                      setBedLayout(e.target.checked ? "twin" : "matrimonial")
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setBedLayout("twin")}
                  className={`btn btn-sm tg-quote-wizard-bed-btn ${
                    bedLayout === "twin" ? "active" : ""
                  }`}
                >
                  <i className="fas fa-bed me-1" aria-hidden />
                  <i className="fas fa-bed me-1" aria-hidden />
                  Habitación Twin
                </button>
              </div>
            </div>
          ) : (
            <div className="col-md-5" />
          )}

          <div className="col-md-3 text-md-end">
            <button
              type="button"
              className="btn tg-quote-wizard-add-room-btn"
              onClick={handleAddRoom}
              disabled={!roomCostsPreview || roomCostsLoading}
            >
              {editingRoomId ? "Guardar cambios" : "Agregar a cotización"}
            </button>
          </div>
        </div>

        <div className="row g-3">
          {roomRules.length === 0 ? (
            <div className="col-12">
              <p className="text-muted small mb-0">
                No hay combinaciones de pasajeros para esta habitación.
              </p>
            </div>
          ) : (
            roomRules.map((rule, index) => {
              const isSelected = selectedRuleIndex === index;
              return (
                <div key={ruleKey(rule, index)} className="col-12 col-md-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRuleIndex(index)}
                    className={`tg-quote-wizard-rule-card w-100 text-start ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="flex-grow-1">
                        <PassengerIcons rule={rule} />
                        <RulePassengerDescriptions rule={rule} />
                      </div>
                      <span
                        className={`tg-quote-wizard-rule-radio ${
                          isSelected ? "selected" : ""
                        }`}
                        aria-hidden
                      />
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="tg-quote-wizard-costs-bar mb-4">
        {roomCostsLoading ? (
          <p className="mb-0 small text-muted">Calculando costos...</p>
        ) : roomCostsError ? (
          <p className="mb-0 small text-danger">{roomCostsError}</p>
        ) : roomCostsPreview ? (
          <div className="row g-2 g-md-3 align-items-center small">
            <div className="col-6 col-md-auto">
              <span className="text-muted">Tarifa:</span>{" "}
              <strong>Habitación {getRoomTabDisplay(activeTab)}</strong>
            </div>
            <div className="col-6 col-md-auto">
              <span className="text-muted">Base:</span>{" "}
              <strong>
                {formatUsdAmount(roomCostsPreview.grand_base, currency)}
              </strong>
            </div>
            <div className="col-6 col-md-auto">
              <span className="text-muted">Impuestos:</span>{" "}
              <strong>
                {formatUsdAmount(roomCostsPreview.grand_tax, currency)}
              </strong>
            </div>
            <div className="col-6 col-md-auto">
              <span className="text-muted">Suplementos:</span>{" "}
              <strong>
                {formatUsdAmount(roomCostsPreview.grand_suplements, currency)}
              </strong>
            </div>
            <div className="col-12 col-md ms-md-auto text-md-end">
              <span className="text-muted">Total habitación:</span>{" "}
              <strong className="tg-quote-wizard-costs-total">
                {formatUsdAmount(roomCostsPreview.grand_total, currency)}
              </strong>
            </div>
          </div>
        ) : (
          <p className="mb-0 small text-muted">
            Selecciona una combinación de pasajeros para ver el desglose.
          </p>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2 justify-content-between">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => onStepChange("fecha")}
        >
          Regresar
        </button>
        <div className="d-flex flex-wrap gap-2 ms-auto">
          <button type="button" className="btn btn-primary">
            Cotización rápida
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onStepChange("asistencia")}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteWizardHabitaciones;
