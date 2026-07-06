import QuoteWizardContent from "./QuoteWizardContent";

type QuoteWizardProps = {
  mt: string;
};

const QuoteWizard = ({ mt }: QuoteWizardProps) => {
  return <QuoteWizardContent mt={mt} />;
};

export default QuoteWizard;
