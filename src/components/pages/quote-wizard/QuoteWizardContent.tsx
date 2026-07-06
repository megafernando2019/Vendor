"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useIsClient } from "@/hooks/useIsClient";
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
import { convertUsdToMxn, DEFAULT_EXCHANGE_RATE_MXN } from "@/utils/cotizacionRules";
import { getHabitacionLineTotal } from "@/interfaces/cotizacion-components";
import type { DayPrice } from "@/utils/quoteWizardCalendar";
import {
  formatDisplayDate,
} from "@/utils/quoteWizardCalendar";
import QuoteWizardStepPanel from "./steps/QuoteWizardStepPanel";
import QuoteWizardDetailsSidebar from "./QuoteWizardDetailsSidebar";
import QuoteWizardCart from "./QuoteWizardCart";
import QuoteWizardHeader from "./QuoteWizardHeader";
import QuoteWizardTourNotFound from "./QuoteWizardTourNotFound";
import QuoteWizardStepNav from "./QuoteWizardStepNav";
import { type WizardStep } from "./types";

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
  const isClientReady = useIsClient();
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
    return <QuoteWizardTourNotFound mt={mt} error={error} />;
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
        <QuoteWizardHeader
          tour={tour}
          thumbSrc={thumbSrc}
          thumbLabel={thumbLabel}
          departureDateLabel={departureDateLabel}
          returnDateLabel={returnDateLabel}
          countries={countries}
          totalMxn={totalMxn}
          totalUsd={totalUsd}
          selectedDeparture={selectedDeparture}
        />

        <div className="row g-3 g-lg-4">
          <aside className="col-12 col-lg-2">
            <QuoteWizardStepNav
              activeStep={activeStep}
              onStepChange={handleStepChange}
            />

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
