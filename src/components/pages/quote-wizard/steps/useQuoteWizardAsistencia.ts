import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addAsistencia, removeAsistencia } from "@/redux/slices/cotizacionSlice";
import { getHabitacionQuantity, type HabitacionCotizacion } from "@/interfaces/cotizacion-components";
import type {
  AddonSeleccionado,
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
  const [selectedProviderKey, setSelectedProviderKey] = useState<string | null>(
    null,
  );
  const [cantidadCoberturas, setCantidadCoberturas] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);

  const providerKeys = useMemo(
    () => sortInsuranceProviderKeys(Object.keys(providers)),
    [providers],
  );

  const maxCoberturas = useMemo(
    () => getMaxCoveragesFromRooms(habitacionesSeleccionadas),
    [habitacionesSeleccionadas],
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

  const resetForm = useCallback(() => {
    setCantidadCoberturas(1);
    setSelectedProductId(null);
    setSelectedAddonIds([]);
  }, []);

  const handleProviderSelect = useCallback(
    (key: string) => {
      setSelectedProviderKey(key);
      resetForm();
      const seguros = providers[key]?.seguros ?? [];
      if (seguros.length > 0) {
        setSelectedProductId(seguros[0].id);
      }
    },
    [providers, resetForm],
  );

  useEffect(() => {
    if (!selectedDeparture) return;

    let cancelled = false;

    const loadInsurances = async () => {
      setLoading(true);
      setError(null);
      setProviders({});
      setSelectedProviderKey(null);
      resetForm();

      try {
        const res = await fetch("/api/getInsurances", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ mt, days: tour.days }),
        });

        const data = (await res.json()) as {
          success?: boolean;
          message?: string;
          data?: InsuranceProvidersMap;
        };

        if (cancelled) return;

        if (!res.ok || data.success === false) {
          setError(data.message ?? "No se pudieron cargar las asistencias");
          return;
        }

        const map = data.data ?? {};
        setProviders(map);

        const keys = sortInsuranceProviderKeys(Object.keys(map));
        if (keys.length > 0) {
          const firstKey = keys[0];
          setSelectedProviderKey(firstKey);
          const firstProduct = map[firstKey]?.seguros[0];
          if (firstProduct) {
            setSelectedProductId(firstProduct.id);
          }
        }
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
  }, [mt, tour.days, selectedDeparture, resetForm]);

  useEffect(() => {
    if (!editingItem || Object.keys(providers).length === 0) return;
    if (!providers[editingItem.providerKey]) return;

    setSelectedProviderKey(editingItem.providerKey);
    setSelectedProductId(editingItem.productId);
    setCantidadCoberturas(editingItem.coberturas?.length ?? 1);
    setSelectedAddonIds(
      editingItem.addonsSeleccionados?.map((addon) => addon.id) ?? [],
    );
  }, [editingItem, providers]);

  useEffect(() => {
    if (cantidadCoberturas > maxCoberturas) {
      setCantidadCoberturas(maxCoberturas);
    }
  }, [cantidadCoberturas, maxCoberturas]);

  const toggleAddon = useCallback((addonId: number) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  }, []);

  const handleCancel = useCallback(() => {
    resetForm();
    if (selectedProviderKey) {
      const seguros = providers[selectedProviderKey]?.seguros ?? [];
      if (seguros.length > 0) {
        setSelectedProductId(seguros[0].id);
      }
    }
    if (editingAsistenciaId) {
      onEditingComplete?.();
    }
  }, [providers, resetForm, selectedProviderKey, editingAsistenciaId, onEditingComplete]);

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
