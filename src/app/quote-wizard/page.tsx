import Link from "next/link";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Cotización - Quote Wizard",
};

const page = () => {
  return (
    <Wrapper>
      <section className="tg-quote-wizard py-5">
        <div className="container-fluid px-3 px-lg-4">
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "32rem" }}>
            <div className="card-body p-4 text-center">
              <h1 className="h5 fw-bold mb-2">Cotización de tour</h1>
              <p className="text-muted small mb-3">
                Selecciona un tour en disponibilidad para iniciar la cotización.
              </p>
              <Link href="/disponibilidad" className="btn btn-primary">
                Ir a disponibilidad
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

export default page;
