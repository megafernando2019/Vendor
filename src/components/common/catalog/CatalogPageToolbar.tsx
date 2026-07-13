"use client";

import DisponibilidadViewSwitcher from "@/components/disponibilidad/DisponibilidadViewSwitcher";

type CatalogPageToolbarProps = {
  activeSectionLabel: string;
  showViewSwitcher?: boolean;
};

const CatalogPageToolbar = ({
  activeSectionLabel,
  showViewSwitcher = true,
}: CatalogPageToolbarProps) => {
  return (
    <div className="catalog-layout__toolbar d-flex align-items-center mb-0">
      <div
        className="catalog-layout__toolbar-pill flex-grow-1 d-flex align-items-center justify-content-between gap-3"
        aria-label={`Categoría activa: ${activeSectionLabel}`}
      >
        <span className="catalog-layout__toolbar-label text-uppercase">
          {activeSectionLabel}
        </span>

        {showViewSwitcher ? (
          <DisponibilidadViewSwitcher embedded />
        ) : null}
      </div>
    </div>
  );
};

export default CatalogPageToolbar;
