import type { InsuranceProduct, InsuranceProviderData } from "@/interfaces/seguros-cotizacion";
import { formatInsuranceAddonPrice } from "@/interfaces/seguros-cotizacion";
import { formatUsdAmount } from "@/utils/cotizacionRules";

type QuoteWizardInsuranceFormProps = {
  selectedProvider: InsuranceProviderData;
  cantidadCoberturas: number;
  maxCoberturas: number;
  selectedProductId: number | null;
  selectedAddonIds: number[];
  estimatedTotal: number;
  editingAsistenciaId?: string | null;
  onCantidadChange: (value: number) => void;
  onProductChange: (productId: number) => void;
  onToggleAddon: (addonId: number) => void;
  onCancel: () => void;
  onAdd: () => void;
};

const QuoteWizardInsuranceForm = ({
  selectedProvider,
  cantidadCoberturas,
  maxCoberturas,
  selectedProductId,
  selectedAddonIds,
  estimatedTotal,
  editingAsistenciaId,
  onCantidadChange,
  onProductChange,
  onToggleAddon,
  onCancel,
  onAdd,
}: QuoteWizardInsuranceFormProps) => {
  const selectedProduct =
    selectedProductId != null
      ? selectedProvider.seguros.find((item) => item.id === selectedProductId) ??
        null
      : null;

  return (
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
          onChange={(event) => onCantidadChange(Number(event.target.value))}
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
        <p className="form-text mb-0 tg-quote-wizard-insurance-hint">
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
          onChange={(event) => onProductChange(Number(event.target.value))}
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
                    onChange={() => onToggleAddon(addon.id)}
                  />
                  <label htmlFor={inputId} className="form-check-label small">
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
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm px-4"
          onClick={onAdd}
          disabled={!selectedProduct}
        >
          {editingAsistenciaId ? "Actualizar" : "Agregar"}
        </button>
      </div>
    </div>
  );
};

export default QuoteWizardInsuranceForm;
