"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addAsistencia, removeAsistencia } from "@/redux/slices/cotizacionSlice";
import { getHabitacionQuantity, type HabitacionCotizacion } from "@/interfaces/cotizacion-components";
import type {
  AddonSeleccionado,
  InsuranceProduct,
  InsuranceProvidersMap,
} from "@/interfaces/seguros-cotizacion";
import {
  buildCoberturaLineas,
  calcularPrecioAsistencia,
  formatInsuranceAddonPrice,
  getInsuranceProviderColor,
  getInsuranceProviderLabel,
  getInsuranceProviderLogo,
  resolveInsuranceDays,
  sortInsuranceProviderKeys,
} from "@/interfaces/seguros-cotizacion";
import { formatUsdAmount } from "@/utils/cotizacionRules";
import type { DayPrice } from "@/utils/quoteWizardCalendar";
import type { QuoteWizardTour } from "@/utils/quoteWizardCotizar";
import QuoteWizardStepPlaceholder from "./QuoteWizardStepPlaceholder";

export type QuoteWizardAsistenciaProps = {
  tour: QuoteWizardTour;
  mt: string;
  selectedDeparture: DayPrice | null;
  editingAsistenciaId?: string | null;
  onEditingComplete?: () => void;
};

function getMaxCoveragesFromRooms(habitaciones: HabitacionCotizacion[]): number {
  const passengers = habitaciones.reduce((sum, room) => {
    const qty = getHabitacionQuantity(room);
    return sum + ((room.adt ?? 0) + (room.mnrA ?? 0)) * qty;
  }, 0);
  if (passengers <= 0) return 1;
  return Math.min(3, passengers);
}

const QuoteWizardAsistencia = ({
  tour,
  mt,
  selectedDeparture,
  editingAsistenciaId,
  onEditingComplete,
}: QuoteWizardAsistenciaProps) => {
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

  if (!selectedDeparture) {
    return (
      <QuoteWizardStepPlaceholder
        icon="fa-shield-alt"
        title="Asistencia"
        message="Selecciona una fecha para ver las opciones de asistencia de viaje."
      />
    );
  }

  if (loading) {
    return (
      <div className="tg-quote-wizard-asistencia text-center py-5 text-muted small">
        Cargando opciones de asistencia...
      </div>
    );
  }

  if (error) {
    return (
      <div className="tg-quote-wizard-asistencia">
        <div className="alert alert-warning small mb-0" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (providerKeys.length === 0) {
    return (
      <div className="tg-quote-wizard-asistencia">
        <p className="text-muted small mb-0">
          No hay asistencias disponibles para este programa.
        </p>
      </div>
    );
  }

  return (
    <div className="tg-quote-wizard-asistencia">
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="d-flex flex-column gap-3">
            {providerKeys.map((key) => {
              const isSelected = key === selectedProviderKey;
              const label = getInsuranceProviderLabel(key);
              const accent = getInsuranceProviderColor(key);
              const logo = getInsuranceProviderLogo(key);

              return (
                <button
                  key={key}
                  type="button"
                  className={`tg-quote-wizard-insurance-card w-100 text-start ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleProviderSelect(key)}
                  aria-pressed={isSelected}
                >
                  <div className="d-flex align-items-center justify-content-between gap-3">
                    <div className="min-w-0">
                      <p
                        className="mb-1 fw-semibold small"
                        style={{ color: accent }}
                      >
                        {label}
                      </p>
                      <p className="mb-2 text-muted" style={{ fontSize: "0.72rem" }}>
                        Conoce las coberturas
                      </p>
                      <span className="tg-quote-wizard-insurance-link small">
                        Conocer más
                        <i className="fas fa-chevron-right ms-1" aria-hidden />
                      </span>
                    </div>
                    {logo ? (
                      <div className="tg-quote-wizard-insurance-logo flex-shrink-0">
                        <Image
                          src={logo}
                          alt={label}
                          width={72}
                          height={40}
                          className="object-fit-contain"
                        />
                      </div>
                    ) : (
                      <span
                        className="tg-quote-wizard-insurance-logo-fallback flex-shrink-0"
                        style={{ color: accent }}
                      >
                        {key}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-12 col-lg-7">
          {selectedProvider ? (
            <div className="tg-quote-wizard-insurance-form">
              <div className="mb-3">
                <label
                  htmlFor="tg-insurance-cantidad"
                  className="form-label small fw-semibold mb-1"
                >
                  Número de coberturas
                </label>
                <select
                  id="tg-insurance-cantidad"
                  className="form-select form-select-sm"
                  value={cantidadCoberturas}
                  onChange={(event) =>
                    setCantidadCoberturas(Number(event.target.value))
                  }
                >
                  {Array.from({ length: maxCoberturas }, (_, index) => {
                    const value = index + 1;
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
                <p className="form-text mb-0" style={{ fontSize: "0.7rem" }}>
                  Máximo {maxCoberturas} según pasajeros en habitaciones
                </p>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="tg-insurance-tipo"
                  className="form-label small fw-semibold mb-1"
                >
                  Tipo de cobertura
                </label>
                <select
                  id="tg-insurance-tipo"
                  className="form-select form-select-sm"
                  value={selectedProductId ?? ""}
                  onChange={(event) =>
                    setSelectedProductId(Number(event.target.value))
                  }
                >
                  {selectedProvider.seguros.map((product: InsuranceProduct) => (
                    <option key={product.id} value={product.id}>
                      {product.name_insurance}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProvider.addons.length > 0 ? (
                <fieldset className="mb-3">
                  <legend className="form-label small fw-semibold mb-2">
                    Complementos
                  </legend>
                  <div className="d-flex flex-column gap-2">
                    {selectedProvider.addons.map((addon) => {
                      const inputId = `tg-insurance-addon-${addon.id}`;
                      return (
                        <div key={addon.id} className="form-check">
                          <input
                            id={inputId}
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedAddonIds.includes(addon.id)}
                            onChange={() => toggleAddon(addon.id)}
                          />
                          <label
                            htmlFor={inputId}
                            className="form-check-label small"
                          >
                            {addon.name_insurance} (+$
                            {formatInsuranceAddonPrice(addon)})
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              <div className="tg-quote-wizard-insurance-total d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted small">Total estimado</span>
                <span>
                  <strong className="text-morado-custom">
                    {formatUsdAmount(estimatedTotal)}
                  </strong>{" "}
                  <span className="text-muted small">USD</span>
                </span>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-4"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm px-4"
                  onClick={handleAdd}
                  disabled={!selectedProduct}
                >
                  {editingAsistenciaId ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuoteWizardAsistencia;
