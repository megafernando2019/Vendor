"use client";

import Flatpickr from "react-flatpickr";
import Image from "next/image";
import SearchFormDestinoOptions from "./SearchFormDestinoOptions";
import SearchFormPasajerosOptions from "./SearchFormPasajerosOptions";
import { destinoOptions, pasajerosOptions } from "./searchFormOptionsData";
import type { SearchFormExpandablePanelProps } from "./searchFormOptionTypes";

const SearchFormExpandablePanel = ({
  isMobileSearchUI,
  location,
  passengers,
  selectedDestinoId,
  selectedPasajerosId,
  dateRange,
  keyword,
  keywordEditing,
  keywordSheetOpen,
  locationRef,
  passengersRef,
  keywordInputRef,
  flatpickrRef,
  setLocation,
  setPassengers,
  setKeywordSheetOpen,
  setDateRange,
  onSelectDestination,
  onSelectPassengers,
  handleKeywordTriggerClick,
  handleKeywordBlur,
  submitSearch,
}: SearchFormExpandablePanelProps) => {
  const selectedDestinationData = destinoOptions.find(
    (dest) => dest.value === selectedDestinoId,
  );
  const selectedPasajerosData = pasajerosOptions.find(
    (option) => option.value === selectedPasajerosId,
  );

  return (
    <div className="banner-form-two-expandable-inner d-flex align-items-center">
      <div
        ref={locationRef}
        className="tg-booking-form-parent-inner tg-hero-quantity p-relative"
      >
        <button
          type="button"
          onClick={() => {
            setPassengers(false);
            setKeywordSheetOpen(false);
            setLocation((prev) => !prev);
          }}
          className={`tg-booking-add-input-field tg-booking-form-field-destino tg-booking-quantity-toggle ${location ? "active" : ""}`}
        >
          <span className="location">
            {selectedDestinationData ? (
              <Image
                src={selectedDestinationData.icon}
                width={35}
                height={35}
                alt={selectedDestinationData.label}
              />
            ) : (
              <svg
                width="13"
                height="16"
                viewBox="0 0 13 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.33 6.71C12.33 11.23 6.56 15.11 6.56 15.11C6.56 15.11 0.78 11.23 0.78 6.71C0.78 5.16 1.39 3.68 2.47 2.59C3.55 1.50 5.02 0.89 6.56 0.89C8.09 0.89 9.56 1.50 10.64 2.59C11.72 3.68 12.33 5.16 12.33 6.71Z"
                  stroke="currentColor"
                  strokeWidth="1.15556"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.56 8.65C7.62 8.65 8.48 7.78 8.48 6.71C8.48 5.636 7.62 4.77 6.56 4.77C5.49 4.77 4.63 5.636 4.63 6.71C4.63 7.78 5.49 8.65 6.56 8.65Z"
                  stroke="currentColor"
                  strokeWidth="1.15556"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="tg-booking-title-value banner-form-two-field-text">
            {selectedDestinationData?.label ?? "Destino"}
          </span>
        </button>
        {!isMobileSearchUI && (
          <div
            className={`tg-booking-form-location-list tg-booking-form-destino-list tg-booking-quantity-active banner-form-two-picker-sheet banner-form-two-picker-sheet--inline${location ? " tg-list-open banner-form-two-picker-sheet--open" : ""}`}
          >
            <ul className="scrool-bar scrool-height pr-5">
              <SearchFormDestinoOptions
                selectedDestinoId={selectedDestinoId}
                onSelectDestination={onSelectDestination}
              />
            </ul>
          </div>
        )}{" "}
      </div>

      <div
        ref={passengersRef}
        className="tg-booking-form-parent-inner tg-hero-quantity p-relative"
      >
        <button
          type="button"
          onClick={() => {
            setLocation(false);
            setKeywordSheetOpen(false);
            setPassengers((prev) => !prev);
          }}
          className={`tg-booking-add-input-field tg-booking-form-field-pasajeros tg-booking-quantity-toggle ${passengers ? "active" : ""}`}
        >
          <span className="location">
            <Image
              src="/assets/img/icons/Pasajeros.webp"
              width={30}
              height={30}
              alt="Pasajeros"
            />
          </span>
          <span className="tg-booking-title-value banner-form-two-field-text">
            {selectedPasajerosData?.label ?? "Pasajeros"}
          </span>
        </button>
        {!isMobileSearchUI && (
          <div
            className={`tg-booking-form-location-list tg-booking-form-pasajeros-list tg-booking-quantity-active banner-form-two-picker-sheet banner-form-two-picker-sheet--inline${passengers ? " tg-list-open banner-form-two-picker-sheet--open" : ""}`}
          >
            <ul className="scrool-bar scrool-height pr-5">
              <SearchFormPasajerosOptions
                selectedPasajerosId={selectedPasajerosId}
                onSelectPassengers={onSelectPassengers}
              />
            </ul>
          </div>
        )}{" "}
      </div>

      <div className="tg-booking-form-parent-inner-range banner-form-two-form-field-dates">
        <div className="tg-booking-add-input-date p-relative">
          <span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.77 0.78V3.27M4.23 0.78V3.27M0.78 5.76H13.22M2.16 2.02H11.84C12.60 2.02 13.22 2.58 13.22 3.27V11.98C13.22 12.67 12.60 13.22 11.84 13.22H2.16C1.40 13.22 0.78 12.67 0.78 11.98V3.27C0.78 2.58 1.40 2.02 2.16 2.02Z"
                stroke="currentColor"
                strokeWidth="0.977778"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Flatpickr
            ref={flatpickrRef}
            value={dateRange}
            options={{
              mode: "range",
              dateFormat: "d/m/y",
              closeOnSelect: false,
            }}
            onChange={(selectedDates) => {
              setDateRange(selectedDates);
              if (selectedDates.length === 2) {
                flatpickrRef.current?.flatpickr.close();
              }
            }}
            className="input"
            placeholder="dd/mm/yyyy"
            aria-label="Rango de fechas"
          />
        </div>
      </div>

      <div className="tg-booking-form-parent-inner tg-booking-form-field-keyword p-relative">
        {!isMobileSearchUI && keywordEditing ? (
          <div className="tg-booking-add-input-field banner-form-two-keyword-trigger active">
            <span className="location">
              <Image
                src="/assets/img/icons/Buscar.webp"
                width={20}
                height={20}
                alt=""
                aria-hidden="true"
              />
            </span>
            <input
              ref={keywordInputRef}
              type="text"
              className="banner-form-two-keyword-input"
              defaultValue={keyword}
              aria-label="Palabra clave"
              onBlur={(e) => handleKeywordBlur(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitSearch(e.currentTarget.value.trim());
                }
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleKeywordTriggerClick}
            className={`tg-booking-add-input-field banner-form-two-keyword-trigger${keywordSheetOpen ? " banner-form-two-keyword-trigger--sheet-open" : ""}`}
            aria-label="Buscar por palabra clave"
            aria-expanded={keywordSheetOpen || keywordEditing}
          >
            <span className="location">
              <Image
                src="/assets/img/icons/Buscar.webp"
                width={20}
                height={20}
                alt=""
                aria-hidden="true"
              />
            </span>
            <span className="tg-booking-title-value banner-form-two-field-text">
              {keyword || "Palabra clave"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFormExpandablePanel;
