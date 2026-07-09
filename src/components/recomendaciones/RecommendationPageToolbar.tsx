"use client";

import DisponibilidadViewSwitcher from "@/components/disponibilidad/DisponibilidadViewSwitcher";

type RecommendationPageToolbarProps = {
  activeSectionLabel: string;
  showViewSwitcher?: boolean;
};

const RecommendationPageToolbar = ({
  activeSectionLabel,
  showViewSwitcher = true,
}: RecommendationPageToolbarProps) => {
  return (
    <div className="recommendation-page-toolbar d-flex align-items-center mb-0">
      <div
        className="recommendation-page-toolbar-pill flex-grow-1 d-flex align-items-center justify-content-between gap-3"
        aria-label={`Categoría activa: ${activeSectionLabel}`}
      >
        <span className="recommendation-page-toolbar-pill__section text-uppercase">
          {activeSectionLabel}
        </span>

        {showViewSwitcher ? (
          <DisponibilidadViewSwitcher embedded />
        ) : null}
      </div>
    </div>
  );
};

export default RecommendationPageToolbar;
