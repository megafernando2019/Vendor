import { formatUsdAmount } from "@/utils/cotizacionRules";
import type { HabitacionCosts } from "@/interfaces/cotizacion-components";
import { getRoomTabDisplay, type RoomTabLabel } from "@/interfaces/cotizacion-components";

type QuoteWizardHabitacionCostsBarProps = {
  activeTab: RoomTabLabel;
  currency: string;
  roomCostsLoading: boolean;
  roomCostsError: string | null;
  roomCostsPreview: HabitacionCosts | null;
};

const QuoteWizardHabitacionCostsBar = ({
  activeTab,
  currency,
  roomCostsLoading,
  roomCostsError,
  roomCostsPreview,
}: QuoteWizardHabitacionCostsBarProps) => (
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
);

export default QuoteWizardHabitacionCostsBar;
