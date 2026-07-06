import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getInsurancesAction } from "@/app/actions/insurances";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addAsistencia, removeAsistencia } from "@/redux/slices/cotizacionSlice";
import { getHabitacionQuantity, type HabitacionCotizacion } from "@/interfaces/cotizacion-components";
import type {
  AddonSeleccionado,
  AsistenciaSeleccionada,
  InsuranceProvidersMap,
} from "@/interfaces/seguros-cotizacion";
import {
  buildCoberturaLineas,
  calcularPrecioAsistencia,
  formatInsuranceAddonPrice,
  getInsuranceProviderLabel,
  resolveInsuranceDays,
  sortInsuranceProviderKeys,
} from "@/interfaces/seguros-cotizacion";
import type { DayPrice } from "@/utils/quoteWizardCalendar";
import type { QuoteWizardTour } from "@/utils/quoteWizardCotizar";

function getMaxCoveragesFromRooms(habitaciones: HabitacionCotizacion[]): number {
  const passengers = habitaciones.reduce((sum, room) => {
    const qty = getHabitacionQuantity(room);
    return sum + ((room.adt ?? 0) + (room.mnrA ?? 0)) * qty;
  }, 0);
  if (passengers <= 0) return 1;
  return Math.min(3, passengers);
}

type AsistenciaFormValues = {
  selectedProviderKey: string | null;
  selectedProductId: number | null;
  cantidadCoberturas: number;
  selectedAddonIds: number[];
};

type ScopedFormDraft = {
  scopeKey: string;
  values: AsistenciaFormValues;
};

const EMPTY_FORM: AsistenciaFormValues = {
  selectedProviderKey: null,
  selectedProductId: null,
  cantidadCoberturas: 1,
  selectedAddonIds: [],
};

function buildDefaultFormValues(
  providers: InsuranceProvidersMap,
  editingItem: AsistenciaSeleccionada | null,
): AsistenciaFormValues | null {
  if (editingItem && providers[editingItem.providerKey]) {
    return {
      selectedProviderKey: editingItem.providerKey,
      selectedProductId: editingItem.productId,
      cantidadCoberturas: editingItem.coberturas?.length ?? 1,
      selectedAddonIds:
        editingItem.addonsSeleccionados?.map((addon) => addon.id) ?? [],
    };
  }

  const keys = sortInsuranceProviderKeys(Object.keys(providers));
  if (keys.length === 0) return null;

  const firstKey = keys[0];
  const firstProduct = providers[firstKey]?.seguros[0];
  return {
    selectedProviderKey: firstKey,
    selectedProductId: firstProduct?.id ?? null,
    cantidadCoberturas: 1,
    selectedAddonIds: [],
  };
}

type UseQuoteWizardAsistenciaParams = {
  tour: QuoteWizardTour;
  mt: string;
  selectedDeparture: DayPrice | null;
  editingAsistenciaId?: string | null;
  onEditingComplete?: () => void;
};

