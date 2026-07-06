"use client";

import type { DayPrice } from "@/utils/quoteWizardCalendar";
import type { QuoteWizardTour } from "@/utils/quoteWizardCotizar";
import QuoteWizardInsuranceForm from "./QuoteWizardInsuranceForm";
import QuoteWizardInsuranceProviderList from "./QuoteWizardInsuranceProviderList";
import QuoteWizardStepPlaceholder from "./QuoteWizardStepPlaceholder";
import { useQuoteWizardAsistencia } from "./useQuoteWizardAsistencia";

export type QuoteWizardAsistenciaProps = {
  tour: QuoteWizardTour;
  mt: string;
  selectedDeparture: DayPrice | null;
  editingAsistenciaId?: string | null;
  onEditingComplete?: () => void;
};

const QuoteWizardAsistencia = ({
  tour,
  mt,
  selectedDeparture,
  editingAsistenciaId,
  onEditingComplete,
}: QuoteWizardAsistenciaProps) => {
  const {
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
  } = useQuoteWizardAsistencia({
    tour,
    mt,
    selectedDeparture,
    editingAsistenciaId,
    onEditingComplete,
  });

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
          <QuoteWizardInsuranceProviderList
            providerKeys={providerKeys}
            selectedProviderKey={selectedProviderKey}
            onSelect={handleProviderSelect}
          />
        </div>

        <div className="col-12 col-lg-7">
          {selectedProvider ? (
            <QuoteWizardInsuranceForm
              selectedProvider={selectedProvider}
              cantidadCoberturas={cantidadCoberturas}
              maxCoberturas={maxCoberturas}
              selectedProductId={selectedProductId}
              selectedAddonIds={selectedAddonIds}
              estimatedTotal={estimatedTotal}
              editingAsistenciaId={editingAsistenciaId}
              onCantidadChange={setCantidadCoberturas}
              onProductChange={setSelectedProductId}
              onToggleAddon={toggleAddon}
              onCancel={handleCancel}
              onAdd={handleAdd}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuoteWizardAsistencia;
