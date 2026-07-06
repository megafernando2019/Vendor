import QuoteWizard from "@/components/pages/quote-wizard";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Cotización - Quote Wizard",
};

type QuoteWizardMtPageProps = {
  params: Promise<{ mt: string }>;
};

const page = async ({ params }: QuoteWizardMtPageProps) => {
  const { mt } = await params;

  return (
    <Wrapper>
      <QuoteWizard mt={mt} />
    </Wrapper>
  );
};

export default page;
