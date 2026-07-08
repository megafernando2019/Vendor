import type { RecommendationDeparture } from "@/interfaces/disponibilidad";
import { formatDisplayDate } from "@/utils/quoteWizardCalendar";
import { formatPrice } from "./recommendationCardMediaShared";

type RecommendationTourCardDeparturesTableProps = {
  departures: RecommendationDeparture[];
};

const RecommendationTourCardDeparturesTable = ({
  departures,
}: RecommendationTourCardDeparturesTableProps) => {
  if (departures.length === 0) {
    return (
      <p className="recommendation-card__departures-empty text-muted small mb-0">
        Sin salidas disponibles para los filtros actuales.
      </p>
    );
  }

  return (
    <div className="table-responsive recommendation-card__departures-wrap">
      <table className="table table-sm table-hover align-middle recommendation-card__departures-table mb-0">
        <thead>
          <tr>
            <th scope="col" className="text-morado-custom">Salida</th>
            <th scope="col" className="text-morado-custom">Regreso</th>
            <th scope="col" className="text-morado-custom text-end">
              Precio
            </th>
          </tr>
        </thead>
        <tbody>
          {departures.map((departure) => (
            <tr key={departure.uid}>
              <td>{formatDisplayDate(departure.departured_at)}</td>
              <td>{formatDisplayDate(departure.returned_at)}</td>
              <td className="text-end fw-semibold text-nowrap">
                {formatPrice(departure.dbl_adt_cost, departure.currency)}{" "}
                <span className="recommendation-card__departures-currency">
                  {departure.currency}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendationTourCardDeparturesTable;
