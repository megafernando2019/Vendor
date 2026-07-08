"use client";

import { createPortal } from "react-dom";
import type { RefObject } from "react";
import {
  pickerAnchorStyleToCssVars,
  type PickerAnchorStyle,
} from "./computePickerAnchorStyle";
import SearchFormDestinoOptions from "./SearchFormDestinoOptions";
import SearchFormPasajerosOptions from "./SearchFormPasajerosOptions";
import type { SearchFormOptionRenderProps } from "./searchFormOptionTypes";

export interface SearchFormPortalsProps extends SearchFormOptionRenderProps {
  location: boolean;
  passengers: boolean;
  closeMobilePickers: () => void;
  mounted: boolean;
  keyword: string;
  keywordSheetInputRef: RefObject<HTMLInputElement | null>;
  closeKeywordSheet: (saveValue?: boolean) => void;
  setKeyword: (value: string) => void;
  submitSearch: (keywordOverride?: string) => void;
  pickerDialogRef: RefObject<HTMLDialogElement | null>;
  keywordDialogRef: RefObject<HTMLDialogElement | null>;
  pickerAnchorStyle: PickerAnchorStyle | null;
}

const SearchFormPortals = ({
  location,
  passengers,
  closeMobilePickers,
  mounted,
  keyword,
  keywordSheetInputRef,
  closeKeywordSheet,
  setKeyword,
  submitSearch,
  selectedDestinoId,
  selectedPasajerosId,
  onSelectDestination,
  onSelectPassengers,
  pickerDialogRef,
  keywordDialogRef,
  pickerAnchorStyle,
}: SearchFormPortalsProps) => {
  if (!mounted) {
    return null;
  }

  const pickerPanelStyle =
    pickerAnchorStyle == null
      ? { visibility: "hidden" as const }
      : {
          ...pickerAnchorStyleToCssVars(pickerAnchorStyle),
          visibility: "visible" as const,
        };

  return (
    <>
      {createPortal(
        <dialog
          ref={pickerDialogRef}
          className="banner-form-two-picker-sheet-layer"
          aria-label={
            location ? "Seleccionar destino" : "Seleccionar pasajeros"
          }
          onCancel={() => closeMobilePickers()}
        >
          <button
            type="button"
            className="banner-form-two-picker-sheet-backdrop"
            aria-label="Cerrar selección"
            onClick={closeMobilePickers}
          />
          <div
            className={`banner-form-two tg-booking-form-location-list banner-form-two-picker-sheet banner-form-two-picker-sheet--portal banner-form-two-picker-sheet--open banner-form-two-picker-sheet--anchored${location ? " tg-booking-form-destino-list" : " tg-booking-form-pasajeros-list"} tg-list-open`}
            style={pickerPanelStyle}
          >
            <ul className="scrool-bar scrool-height pr-5">
              {location ? (
                <SearchFormDestinoOptions
                  selectedDestinoId={selectedDestinoId}
                  onSelectDestination={onSelectDestination}
                />
              ) : (
                <SearchFormPasajerosOptions
                  selectedPasajerosId={selectedPasajerosId}
                  onSelectPassengers={onSelectPassengers}
                />
              )}
            </ul>
          </div>
        </dialog>,
        document.body,
      )}

      {createPortal(
        <dialog
          ref={keywordDialogRef}
          className="banner-form-two-keyword-sheet"
          aria-label="Buscar por palabra clave"
          onCancel={() => closeKeywordSheet(true)}
        >
          <button
            type="button"
            className="banner-form-two-keyword-sheet-backdrop"
            aria-label="Cerrar búsqueda"
            onClick={() => closeKeywordSheet(true)}
          />
          <div className="banner-form-two-keyword-sheet-panel">
            <div className="banner-form-two-keyword-sheet-bar">
              <span className="banner-form-two-keyword-sheet-icon">
                <i
                  className="bi bi-search fs-4 text-dark"
                  aria-hidden="true"
                ></i>
              </span>
              <input
                ref={keywordSheetInputRef}
                type="search"
                enterKeyHint="search"
                className="banner-form-two-keyword-sheet-input"
                defaultValue={keyword}
                placeholder="Palabra clave"
                aria-label="Palabra clave"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    setKeyword(value);
                    closeKeywordSheet(false);
                    submitSearch(value);
                  }
                }}
              />
              <button
                type="button"
                className="banner-form-two-keyword-sheet-cancel"
                onClick={() => closeKeywordSheet(true)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </dialog>,
        document.body,
      )}
    </>
  );
};

export default SearchFormPortals;
