"use client";

import { useCallback, useState } from "react";
import type { QuoteWizardAdditional } from "@/utils/quoteWizardCotizar";
import QuoteWizardDetailModal from "./QuoteWizardDetailModal";
import {
  DETAIL_BUTTONS,
  DETAIL_BUTTON_CONFIG,
  type DetailButton,
} from "./types";

type QuoteWizardDetailsSidebarProps = {
  additional: QuoteWizardAdditional;
};

const QuoteWizardDetailsSidebar = ({
  additional,
}: QuoteWizardDetailsSidebarProps) => {
  const [activeDetail, setActiveDetail] = useState<DetailButton | null>(null);

  const activeConfig = activeDetail ? DETAIL_BUTTON_CONFIG[activeDetail] : null;
  const activeHtml = activeConfig ? additional[activeConfig.key] : "";

  const handleCloseDetail = useCallback(() => {
    setActiveDetail(null);
  }, []);

  return (
    <>
      <div className="card border-0 shadow-sm tg-quote-wizard-details">
        <div className="card-body p-3">
          <h2 className="h6 fw-semibold mb-3">Detalles</h2>
          <div className="d-flex flex-wrap gap-2">
            {DETAIL_BUTTONS.map((label) => (
              <button
                key={label}
                type="button"
                className="btn btn-sm tg-quote-wizard-detail-btn"
                onClick={() => setActiveDetail(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeDetail !== null ? (
        <QuoteWizardDetailModal
          title={activeConfig?.title ?? "Detalle"}
          html={activeHtml}
          onClose={handleCloseDetail}
        />
      ) : null}
    </>
  );
};

export default QuoteWizardDetailsSidebar;
