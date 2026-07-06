import { WIZARD_STEPS, type WizardStep } from "./types";

type QuoteWizardStepNavProps = {
  activeStep: WizardStep;
  onStepChange: (step: WizardStep) => void;
};

const QuoteWizardStepNav = ({
  activeStep,
  onStepChange,
}: QuoteWizardStepNavProps) => (
  <nav aria-label="Pasos de cotización" className="d-flex flex-column gap-2 mb-3">
    {WIZARD_STEPS.map((step) => {
      const isActive = activeStep === step.id;
      return (
        <button
          key={step.id}
          type="button"
          onClick={() => onStepChange(step.id)}
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
);

export default QuoteWizardStepNav;
