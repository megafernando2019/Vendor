"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RecommendationCard } from "@/utils/recommendations";
import { ShareIcon } from "./recommendationCardMediaShared";

type RecommendationShareModalProps = {
  item: RecommendationCard;
  onClose: () => void;
};

const EmailChannelIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" fill="#4A90D9" />
    <path
      d="M3 7l9 6 9-6"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WhatsAppChannelIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="12" r="10" fill="#25D366" />
    <path
      d="M9.5 8.5c.2-.5.5-.5.7-.5h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2.1.4 0 .5l-.4.5c-.1.1-.1.3 0 .4.3.5.8 1 1.3 1.3.1.1.3.1.4 0l.5-.4c.1-.1.3-.1.5 0l1.4.6c.3.1.3.3.3.4v.4c0 .2 0 .5-.5.7-1 .4-2.1.2-3.4-.7-1.4-1-2.5-2.4-3.2-3.8-.4-.8-.6-1.6-.4-2.4Z"
      fill="#fff"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

function buildShareUrl(clv: string) {
  if (typeof window === "undefined") {
    return `/tour-details?mt=${encodeURIComponent(clv)}`;
  }

  return `${window.location.origin}/tour-details?mt=${encodeURIComponent(clv)}`;
}

function buildQrImageUrl(shareUrl: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`;
}

const RecommendationShareModal = ({
  item,
  onClose,
}: RecommendationShareModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shareError, setShareError] = useState("");

  const shareUrl = useMemo(() => buildShareUrl(item.clv), [item.clv]);
  const qrImageUrl = useMemo(() => buildQrImageUrl(shareUrl), [shareUrl]);
  const shareMessage = `${item.title} - ${shareUrl}`;

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

  const handleDownloadPdf = () => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleShare = () => {
    setShareError("");

    const actions: Array<() => void> = [];

    if (emailEnabled) {
      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setShareError("Ingresa un correo electrónico válido.");
        return;
      }

      actions.push(() => {
        const subject = encodeURIComponent(item.title);
        const body = encodeURIComponent(shareMessage);
        window.location.href = `mailto:${trimmedEmail}?subject=${subject}&body=${body}`;
      });
    }

    if (whatsappEnabled) {
      const digits = phone.replace(/\D/g, "");

      if (!digits) {
        setShareError("Ingresa un número telefónico válido.");
        return;
      }

      actions.push(() => {
        const text = encodeURIComponent(shareMessage);
        window.open(
          `https://wa.me/${digits}?text=${text}`,
          "_blank",
          "noopener,noreferrer",
        );
      });
    }

    if (actions.length === 0) {
      setShareError("Selecciona al menos un método para compartir.");
      return;
    }

    actions.forEach((action) => action());
  };

  return createPortal(
    <div
      ref={modalRef}
      className="modal fade recommendation-share-modal"
      tabIndex={-1}
      aria-labelledby="recommendation-share-modal-title"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered recommendation-share-modal__dialog">
        <div className="modal-content recommendation-share-modal__content">
          <div className="modal-header recommendation-share-modal__header">
            <div className="recommendation-share-modal__heading">
              <div className="recommendation-share-modal__title-row">
                <span className="recommendation-share-modal__title-icon">
                  <ShareIcon />
                </span>
                <h2
                  className="recommendation-share-modal__title"
                  id="recommendation-share-modal-title"
                >
                  Compartir
                </h2>
              </div>
              <p className="recommendation-share-modal__subtitle">
                Elige como compartir información sobre este programa
              </p>
            </div>
            <button
              type="button"
              className="btn-close recommendation-share-modal__close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            />
          </div>

          <div className="modal-body recommendation-share-modal__body">
            <div className="recommendation-share-modal__layout">
              <div className="recommendation-share-modal__options">
                <p className="recommendation-share-modal__section-label">
                  Selecciona para compartir
                </p>

                <div className="recommendation-share-modal__channel">
                  <label className="recommendation-share-modal__channel-label">
                    <input
                      type="checkbox"
                      className="form-check-input recommendation-share-modal__checkbox"
                      checked={emailEnabled}
                      onChange={(event) => setEmailEnabled(event.target.checked)}
                    />
                    <span className="recommendation-share-modal__channel-icon">
                      <EmailChannelIcon />
                    </span>
                    <span>Correo electrónico</span>
                  </label>
                  <input
                    type="email"
                    className="form-control recommendation-share-modal__input"
                    placeholder="Ingresa correo electrónico para compartir"
                    value={email}
                    disabled={!emailEnabled}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="recommendation-share-modal__channel">
                  <label className="recommendation-share-modal__channel-label">
                    <input
                      type="checkbox"
                      className="form-check-input recommendation-share-modal__checkbox"
                      checked={whatsappEnabled}
                      onChange={(event) =>
                        setWhatsappEnabled(event.target.checked)
                      }
                    />
                    <span className="recommendation-share-modal__channel-icon">
                      <WhatsAppChannelIcon />
                    </span>
                    <span>WhatsApp</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control recommendation-share-modal__input"
                    placeholder="Ingresa número telefónico para compartir"
                    value={phone}
                    disabled={!whatsappEnabled}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="recommendation-share-modal__pdf-btn"
                  onClick={handleDownloadPdf}
                >
                  <DownloadIcon />
                  Descargar PDF
                </button>
              </div>

              <div className="recommendation-share-modal__qr-panel">
                <p className="recommendation-share-modal__qr-title">¡Escanea!</p>
                <img
                  src={qrImageUrl}
                  alt={`Código QR para compartir ${item.title}`}
                  className="recommendation-share-modal__qr-image"
                  width={220}
                  height={220}
                />
              </div>
            </div>

            {shareError ? (
              <p className="recommendation-share-modal__error" role="alert">
                {shareError}
              </p>
            ) : null}
          </div>

          <div className="modal-footer recommendation-share-modal__footer">
            <button
              type="button"
              className="btn btn-purple recommendation-share-modal__submit"
              onClick={handleShare}
            >
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RecommendationShareModal;
