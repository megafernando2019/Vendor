"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type RecommendationCreateListModalProps = {
  onClose: () => void;
  onSave: (name: string) => void;
};

const RecommendationCreateListModal = ({
  onClose,
  onSave,
}: RecommendationCreateListModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [name, setName] = useState("");
  const [error, setError] = useState("");

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

  const handleSave = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Ingresa un nombre para la lista.");
      return;
    }

    onSave(trimmedName);
  };

  return createPortal(
    <div
      ref={modalRef}
      className="modal fade recommendation-create-list-modal"
      tabIndex={-1}
      aria-labelledby="recommendation-create-list-modal-title"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered recommendation-create-list-modal__dialog">
        <div className="modal-content recommendation-create-list-modal__content">
          <div className="modal-header recommendation-create-list-modal__header">
            <h2
              className="recommendation-create-list-modal__title"
              id="recommendation-create-list-modal-title"
            >
              Crear una nueva lista
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            />
          </div>

          <div className="modal-body recommendation-create-list-modal__body">
            <label
              className="recommendation-create-list-modal__label"
              htmlFor="recommendation-create-list-name"
            >
              Nombre:
            </label>
            <input
              id="recommendation-create-list-name"
              type="text"
              className="form-control recommendation-create-list-modal__input"
              placeholder="Top Clientes"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSave();
                }
              }}
            />
            {error ? (
              <p className="recommendation-create-list-modal__error" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="modal-footer recommendation-create-list-modal__footer">
            <button
              type="button"
              className="btn btn-purple recommendation-create-list-modal__save"
              onClick={handleSave}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RecommendationCreateListModal;
