import Image from "next/image";
import {
  getInsuranceProviderColor,
  getInsuranceProviderLabel,
  getInsuranceProviderLogo,
} from "@/interfaces/seguros-cotizacion";

type QuoteWizardInsuranceProviderListProps = {
  providerKeys: string[];
  selectedProviderKey: string | null;
  onSelect: (key: string) => void;
};

const QuoteWizardInsuranceProviderList = ({
  providerKeys,
  selectedProviderKey,
  onSelect,
}: QuoteWizardInsuranceProviderListProps) => (
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
          onClick={() => onSelect(key)}
          aria-pressed={isSelected}
        >
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="min-w-0">
              <p className="mb-1 fw-semibold small" style={{ color: accent }}>
                {label}
              </p>
              <p className="mb-2 text-muted tg-quote-wizard-insurance-card-subtitle">
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
);

export default QuoteWizardInsuranceProviderList;
