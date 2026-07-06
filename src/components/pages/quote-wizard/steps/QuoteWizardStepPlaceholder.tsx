type QuoteWizardStepPlaceholderProps = {
  icon: string;
  title: string;
  message: string;
};

const QuoteWizardStepPlaceholder = ({
  icon,
  title,
  message,
}: QuoteWizardStepPlaceholderProps) => {
  return (
    <div className="tg-quote-wizard-placeholder d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <i className={`fas ${icon} fa-3x text-morado-custom mb-3`} aria-hidden />
      <h2 className="h5 fw-semibold mb-2">{title}</h2>
      <p className="text-muted mb-0 small">{message}</p>
    </div>
  );
};

export default QuoteWizardStepPlaceholder;
