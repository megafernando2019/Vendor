"use client";

import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

type QuoteWizardDetailModalProps = {
  title: string;
  html: string;
  onClose: () => void;
};

const QuoteWizardDetailModal = ({
  title,
  html,
  onClose,
}: QuoteWizardDetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const sanitizedHtml = useMemo(() => sanitizeHtml(html), [html]);
  const hasContent = sanitizedHtml.trim().length > 0;

  useEffect(() => {
    const element = modalRef.current;
    if (!element) return;

    let disposed = false;
    let modalInstance: import("bootstrap").Modal | null = null;

    const handleHidden = () => {
      onCloseRef.current();
    };

    void import("bootstrap").then(({ Modal }) => {
      if (disposed) return;

      modalInstance = Modal.getOrCreateInstance(element, {
        backdrop: true,
        keyboard: true,
        focus: true,
      });

      element.addEventListener("hidden.bs.modal", handleHidden);
      modalInstance.show();
    });

    return () => {
      disposed = true;
      element.removeEventListener("hidden.bs.modal", handleHidden);
      modalInstance?.dispose();
    };
  }, []);

  return createPortal(
    <div
      ref={modalRef}
      className="modal fade tg-quote-wizard-detail-modal"
      tabIndex={-1}
      aria-labelledby="quote-wizard-detail-modal-title"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h2
              className="modal-title h5 mb-0"
              id="quote-wizard-detail-modal-title"
            >
              {title}
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            />
          </div>
          <div className="modal-body">
            {hasContent ? (
              <div
                className="tg-quote-wizard-detail-html"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            ) : (
              <p className="text-muted mb-0">
                No hay información disponible para esta sección.
              </p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default QuoteWizardDetailModal;
