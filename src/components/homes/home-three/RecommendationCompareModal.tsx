"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RecommendationCard } from "@/utils/recommendations";
import {
  buildCompareProgramContext,
  formatCompareProgramLabel,
} from "@/utils/recommendationCompare";
import { CompareIcon, formatPrice } from "./recommendationCardMediaShared";

type RecommendationCompareModalProps = {
  item: RecommendationCard;
  compareOptions?: RecommendationCard[];
  onClose: () => void;
};

type CompareColumnKind = "program" | "similar" | "selection";

type CompareColumnProps = {
  kind: CompareColumnKind;
  item: RecommendationCard;
  selectable?: boolean;
  selectedClv?: string;
  selectionOptions?: RecommendationCard[];
  onSelectionChange?: (clv: string) => void;
};

const SunIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z" />
  </svg>
);

const GlobeIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
  </svg>
);

const CitiesIcon = () => (
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
    <path d="M3 21h18M6 21V7l6-4 6 4v14M10 10h4M10 14h4M10 18h4" />
  </svg>
);

const COLUMN_LABELS: Record<CompareColumnKind, string> = {
  program: "Programa",
  similar: "Similar",
  selection: "Tu selección",
};

function formatListValue(values: string[], fallback: string) {
  if (values.length === 0) return fallback;
  return values.join(", ");
}

const CompareColumn = ({
  kind,
  item,
  selectable = false,
  selectedClv,
  selectionOptions = [],
  onSelectionChange,
}: CompareColumnProps) => {
  const countriesText = formatListValue(item.countries, item.location || "—");
  const citiesText = formatListValue(
    item.cities,
    item.location || "Información no disponible",
  );

  return (
    <article className={`recommendation-compare-modal__column recommendation-compare-modal__column--${kind}`}>
      <span className="recommendation-compare-modal__column-badge">
        {COLUMN_LABELS[kind]}
      </span>

      {selectable ? (
        <label className="recommendation-compare-modal__select-wrap">
          <span className="visually-hidden">Seleccionar programa para comparar</span>
          <select
            className="form-select recommendation-compare-modal__select"
            value={selectedClv}
            onChange={(event) => onSelectionChange?.(event.target.value)}
          >
            {selectionOptions.map((option) => (
              <option key={option.clv} value={option.clv}>
                {formatCompareProgramLabel(option)}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="recommendation-compare-modal__program-box">
          {formatCompareProgramLabel(item)}
        </div>
      )}

      <p className="recommendation-compare-modal__price">
        <span className="recommendation-compare-modal__price-label">Desde</span>
        <span className="recommendation-compare-modal__price-value">
          {formatPrice(item.price, item.currency)} {item.currency}
        </span>
      </p>

      <div className="recommendation-compare-modal__duration-row">
        <span className="recommendation-compare-modal__duration-pill">
          <SunIcon />
          {item.days} días
        </span>
        <span className="recommendation-compare-modal__duration-pill">
          <MoonIcon />
          {item.nights} noches
        </span>
      </div>

      <div className="recommendation-compare-modal__detail">
        <div className="recommendation-compare-modal__detail-heading">
          <GlobeIcon />
          <span>Países</span>
        </div>
        <p className="recommendation-compare-modal__detail-text">{countriesText}</p>
      </div>

      <div className="recommendation-compare-modal__detail">
        <div className="recommendation-compare-modal__detail-heading">
          <CitiesIcon />
          <span>Ciudades</span>
        </div>
        <p className="recommendation-compare-modal__detail-text">{citiesText}</p>
      </div>
    </article>
  );
};

const RecommendationCompareModal = ({
  item,
  compareOptions = [],
  onClose,
}: RecommendationCompareModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const compareContext = useMemo(
    () => buildCompareProgramContext(item, compareOptions),
    [compareOptions, item],
  );

  const [selectedClv, setSelectedClv] = useState(
    compareContext.defaultSelection?.clv ?? item.clv,
  );

  const selectedProgram = useMemo(() => {
    return (
      compareContext.selectionOptions.find((entry) => entry.clv === selectedClv) ??
      compareContext.defaultSelection ??
      item
    );
  }, [compareContext.defaultSelection, compareContext.selectionOptions, item, selectedClv]);

  useEffect(() => {
    setSelectedClv(compareContext.defaultSelection?.clv ?? item.clv);
  }, [compareContext.defaultSelection?.clv, item.clv]);

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
      className="modal fade recommendation-compare-modal"
      tabIndex={-1}
      aria-labelledby="recommendation-compare-modal-title"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable recommendation-compare-modal__dialog">
        <div className="modal-content recommendation-compare-modal__content">
          <div className="modal-header recommendation-compare-modal__header">
            <div className="recommendation-compare-modal__title-row">
              <span className="recommendation-compare-modal__title-icon">
                <CompareIcon />
              </span>
              <h2
                className="recommendation-compare-modal__title"
                id="recommendation-compare-modal-title"
              >
                Comparar programa
              </h2>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            />
          </div>

          <div className="modal-body recommendation-compare-modal__body">
            <div className="recommendation-compare-modal__columns">
              <CompareColumn kind="program" item={compareContext.program} />

              {compareContext.similar ? (
                <CompareColumn kind="similar" item={compareContext.similar} />
              ) : (
                <article className="recommendation-compare-modal__column recommendation-compare-modal__column--similar recommendation-compare-modal__column--empty">
                  <span className="recommendation-compare-modal__column-badge">
                    Similar
                  </span>
                  <p className="recommendation-compare-modal__empty-text">
                    No hay un programa similar disponible para comparar.
                  </p>
                </article>
              )}

              <CompareColumn
                kind="selection"
                item={selectedProgram}
                selectable
                selectedClv={selectedClv}
                selectionOptions={compareContext.selectionOptions}
                onSelectionChange={setSelectedClv}
              />
            </div>
          </div>

          <div className="modal-footer recommendation-compare-modal__footer">
            <p className="recommendation-compare-modal__disclaimer">
              <span aria-hidden="true">ⓘ</span>
              Los precios pueden variar según la fecha de salida
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RecommendationCompareModal;
