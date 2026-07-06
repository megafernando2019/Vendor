import Link from "next/link";

type QuoteWizardTourNotFoundProps = {
  mt: string;
  error: string | null;
};

const QuoteWizardTourNotFound = ({ mt, error }: QuoteWizardTourNotFoundProps) => (
  <section className="tg-quote-wizard py-5">
    <div className="container-fluid px-3 px-lg-4">
      <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "32rem" }}>
        <div className="card-body p-4 text-center">
          <h1 className="h5 fw-bold mb-2">Tour no encontrado</h1>
          <p className="text-muted small mb-3">
            {error ?? `No se encontraron datos para MT${mt}.`}
          </p>
          <Link href="/disponibilidad" className="btn btn-primary">
            Ir a disponibilidad
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default QuoteWizardTourNotFound;
