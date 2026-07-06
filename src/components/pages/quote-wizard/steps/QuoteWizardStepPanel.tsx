"use client";

import type { QuoteWizardTour } from "@/utils/quoteWizardCotizar";
import type { QuoteWizardSearchParams } from "@/utils/quoteWizardSearchParams";
import type { DayPrice, WizardCalendarData } from "@/utils/quoteWizardCalendar";
import { useAppSelector } from "@/redux/hooks";
import type { WizardStep } from "../types";
import QuoteWizardAsistencia from "./QuoteWizardAsistencia";
import QuoteWizardCalendar from "./QuoteWizardCalendar";
import QuoteWizardHabitaciones from "./QuoteWizardHabitaciones";
import QuoteWizardOpcionales from "./QuoteWizardOpcionales";

export type QuoteWizardStepPanelProps = {
  activeStep: WizardStep;
  tour: QuoteWizardTour;
  mt: string;
  similarClv?: string;
  itemSearch: QuoteWizardSearchParams;
  calendar: WizardCalendarData;
  selectedDeparture: DayPrice | null;
  onSelectDeparture: (departure: DayPrice | null) => void;
  onStepChange: (step: WizardStep) => void;
  editingRoomId?: string | null;
  onEditingComplete?: () => void;
  editingAsistenciaId?: string | null;
  onEditingAsistenciaComplete?: () => void;
};

const QuoteWizardStepPanel = ({
  activeStep,
  tour,
  mt,
  similarClv,
  itemSearch,
  calendar,
  selectedDeparture,
  onSelectDeparture,
  onStepChange,
  editingRoomId,
  onEditingComplete,
  editingAsistenciaId,
  onEditingAsistenciaComplete,
}: QuoteWizardStepPanelProps) => {
  const rules = useAppSelector((state) => state.cotizacion.rules);
  const rulesLoading = useAppSelector((state) => state.cotizacion.rulesLoading);

  switch (activeStep) {
    case "fecha":
      return (
        <QuoteWizardCalendar
          tour={tour}
          similarClv={similarClv}
          itemSearch={itemSearch}
          calendar={calendar}
          selectedDeparture={selectedDeparture}
          onSelectDeparture={onSelectDeparture}
          onStepChange={onStepChange}
          rulesReady={Boolean(rules) && !rulesLoading}
        />
      );
    case "habitaciones":
      return (
        <QuoteWizardHabitaciones
          tour={tour}
          mt={mt}
          selectedDeparture={selectedDeparture}
          onStepChange={onStepChange}
          editingRoomId={editingRoomId}
          onEditingComplete={onEditingComplete}
        />
      );
    case "asistencia":
      return (
        <QuoteWizardAsistencia
          tour={tour}
          mt={mt}
          selectedDeparture={selectedDeparture}
          editingAsistenciaId={editingAsistenciaId}
          onEditingComplete={onEditingAsistenciaComplete}
        />
      );
    case "opcionales":
      return (
        <QuoteWizardOpcionales
          tour={tour}
          selectedDeparture={selectedDeparture}
        />
      );
    default:
      return null;
  }
};

export default QuoteWizardStepPanel;
