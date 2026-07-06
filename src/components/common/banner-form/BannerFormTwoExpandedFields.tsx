"use client";

import Flatpickr from "react-flatpickr";
import Image from "next/image";
import type { RefObject } from "react";

const destinations = [
  { label: "Europa", icon: "/assets/img/icons/Europa.webp" },
  { label: "Medio Oriente", icon: "/assets/img/icons/MedioOriente.webp" },
  { label: "Asia", icon: "/assets/img/icons/Asia.webp" },
  { label: "Canadá", icon: "/assets/img/icons/Canada.webp" },
  { label: "Estados Unidos", icon: "/assets/img/icons/EstadoUnidos.webp" },
  { label: "México", icon: "/assets/img/icons/Mexico.webp" },
  { label: "Centro América", icon: "/assets/img/icons/Centroamerica.webp" },
  { label: "Sudamérica", icon: "/assets/img/icons/Sudamerica.webp" },
  { label: "Caribe", icon: "/assets/img/icons/caribe.webp" },
];

const passengerOptions = Array.from({ length: 8 }, (_, i) => ({
  label: i === 0 ? "1 pasajero" : `${i + 1} pasajeros`,
  icon: "/assets/img/icons/Pasajeros.webp",
}));

type BannerFormTwoExpandedFieldsProps = {
  location: boolean;
  passengers: boolean;
  selectedDestination: string | null;
  selectedPassengers: string | null;
  dateRange: Date[];
  keyword: string;
  keywordEditing: boolean;
  locationRef: RefObject<HTMLDivElement | null>;
  passengersRef: RefObject<HTMLDivElement | null>;
  keywordInputRef: RefObject<HTMLInputElement | null>;
  flatpickrRef: RefObject<any>;
  setLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setPassengers: React.Dispatch<React.SetStateAction<boolean>>;
  setDateRange: React.Dispatch<React.SetStateAction<Date[]>>;
  setKeywordEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectDestination: (label: string) => void;
  handleSelectPassengers: (label: string) => void;
  handleKeywordBlur: (value: string) => void;
};

const BannerFormTwoExpandedFields = ({
  location,
  passengers,
  selectedDestination,
  selectedPassengers,
  dateRange,
  keyword,
  keywordEditing,
  locationRef,
  passengersRef,
  keywordInputRef,
  flatpickrRef,
  setLocation,
  setPassengers,
  setDateRange,
  setKeywordEditing,
  handleSelectDestination,
  handleSelectPassengers,
  handleKeywordBlur,
}: BannerFormTwoExpandedFieldsProps) => {
  const selectedDestinationData = destinations.find(
    (dest) => dest.label === selectedDestination,
  );

  return (
    <>
      <div
        ref={locationRef}
        className="tg-booking-form-parent-inner tg-hero-quantity p-relative"
      >
        <button
          type="button"
          onClick={() => {
            setPassengers(false);
            setLocation((prev) => !prev);
          }}
          className={`tg-booking-add-input-field tg-booking-form-field-destino tg-booking-quantity-toggle ${location ? "active" : ""}`}
        >
          <span className="location">
            {selectedDestinationData ? (
              <Image
                src={selectedDestinationData.icon}
                width={30}
                height={30}
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
          <span className="tg-booking-title-value">
            {selectedDestination || "Destino"}
          </span>
        </button>
        <div
          className={`tg-booking-form-location-list tg-booking-form-destino-list tg-booking-quantity-active ${location ? "tg-list-open" : ""}`}
        >
          <ul className="scrool-bar scrool-height pr-5">
            {destinations.map((dest) => (
              <li
                className={selectedDestination === dest.label ? "selected" : ""}
                key={dest.label}
              >
                <button
                  type="button"
                  className="tg-booking-form-option-btn"
                  onClick={() => handleSelectDestination(dest.label)}
                >
                  <Image
                    src={dest.icon}
                    width={30}
                    height={30}
                    alt={dest.label}
                  />
                  <span>{dest.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>{" "}
      </div>

      <div
        ref={passengersRef}
        className="tg-booking-form-parent-inner tg-hero-quantity p-relative"
      >
        <button
          type="button"
          onClick={() => {
            setLocation(false);
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
          <span className="tg-booking-title-value">
            {selectedPassengers || "Pasajeros"}
          </span>
        </button>
        <div
          className={`tg-booking-form-location-list tg-booking-form-pasajeros-list tg-booking-quantity-active ${passengers ? "tg-list-open" : ""}`}
        >
          <ul className="scrool-bar scrool-height pr-5">
            {passengerOptions.map((option) => (
              <li
                className={
                  selectedPassengers === option.label ? "selected" : ""
                }
                key={option.label}
              >
                <button
                  type="button"
                  className="tg-booking-form-option-btn"
                  onClick={() => handleSelectPassengers(option.label)}
                >
                  <Image
                    src={option.icon}
                    width={30}
                    height={30}
                    alt={option.label}
                  />
                  <span>{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>{" "}
      </div>

      <div className="tg-booking-form-parent-inner-range">
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
        {keywordEditing ? (
          <div className="tg-booking-add-input-field active">
            <span className="location">
              <Image
                src="/assets/img/icons/Buscar.webp"
                alt="Buscar"
                width={30}
                height={30}
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
                  e.currentTarget.blur();
                }
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setLocation(false);
              setPassengers(false);
              setKeywordEditing(true);
              requestAnimationFrame(() => {
                keywordInputRef.current?.focus();
              });
            }}
            className="tg-booking-add-input-field"
          >
            <span className="location">
              <Image
                src="/assets/img/icons/Buscar.webp"
                alt="Buscar"
                width={30}
                height={30}
              />
            </span>
            <span className="tg-booking-title-value">
              {keyword || "Palabra clave"}
            </span>
          </button>
        )}
      </div>
    </>
  );
};

export default BannerFormTwoExpandedFields;
