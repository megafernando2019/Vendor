"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import TourThumbImage from "@/components/common/TourThumbImage";
import { usePersistBootstrapped } from "@/hooks/usePersistBootstrapped";
import { useQuoteWizardTour } from "@/hooks/useQuoteWizardTour";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearHabitaciones,
  clearRulesCotizacion,
  fetchRulesCotizacion,
  removeAsistencia,
  removeHabitacion,
  removeOpcional,
  setProgramInfo,
} from "@/redux/slices/cotizacionSlice";
import { normalizePassengers } from "@/lib/searchValidation";
import { formatUsdAmount, formatMxnAmount, convertUsdToMxn, DEFAULT_EXCHANGE_RATE_MXN } from "@/utils/cotizacionRules";
import { getHabitacionLineTotal } from "@/interfaces/cotizacion-components";
import fallbackThumb from "@/assets/img/listing/listing-1.webp";
import type { DayPrice } from "@/utils/quoteWizardCalendar";
import {
  formatDisplayDate,
} from "@/utils/quoteWizardCalendar";
import QuoteWizardStepPanel from "./steps/QuoteWizardStepPanel";
import QuoteWizardDetailsSidebar from "./QuoteWizardDetailsSidebar";
import QuoteWizardCart from "./QuoteWizardCart";
import { WIZARD_STEPS, type WizardStep } from "./types";

type QuoteWizardContentProps = {
  mt: string;
};

function QuoteWizardLoading() {
  return (
    <section className="tg-quote-wizard py-5">
      <div className="container-fluid px-3 px-lg-4 text-center text-muted">
        Cargando cotización...
      </div>
    </section>
  );
}

