"use client";

import type { DayPrice } from "@/utils/quoteWizardCalendar";
import type { QuoteWizardTour } from "@/utils/quoteWizardCotizar";
import type { WizardStep } from "../types";
import {
  getRoomRulesForTab,
  getRoomTabDisplay,
  ROOM_TAB_LABELS,
} from "@/interfaces/cotizacion-components";
import QuoteWizardHabitacionCostsBar from "./QuoteWizardHabitacionCostsBar";
import QuoteWizardHabitacionRoomPanel from "./QuoteWizardHabitacionRoomPanel";
import QuoteWizardStepPlaceholder from "./QuoteWizardStepPlaceholder";
import { useQuoteWizardHabitaciones } from "./useQuoteWizardHabitaciones";

export type QuoteWizardHabitacionesProps = {
  tour: QuoteWizardTour;
  mt: string;
  selectedDeparture: DayPrice | null;
  onStepChange: (step: WizardStep) => void;
  editingRoomId?: string | null;
  onEditingComplete?: () => void;
};

function QuoteWizardHabitacionesTitle() {
  return (
    <div className="text-center mb-4">
      <h2 className="h5 fw-bold mb-1">Pasajeros y Habitaciones</h2>
      <p className="text-muted small mb-0">
        Selecciona los tipos de pasajeros que ocuparan la habitación
      </p>
    </div>
  );
}

const QuoteWizardHabitaciones = ({
  tour,
  mt,
  selectedDeparture,
  onStepChange,
  editingRoomId,
  onEditingComplete,
}: QuoteWizardHabitacionesProps) => {
  const {
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
  } = useQuoteWizardHabitaciones({
    tour,
    mt,
    departureFromWizard: selectedDeparture,
    onStepChange,
    editingRoomId,
    onEditingComplete,
  });

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
        <QuoteWizardHabitacionesTitle />
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
        <QuoteWizardHabitacionesTitle />
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
      <QuoteWizardHabitacionesTitle />

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

      <QuoteWizardHabitacionRoomPanel
        activeTab={activeTab}
        bedLayout={bedLayout}
        roomTitle={roomTitle}
        roomDescription={roomDescription}
        roomRules={roomRules}
        selectedRuleIndex={selectedRuleIndex}
        editingRoomId={editingRoomId}
        roomCostsLoading={roomCostsLoading}
        roomCostsPreview={roomCostsPreview}
        onBedLayoutChange={setBedLayout}
        onSelectRule={setSelectedRuleIndex}
        onAddRoom={handleAddRoom}
      />

      <QuoteWizardHabitacionCostsBar
        activeTab={activeTab}
        currency={currency}
        roomCostsLoading={roomCostsLoading}
        roomCostsError={roomCostsError}
        roomCostsPreview={roomCostsPreview}
      />

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