export function useQuoteWizardAsistencia({
  tour,
  mt,
  selectedDeparture,
  editingAsistenciaId,
  onEditingComplete,
}: UseQuoteWizardAsistenciaParams) {
  const dispatch = useAppDispatch();
  const habitacionesSeleccionadas = useAppSelector(
    (state) => state.cotizacion.habitacionesSeleccionadas,
  );
  const asistenciasSeleccionadas = useAppSelector(
    (state) => state.cotizacion.asistenciasSeleccionadas,
  );

  const editingItem = useMemo(
    () =>
      asistenciasSeleccionadas.find((item) => item.id === editingAsistenciaId) ??
      null,
    [asistenciasSeleccionadas, editingAsistenciaId],
  );

  const [providers, setProviders] = useState<InsuranceProvidersMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formDraft, setFormDraft] = useState<ScopedFormDraft | null>(null);

  const departureKey = selectedDeparture?.departureUid ?? "none";
  const providerKeys = useMemo(
    () => sortInsuranceProviderKeys(Object.keys(providers)),
    [providers],
  );

  const formScopeKey = useMemo(() => {
    if (editingItem && providers[editingItem.providerKey]) {
      return `edit:${departureKey}:${editingItem.id}`;
    }
    return `new:${departureKey}:${providerKeys.join(",")}`;
  }, [departureKey, editingItem, providerKeys, providers]);

  const bootstrapFormValues = useMemo(
    () => buildDefaultFormValues(providers, editingItem),
    [providers, editingItem],
  );

  const formValues =
    formDraft?.scopeKey === formScopeKey
      ? formDraft.values
      : bootstrapFormValues ?? EMPTY_FORM;

  const updateFormValues = useCallback(
    (updater: (current: AsistenciaFormValues) => AsistenciaFormValues) => {
      setFormDraft((prev) => {
        const current =
          prev?.scopeKey === formScopeKey ? prev.values : formValues;
        return {
          scopeKey: formScopeKey,
          values: updater(current),
        };
      });
    },
    [formScopeKey, formValues],
  );

  const {
    selectedProviderKey,
    selectedProductId,
    selectedAddonIds,
  } = formValues;

  const maxCoberturas = useMemo(
    () => getMaxCoveragesFromRooms(habitacionesSeleccionadas),
    [habitacionesSeleccionadas],
  );

  const cantidadCoberturas = Math.min(
    formValues.cantidadCoberturas,
    maxCoberturas,
  );

  const selectedProvider = selectedProviderKey
    ? providers[selectedProviderKey]
    : null;

  const insuranceDays = useMemo(
    () =>
      resolveInsuranceDays(
        tour.days,
        selectedDeparture?.departuredAt,
        selectedDeparture?.returnedAt,
      ),
    [tour.days, selectedDeparture?.departuredAt, selectedDeparture?.returnedAt],
  );

  const selectedProduct = useMemo(() => {
    if (!selectedProvider || selectedProductId == null) return null;
    return (
      selectedProvider.seguros.find((item) => item.id === selectedProductId) ??
      null
    );
  }, [selectedProvider, selectedProductId]);

  const selectedAddons = useMemo(() => {
    if (!selectedProvider) return [];
    return selectedProvider.addons.filter((addon) =>
      selectedAddonIds.includes(addon.id),
    );
  }, [selectedProvider, selectedAddonIds]);

  const coberturaLineas = useMemo(() => {
    if (!selectedProduct) return [];
    return buildCoberturaLineas(selectedProduct, cantidadCoberturas);
  }, [selectedProduct, cantidadCoberturas]);

  const estimatedTotal = useMemo(() => {
    if (!selectedProvider || coberturaLineas.length === 0) return 0;
    return calcularPrecioAsistencia(
      coberturaLineas,
      selectedProvider.seguros,
      insuranceDays,
      selectedAddons,
    );
  }, [selectedProvider, coberturaLineas, insuranceDays, selectedAddons]);

  const resetFormFields = useCallback(() => {
    updateFormValues(() => ({
      selectedProviderKey: formValues.selectedProviderKey,
      selectedProductId:
        formValues.selectedProviderKey != null
          ? (providers[formValues.selectedProviderKey]?.seguros[0]?.id ?? null)
          : null,
      cantidadCoberturas: 1,
      selectedAddonIds: [],
    }));
  }, [formValues.selectedProviderKey, providers, updateFormValues]);

  const handleProviderSelect = useCallback(
    (key: string) => {
      const seguros = providers[key]?.seguros ?? [];
      updateFormValues(() => ({
        selectedProviderKey: key,
        selectedProductId: seguros[0]?.id ?? null,
        cantidadCoberturas: 1,
        selectedAddonIds: [],
      }));
    },
    [providers, updateFormValues],
  );

  useEffect(() => {
    if (!selectedDeparture) return;

    let cancelled = false;

    const loadInsurances = async () => {
      setLoading(true);
      setError(null);
      setProviders({});
      setFormDraft(null);

      try {
        const data = await getInsurancesAction(mt, tour.days);

        if (cancelled) return;

        if (!data.success) {
          setError(data.message ?? "No se pudieron cargar las asistencias");
          return;
        }

        setProviders(data.data);
      } catch {
        if (!cancelled) {
          setError("Error de conexión al consultar asistencias");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInsurances();

    return () => {
      cancelled = true;
    };
  }, [mt, tour.days, selectedDeparture]);

  const setCantidadCoberturas = useCallback(
    (value: number) => {
      updateFormValues((current) => ({
        ...current,
        cantidadCoberturas: value,
      }));
    },
    [updateFormValues],
  );

  const setSelectedProductId = useCallback(
    (productId: number) => {
      updateFormValues((current) => ({
        ...current,
        selectedProductId: productId,
      }));
    },
    [updateFormValues],
  );

  const toggleAddon = useCallback(
    (addonId: number) => {
      updateFormValues((current) => ({
        ...current,
        selectedAddonIds: current.selectedAddonIds.includes(addonId)
          ? current.selectedAddonIds.filter((id) => id !== addonId)
          : [...current.selectedAddonIds, addonId],
      }));
    },
    [updateFormValues],
  );

  const handleCancel = useCallback(() => {
    resetFormFields();
    if (editingAsistenciaId) {
      onEditingComplete?.();
    }
  }, [editingAsistenciaId, onEditingComplete, resetFormFields]);

  const handleAdd = useCallback(() => {
    if (!selectedProviderKey || !selectedProvider || !selectedProduct) {
      toast.warn("Selecciona un proveedor y tipo de cobertura", {
        position: "top-center",
      });
      return;
    }

    const addonsSeleccionados: AddonSeleccionado[] = selectedAddons.map(
      (addon) => ({
        id: addon.id,
        name: addon.name_insurance,
        price: Number(formatInsuranceAddonPrice(addon)),
      }),
    );

    if (editingAsistenciaId) {
      dispatch(removeAsistencia(editingAsistenciaId));
    }

    dispatch(
      addAsistencia({
        id: crypto.randomUUID(),
        productId: selectedProduct.id,
        providerKey: selectedProviderKey,
        providerName: getInsuranceProviderLabel(selectedProviderKey),
        name: selectedProduct.name_insurance,
        price: estimatedTotal,
        type: "seguro",
        coberturas: coberturaLineas,
        addonsSeleccionados,
      }),
    );

    toast.success(
      editingAsistenciaId
        ? "Asistencia actualizada en la cotización"
        : "Asistencia agregada a la cotización",
      { position: "top-center" },
    );

    if (editingAsistenciaId) {
      onEditingComplete?.();
    } else {
      handleCancel();
    }
  }, [
    coberturaLineas,
    dispatch,
    editingAsistenciaId,
    estimatedTotal,
    handleCancel,
    onEditingComplete,
    selectedAddons,
    selectedProduct,
    selectedProvider,
    selectedProviderKey,
  ]);

  return {
    loading,
    error,
    providerKeys,
    selectedProviderKey,
    selectedProvider,
    cantidadCoberturas,
    maxCoberturas,
    selectedProductId,
    selectedAddonIds,
    estimatedTotal,
    handleProviderSelect,
    setCantidadCoberturas,
    setSelectedProductId,
    toggleAddon,
    handleCancel,
    handleAdd,
  };
}
