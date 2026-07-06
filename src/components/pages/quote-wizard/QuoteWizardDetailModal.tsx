"use client";

import { useEffect } from "react";

type QuoteWizardDetailModalProps = {
  open: boolean;
  title: string;
  html: string;
  onClose: () => void;
};

const QuoteWizardDetailModal = ({
  open,
  title,
  html,
  onClose,
}: QuoteWizardDetailModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const hasContent = html.trim().length > 0;

  return (
    <>
      <div
        className="modal fade show d-block tg-quote-wizard-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-wizard-detail-modal-title"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5 mb-0" id="quote-wizard-detail-modal-title">
                {title}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              {hasContent ? (
                <div
                  className="tg-quote-wizard-detail-html"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <p className="text-muted mb-0">
                  No hay información disponible para esta sección.
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="modal-backdrop fade show border-0 p-0"
        aria-label="Cerrar modal"
        onClick={onClose}
      />
    </>
  );
};

export default QuoteWizardDetailModal;
