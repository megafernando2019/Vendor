"use client";

import { useCallback, useMemo, useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sanitizedHtml = useMemo(() => sanitizeHtml(html), [html]);
  const hasContent = sanitizedHtml.trim().length > 0;

  const setDialogRef = useCallback((node: HTMLDialogElement | null) => {
    dialogRef.current = node;
    if (node && !node.open) {
      node.showModal();
    }
  }, []);

  const requestClose = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={setDialogRef}
      className="tg-quote-wizard-detail-modal"
      aria-labelledby="quote-wizard-detail-modal-title"
      onClose={onClose}
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
              onClick={requestClose}
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
            <button type="button" className="btn btn-secondary" onClick={requestClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default QuoteWizardDetailModal;
