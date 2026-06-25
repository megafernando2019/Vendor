"use client";
import { useEffect, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import Image from "next/image";

const destinations = [
  { label: "Europa", icon: "/assets/img/icons/Europa.png" },
  { label: "Medio Oriente", icon: "/assets/img/icons/MedioOriente.png" },
  { label: "Asia", icon: "/assets/img/icons/Asia.png" },
  { label: "Canadá", icon: "/assets/img/icons/Canada.png" },
  { label: "Estados Unidos", icon: "/assets/img/icons/EstadoUnidos.png" },
  { label: "México", icon: "/assets/img/icons/Mexico.png" },
  { label: "Centro América", icon: "/assets/img/icons/Centroamerica.png" },
  { label: "Sudamérica", icon: "/assets/img/icons/Sudamerica.png" },
  { label: "Caribe", icon: "/assets/img/icons/caribe.png" },
];

const passengerOptions = Array.from({ length: 8 }, (_, i) => ({
  label: i === 0 ? "1 pasajero" : `${i + 1} pasajeros`,
  icon: "/assets/img/icons/Pasajeros.png",
}));

interface BannerFormTwoProps {
  setOpen?: () => void;
}

const BannerFormTwo = ({ setOpen = () => {} }: BannerFormTwoProps) => {
  const [location, setLocation] = useState(false);
  const [passengers, setPassengers] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null,
  );
  const [selectedPassengers, setSelectedPassengers] = useState<string | null>(
    null,
  );
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [keyword, setKeyword] = useState("");
  const [keywordEditing, setKeywordEditing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(true);

  const locationRef = useRef<HTMLDivElement>(null);
  const passengersRef = useRef<HTMLDivElement>(null);
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const flatpickrRef = useRef<any>(null);

  const searchOrChange = () => {
    setSearchOpen((prev) => {
      setOpen();
      return !prev;
    });
  };

  const handleSearchButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    searchOrChange();

  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const calendarEl = flatpickrRef.current?.flatpickr?.calendarContainer;
      if (calendarEl && calendarEl.contains(event.target as Node)) return;

      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setLocation(false);
      }
      if (
        passengersRef.current &&
        !passengersRef.current.contains(event.target as Node)
      ) {
        setPassengers(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (keywordEditing) {
      keywordInputRef.current?.focus();
    }
  }, [keywordEditing]);

  const handleKeywordBlur = (value: string) => {
    setKeyword(value.trim());
    setKeywordEditing(false);
  };

  const handleSelectDestination = (label: string) => {
    setSelectedDestination(label);
    setLocation(false);
  };

  const handleSelectPassengers = (label: string) => {
    setSelectedPassengers(label);
    setPassengers(false);
  };

  const selectedDestinationData = destinations.find(
    (dest) => dest.label === selectedDestination,
  );

  return (
    <form className="banner-form-two" onSubmit={(e) => e.preventDefault()}>
      <div
        className={`tg-booking-form-input-group d-flex align-items-center justify-content-between${searchOpen ? "" : " banner-form-two-collapsed"}`}
      >
        {searchOpen && (
          <>
        <div
          ref={locationRef}
          className="tg-booking-form-parent-inner tg-hero-quantity p-relative"
        >
          <div
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
                    d="M12.3329 6.7071C12.3329 11.2324 6.55512 15.1111 6.55512 15.1111C6.55512 15.1111 0.777344 11.2324 0.777344 6.7071C0.777344 5.16402 1.38607 3.68414 2.46962 2.59302C3.55316 1.5019 5.02276 0.888916 6.55512 0.888916C8.08748 0.888916 9.55708 1.5019 10.6406 2.59302C11.7242 3.68414 12.3329 5.16402 12.3329 6.7071Z"
                    stroke="currentColor"
                    strokeWidth="1.15556"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.55512 8.64649C7.61878 8.64649 8.48105 7.7782 8.48105 6.7071C8.48105 5.636 7.61878 4.7677 6.55512 4.7677C5.49146 4.7677 4.6292 5.636 4.6292 6.7071C4.6292 7.7782 5.49146 8.64649 6.55512 8.64649Z"
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
          </div>
          <div
            className={`tg-booking-form-location-list tg-booking-form-destino-list tg-booking-quantity-active ${location ? "tg-list-open" : ""}`}
          >
            <ul className="scrool-bar scrool-height pr-5">
              {destinations.map((dest) => (
                <li
                  key={dest.label}
                  className={
                    selectedDestination === dest.label ? "selected" : ""
                  }
                  onClick={() => handleSelectDestination(dest.label)}
                >
                  <Image
                    src={dest.icon}
                    width={30}
                    height={30}
                    alt={dest.label}
                  />
                  <span>{dest.label}</span>
                </li>
              ))}
            </ul>
          </div>{" "}
        </div>

        <div
          ref={passengersRef}
          className="tg-booking-form-parent-inner tg-hero-quantity p-relative"
        >
          <div
            onClick={() => {
              setLocation(false);
              setPassengers((prev) => !prev);
            }}
            className={`tg-booking-add-input-field tg-booking-form-field-pasajeros tg-booking-quantity-toggle ${passengers ? "active" : ""}`}
          >
            <span className="location">
              <Image
                src="/assets/img/icons/Pasajeros.png"
                width={30}
                height={30}
                alt="Pasajeros"
              />
            </span>
            <span className="tg-booking-title-value">
              {selectedPassengers || "Pasajeros"}
            </span>
          </div>
          <div
            className={`tg-booking-form-location-list tg-booking-form-pasajeros-list tg-booking-quantity-active ${passengers ? "tg-list-open" : ""}`}
          >
            <ul className="scrool-bar scrool-height pr-5">
              {passengerOptions.map((option) => (
                <li
                  key={option.label}
                  className={
                    selectedPassengers === option.label ? "selected" : ""
                  }
                  onClick={() => handleSelectPassengers(option.label)}
                >
                  <Image
                    src={option.icon}
                    width={30}
                    height={30}
                    alt={option.label}
                  />
                  <span>{option.label}</span>
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
                  d="M9.76501 0.777771V3.26668M4.23413 0.777771V3.26668M0.777344 5.75548H13.2218M2.16006 2.02211H11.8391C12.6027 2.02211 13.2218 2.57927 13.2218 3.26656V11.9778C13.2218 12.6651 12.6027 13.2222 11.8391 13.2222H2.16006C1.39641 13.2222 0.777344 12.6651 0.777344 11.9778V3.26656C0.777344 2.57927 1.39641 2.02211 2.16006 2.02211Z"
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
            />
          </div>
        </div>

        <div className="tg-booking-form-parent-inner tg-booking-form-field-keyword p-relative">
          <div
            onClick={() => {
              setLocation(false);
              setPassengers(false);
              if (!keywordEditing) setKeywordEditing(true);
            }}
            className={`tg-booking-add-input-field ${keywordEditing ? "active" : ""}`}
          >
            <span className="location">
              <Image
                src="/assets/img/icons/Buscar.png"
                alt="Buscar"
                width={30}
                height={30}
              />
            </span>
  
            {keywordEditing ? (
              <input
                ref={keywordInputRef}
                type="text"
                className="banner-form-two-keyword-input"
                defaultValue={keyword}
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => handleKeywordBlur(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
              />
            ) : (
              <span className="tg-booking-title-value">
                {keyword || "Palabra clave"}
              </span>
            )}
          </div>
        </div>
          </>
        )}

        <div className="tg-booking-form-search-btn">
          <button
            className="btn btn-dark rounded-circle p-3"
            type="button"
            onClick={handleSearchButtonClick}
            aria-label={searchOpen ? "Ocultar buscador" : "Mostrar buscador"}
          >
            <span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_53_103)">
                  <path
                    d="M13.2218 13.2222L10.5188 10.5192M12.1959 6.48705C12.1959 9.6402 9.63977 12.1963 6.48662 12.1963C3.33348 12.1963 0.777344 9.6402 0.777344 6.48705C0.777344 3.3339 3.33348 0.777771 6.48662 0.777771C9.63977 0.777771 12.1959 3.3339 12.1959 6.48705Z"
                    stroke="currentColor"
                    strokeWidth="1.575"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_53_103">
                    <rect width="14" height="14" fill="currentColor" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default BannerFormTwo;
