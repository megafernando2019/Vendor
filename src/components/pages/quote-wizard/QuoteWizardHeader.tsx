import Image from "next/image";
import TourThumbImage from "@/components/common/TourThumbImage";
import fallbackThumb from "@/assets/img/listing/listing-1.webp";
import {
  DEFAULT_EXCHANGE_RATE_MXN,
  formatMxnAmount,
  formatUsdAmount,
} from "@/utils/cotizacionRules";
import type { DayPrice } from "@/utils/quoteWizardCalendar";
import type { QuoteWizardTour } from "@/utils/quoteWizardCotizar";

type QuoteWizardHeaderProps = {
  tour: QuoteWizardTour;
  thumbSrc: string | undefined;
  thumbLabel: string;
  departureDateLabel: string;
  returnDateLabel: string;
  countries: string;
  totalMxn: number;
  totalUsd: number;
  selectedDeparture: DayPrice | null;
};

const QuoteWizardHeader = ({
  tour,
  thumbSrc,
  thumbLabel,
  departureDateLabel,
  returnDateLabel,
  countries,
  totalMxn,
  totalUsd,
  selectedDeparture,
}: QuoteWizardHeaderProps) => (
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
);

export default QuoteWizardHeader;