const QuoteWizardContent = ({ mt }: QuoteWizardContentProps) => {
  const dispatch = useAppDispatch();
  const habitacionesSeleccionadas = useAppSelector(
    (state) => state.cotizacion.habitacionesSeleccionadas,
  );
  const asistenciasSeleccionadas = useAppSelector(
    (state) => state.cotizacion.asistenciasSeleccionadas,
  );
  const opcionalesSeleccionados = useAppSelector(
    (state) => state.cotizacion.opcionalesSeleccionados,
  );
  const rulesLoading = useAppSelector((state) => state.cotizacion.rulesLoading);
  const bootstrapped = usePersistBootstrapped();
  const [isClientReady, setIsClientReady] = useState(false);
  const canLoad = isClientReady && bootstrapped;
  const {
    tour,
    similarClv,
    itemSearch,
    calendar,
    countries,
    additional,
    loading,
    error,
    notFound,
  } = useQuoteWizardTour(mt, canLoad);

  const [activeStep, setActiveStep] = useState<WizardStep>("fecha");
  const [selectedDeparture, setSelectedDeparture] = useState<DayPrice | null>(
    null,
  );
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingAsistenciaId, setEditingAsistenciaId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    setSelectedDeparture(null);
    setActiveStep("fecha");
    setEditingRoomId(null);
    setEditingAsistenciaId(null);
    dispatch(clearRulesCotizacion());
    dispatch(clearHabitaciones());
  }, [mt, dispatch]);

  useEffect(() => {
    if (!tour) return;
    dispatch(
      setProgramInfo({
        clv: tour.clv,
        name: tour.name,
        days: tour.days,
        nights: tour.nights,
        destination_name: tour.destination_name,
        total_from: 0,
        currency: "USD",
        passengers: normalizePassengers(itemSearch.passengers),
      }),
    );
  }, [tour, itemSearch.passengers, dispatch]);

  const handleSelectDeparture = useCallback(
    (departure: DayPrice | null) => {
      setSelectedDeparture(departure);

      if (!departure || departure.program !== "selected") {
        dispatch(clearRulesCotizacion());
        return;
      }

      void dispatch(
        fetchRulesCotizacion({
          mt: tour?.clv ?? mt,
          uid: departure.departureUid,
          departuredAt: departure.departuredAt,
          currency: departure.currency,
          price: departure.price,
        }),
      );
    },
    [dispatch, mt, tour?.clv],
  );

  const handleStepChange = useCallback(
    (step: WizardStep) => {
      if (
        (step === "habitaciones" ||
          step === "asistencia" ||
          step === "opcionales") &&
        !selectedDeparture
      ) {
        toast.warn("Selecciona una fecha de salida antes de continuar", {
          position: "top-center",
        });
        return;
      }

      if (step === "habitaciones" && selectedDeparture?.program !== "selected") {
        toast.warn("Selecciona una fecha del programa actual (morado), no del similar", {
          position: "top-center",
        });
        return;
      }

      setActiveStep(step);
    },
    [selectedDeparture],
  );

  const totalUsd = useMemo(() => {
    const habitacionesTotal = habitacionesSeleccionadas.reduce(
      (sum, room) => sum + getHabitacionLineTotal(room),
      0,
    );
    const asistenciasTotal = asistenciasSeleccionadas.reduce(
      (sum, item) => sum + item.price,
      0,
    );
    const opcionalesTotal = opcionalesSeleccionados.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    return habitacionesTotal + asistenciasTotal + opcionalesTotal;
  }, [habitacionesSeleccionadas, asistenciasSeleccionadas, opcionalesSeleccionados]);

  const totalMxn = useMemo(
    () => convertUsdToMxn(totalUsd, DEFAULT_EXCHANGE_RATE_MXN),
    [totalUsd],
  );

  const handleEditRoom = useCallback(
    (roomId: string) => {
      setEditingRoomId(roomId);
      setActiveStep("habitaciones");
    },
    [],
  );

  const handleRemoveRoom = useCallback(
    (roomId: string) => {
      dispatch(removeHabitacion(roomId));
      if (editingRoomId === roomId) {
        setEditingRoomId(null);
      }
      toast.info("Habitación eliminada de la cotización", {
        position: "top-center",
      });
    },
    [dispatch, editingRoomId],
  );

  const handleEditingComplete = useCallback(() => {
    setEditingRoomId(null);
  }, []);

  const handleEditAsistencia = useCallback((asistenciaId: string) => {
    setEditingAsistenciaId(asistenciaId);
    setActiveStep("asistencia");
  }, []);

  const handleRemoveAsistencia = useCallback(
    (asistenciaId: string) => {
      dispatch(removeAsistencia(asistenciaId));
      if (editingAsistenciaId === asistenciaId) {
        setEditingAsistenciaId(null);
      }
      toast.info("Asistencia eliminada de la cotización", {
        position: "top-center",
      });
    },
    [dispatch, editingAsistenciaId],
  );

  const handleEditingAsistenciaComplete = useCallback(() => {
    setEditingAsistenciaId(null);
  }, []);

  const handleEditOpcional = useCallback((_opcionalId: string) => {
    setActiveStep("opcionales");
  }, []);

  const handleRemoveOpcional = useCallback(
    (opcionalId: string) => {
      dispatch(removeOpcional(opcionalId));
      toast.info("Opcional eliminado de la cotización", {
        position: "top-center",
      });
    },
    [dispatch],
  );

  if (!canLoad || loading) {
    return <QuoteWizardLoading />;
  }

  if (notFound || !tour) {
    return (
      <section className="tg-quote-wizard py-5">
        <div className="container-fluid px-3 px-lg-4">
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "32rem" }}>
            <div className="card-body p-4 text-center">
              <h1 className="h5 fw-bold mb-2">Tour no encontrado</h1>
              <p className="text-muted small mb-3">
                {error ?? `No se encontraron datos para MT${mt}.`}
              </p>
              <Link href="/disponibilidad" className="btn btn-primary">
                Ir a disponibilidad
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const departureDateLabel = selectedDeparture?.departuredAt
    ? formatDisplayDate(selectedDeparture.departuredAt)
    : itemSearch.startRange || "-";

  const returnDateLabel = selectedDeparture?.returnedAt
    ? formatDisplayDate(selectedDeparture.returnedAt)
    : itemSearch.endRange || "-";

  const thumbLabel = tour.name.toUpperCase();
  const thumbSrc = tour.multimedias?.[0];

  return (
    <section className="tg-quote-wizard py-3 py-md-4">
      <div className="container-fluid px-3 px-lg-4">
        <header className="tg-quote-wizard-header card border-0 shadow-sm mb-3 mb-lg-4">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 align-items-center">
              <div className="col-auto">
                <div className="tg-quote-wizard-thumb position-relative overflow-hidden rounded-3">
                  {thumbSrc ? (
                    <TourThumbImage
                      src={thumbSrc}
                      alt={tour.name}
                      width={120}
                      height={90}
                      className="object-fit-cover w-100 h-100"
                    />
                  ) : (
                    <Image
                      src={fallbackThumb}
                      alt={tour.name}
                      width={120}
                      height={90}
                      className="object-fit-cover w-100 h-100"
                    />
                  )}
                  <span className="tg-quote-wizard-thumb-label">{thumbLabel}</span>
                </div>
              </div>

              <div className="col min-w-0">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <span className="badge tg-quote-wizard-code">MT{tour.clv}</span>
                  <h1 className="h4 fw-bold mb-0 text-dark">{tour.name}</h1>
                </div>
                <div className="row g-2 g-md-3 small text-muted">
                  <div className="col-sm-6">
                    <p className="mb-1">
                      <i className="far fa-calendar-alt me-2 text-morado-custom" aria-hidden />
                      Fecha de salida {departureDateLabel}
                    </p>
                    <p className="mb-0">
                      <i className="far fa-calendar-check me-2 text-morado-custom" aria-hidden />
                      Fecha de regreso {returnDateLabel}
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <p className="mb-1">
                      <i className="far fa-clock me-2 text-morado-custom" aria-hidden />
                      Duración: {tour.days} días | {tour.nights} noches
                    </p>
                    <p className="mb-0">
                      <i className="fas fa-globe-americas me-2 text-morado-custom" aria-hidden />
                      Países: {countries || tour.destination_name || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-auto">
                <div className="tg-quote-wizard-summary text-lg-end">
                  <p className="mb-1 small">
                    Tipo de cambio:{" "}
                    <span className="fw-semibold text-success">
                      ${DEFAULT_EXCHANGE_RATE_MXN.toFixed(2)} MXN
                    </span>
                  </p>
                  <p className="mb-1">
                    Total:{" "}
                    <span className="fw-bold fs-5 text-morado-custom">
                      {formatMxnAmount(totalMxn)}
                    </span>
                    {totalUsd > 0 ? (
                      <span className="d-block small text-muted fw-normal">
                        {formatUsdAmount(totalUsd, selectedDeparture?.currency ?? "USD")}
                      </span>
                    ) : null}
                  </p>
                  <p className="mb-0 small">
                    Comisión:{" "}
                    <span className="fw-semibold text-orange-custom">$0.00 MXN</span>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 ms-1 align-baseline text-muted"
                      aria-label="Ver detalle de comisión"
                    >
                      <i className="far fa-eye" aria-hidden />
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="row g-3 g-lg-4">
          <aside className="col-12 col-lg-2">
            <nav aria-label="Pasos de cotización" className="d-flex flex-column gap-2 mb-3">
              {WIZARD_STEPS.map((step) => {
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepChange(step.id)}
                    aria-current={isActive ? "step" : undefined}
                    className={`btn tg-quote-wizard-step w-100 text-start ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <i className={`fas ${step.icon} me-2`} aria-hidden />
                    {step.label}
                  </button>
                );
              })}
            </nav>

            <QuoteWizardDetailsSidebar additional={additional} />
          </aside>

          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm tg-quote-wizard-calendar-card h-100">
              <div className="card-body p-3 p-md-4">
                <QuoteWizardStepPanel
                  activeStep={activeStep}
                  tour={tour}
                  mt={mt}
                  similarClv={similarClv}
                  itemSearch={itemSearch}
                  calendar={calendar}
                  selectedDeparture={selectedDeparture}
                  onSelectDeparture={handleSelectDeparture}
                  onStepChange={handleStepChange}
                  editingRoomId={editingRoomId}
                  onEditingComplete={handleEditingComplete}
                  editingAsistenciaId={editingAsistenciaId}
                  onEditingAsistenciaComplete={handleEditingAsistenciaComplete}
                />
              </div>
            </div>
          </div>

          <aside className="col-12 col-lg-3">
            <QuoteWizardCart
              tourName={tour.name}
              selectedDeparture={selectedDeparture}
              rulesLoading={rulesLoading}
              habitaciones={habitacionesSeleccionadas}
              asistencias={asistenciasSeleccionadas}
              opcionales={opcionalesSeleccionados}
              onEditRoom={handleEditRoom}
              onRemoveRoom={handleRemoveRoom}
              onEditAsistencia={handleEditAsistencia}
              onRemoveAsistencia={handleRemoveAsistencia}
              onEditOpcional={handleEditOpcional}
              onRemoveOpcional={handleRemoveOpcional}
            />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default QuoteWizardContent;
