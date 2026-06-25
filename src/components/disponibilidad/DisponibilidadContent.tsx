"use client";

import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";

const DisponibilidadContent = () => {
  const { itemSearch, resultados, pagination, loading, error } = useAppSelector(
    (state) => state.search,
  );

  const resultadoImpresion = {
    criterios: itemSearch,
    paginacion: pagination,
    totalResultados: resultados.length,
    resultados,
  };

  return (
    <section className="tg-disponibilidad-area pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="mb-30">
              <Link href="/home-three" className="text-morado-custom">
                ← Volver al inicio
              </Link>
            </div>

            <h1 className="mb-20">Disponibilidad</h1>

            {loading && <p className="mb-20">Cargando resultados...</p>}

            {error && (
              <div className="alert alert-danger mb-20" role="alert">
                {error}
              </div>
            )}

            {!loading && resultados.length === 0 && !error && (
              <p className="mb-20">
                No hay resultados guardados. Realiza una búsqueda desde el
                inicio.
              </p>
            )}

            <div
              className="p-4 rounded-3 border bg-light overflow-auto"
              style={{ maxHeight: "70vh" }}
            >
              <pre className="mb-0 small">
                {JSON.stringify(resultadoImpresion, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisponibilidadContent;
