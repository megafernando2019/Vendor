"use client";
import { useEffect, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import {
  fetchBusqueda,
  setItemSearch,
  type ItemSearch,
} from "@/redux/slices/searchSlice";
import { resetView } from "@/redux/slices/viewSlice";

const destinoOptions = [
  { value: "3", label: "Europa", icon: "/assets/img/icons/Europa.png" },
  { value: "7", label: "Medio Oriente", icon: "/assets/img/icons/MedioOriente.png" },
  { value: "11", label: "Asia", icon: "/assets/img/icons/Asia.png" },
  { value: "5", label: "Canada", icon: "/assets/img/icons/Canada.png" },
  { value: "6", label: "Estados Unidos", icon: "/assets/img/icons/EstadoUnidos.png" },
  { value: "8", label: "México", icon: "/assets/img/icons/Mexico.png" },
  { value: "10", label: "Centro América", icon: "/assets/img/icons/Centroamerica.png" },
  { value: "9", label: "Sudamerica", icon: "/assets/img/icons/Sudamerica.png" },
  { value: "12", label: "Caribe", icon: "/assets/img/icons/caribe.png" },
];

const pasajerosOptions = [
  { value: "1", label: "1 Pasajero", icon: "/assets/img/icons/Pasajeros.png" },
  { value: "2", label: "2 Pasajeros", icon: "/assets/img/icons/Pasajeros.png" },
  { value: "3", label: "3 Pasajeros", icon: "/assets/img/icons/Pasajeros.png" },
  { value: "4", label: "4 Pasajeros", icon: "/assets/img/icons/Pasajeros.png" },
  { value: "5", label: "5 Pasajeros", icon: "/assets/img/icons/Pasajeros.png" },
  { value: "6", label: "6 Pasajeros", icon: "/assets/img/icons/Pasajeros.png" },
  { value: "7", label: "7 Pasajeros", icon: "/assets/img/icons/Pasajeros.png" },
  { value: "8", label: "8 Pasajeros", icon: "/assets/img/icons/Pasajeros.png" },
];

const DEFAULT_DESTINO_ID = "3";
const DEFAULT_PASAJEROS_ID = "2";
const SEARCH_PAGE = 1;
const SEARCH_LIMIT = 20;
const API_DATE_FORMAT = "yyyy-MM-dd";

export type SearchFormData = {
  destinoId: string;
  pasajerosId: string;
  fechaInicio: string;
  fechaFin: string;
  keyword: string;
};

const getDefaultDateRange = (): Date[] => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  return [start, end];
};

const formatFormDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const buildSearchFormData = (
  destinoId: string,
  pasajerosId: string,
  dates: Date[],
  keyword: string,
): SearchFormData => ({
  destinoId,
  pasajerosId,
  fechaInicio: dates[0] ? formatFormDate(dates[0]) : "",
  fechaFin: dates[1] ? formatFormDate(dates[1]) : "",
  keyword,
});

const buildBusquedaPayload = (
  destinoId: string,
  pasajerosId: string,
  dates: Date[],
  keyword: string,
): ItemSearch => ({
  destination: Number(destinoId),
  passengers: Number(pasajerosId),
  startRange: dates[0] ? format(dates[0], API_DATE_FORMAT) : "",
  endRange: dates[1] ? format(dates[1], API_DATE_FORMAT) : "",
  search: keyword.trim(),
  page: SEARCH_PAGE,
  limit: SEARCH_LIMIT,
});

interface FormItemsProps {
  searchOpen: boolean;
  onToggle: () => void;
}

const SearchFormItems = ({ searchOpen, onToggle }: FormItemsProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [location, setLocation] = useState(false);
  const [passengers, setPassengers] = useState(false);
  const [selectedDestinoId, setSelectedDestinoId] = useState(DEFAULT_DESTINO_ID);
  const [selectedPasajerosId, setSelectedPasajerosId] =
    useState(DEFAULT_PASAJEROS_ID);
  const [dateRange, setDateRange] = useState<Date[]>(getDefaultDateRange);
  const [keyword, setKeyword] = useState("");
  const [keywordEditing, setKeywordEditing] = useState(false);
  const [formData, setFormData] = useState<SearchFormData>(() =>
    buildSearchFormData(
      DEFAULT_DESTINO_ID,
      DEFAULT_PASAJEROS_ID,
      getDefaultDateRange(),
      "",
    ),
  );

  const locationRef = useRef<HTMLDivElement>(null);
  const passengersRef = useRef<HTMLDivElement>(null);
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const flatpickrRef = useRef<any>(null);

  const submitSearch = async (keywordOverride?: string) => {
    setLocation(false);
    setPassengers(false);

    const currentKeyword =
      keywordOverride ??
      (keywordEditing && keywordInputRef.current
        ? keywordInputRef.current.value.trim()
        : keyword);

    setKeyword(currentKeyword);
    setKeywordEditing(false);

    if (dateRange.length < 2) {
      toast.warn("Selecciona un rango de fechas completo", {
        position: "top-center",
      });
      return;
    }

    const payload = buildBusquedaPayload(
      selectedDestinoId,
      selectedPasajerosId,
      dateRange,
      currentKeyword,
    );

    try {
      dispatch(setItemSearch(payload));
      await dispatch(fetchBusqueda(payload)).unwrap();
      dispatch(resetView());
      router.push("/disponibilidad");
    } catch (error) {
      const message =
        typeof error === "string" && error.length > 0
          ? error
          : "No se pudo completar la búsqueda";
      toast.error(message, { position: "top-center" });
    }
  };

  const handleSearchButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!searchOpen) {
      onToggle();
      return;
    }

    submitSearch();
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

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (keywordEditing) {
      keywordInputRef.current?.focus();
    }
  }, [keywordEditing]);

  useEffect(() => {
    setFormData(
      buildSearchFormData(
        selectedDestinoId,
        selectedPasajerosId,
        dateRange,
        keyword,
      ),
    );
  }, [selectedDestinoId, selectedPasajerosId, dateRange, keyword]);

  const handleKeywordBlur = (value: string) => {
    setKeyword(value.trim());
    setKeywordEditing(false);
  };

  const handleSelectDestination = (destinoId: string) => {
    setSelectedDestinoId(destinoId);
    setLocation(false);
  };

  const handleSelectPassengers = (pasajerosId: string) => {
    setSelectedPasajerosId(pasajerosId);
    setPassengers(false);
  };

  const selectedDestinationData = destinoOptions.find(
    (dest) => dest.value === selectedDestinoId,
  );

  const selectedPasajerosData = pasajerosOptions.find(
    (option) => option.value === selectedPasajerosId,
  );

  return (
    <form className="banner-form-two" onSubmit={(e) => e.preventDefault()}>
      <div
        className={`tg-booking-form-input-group d-flex align-items-center justify-content-between${searchOpen ? "" : " banner-form-two-collapsed"}`}
      >
        <div
          className="banner-form-two-expandable d-flex align-items-center justify-content-between flex-grow-1 min-w-0"
          aria-hidden={!searchOpen}
        >
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
              {selectedDestinationData?.label ?? "Destino"}
            </span>
          </div>
          <div
            className={`tg-booking-form-location-list tg-booking-form-destino-list tg-booking-quantity-active ${location ? "tg-list-open" : ""}`}
          >
            <ul className="scrool-bar scrool-height pr-5">
              {destinoOptions.map((dest) => (
                <li
                  key={dest.value}
                  className={
                    selectedDestinoId === dest.value ? "selected" : ""
                  }
                  onClick={() => handleSelectDestination(dest.value)}
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
              {selectedPasajerosData?.label ?? "Pasajeros"}
            </span>
          </div>
          <div
            className={`tg-booking-form-location-list tg-booking-form-pasajeros-list tg-booking-quantity-active ${passengers ? "tg-list-open" : ""}`}
          >
            <ul className="scrool-bar scrool-height pr-5">
              {pasajerosOptions.map((option) => (
                <li
                  key={option.value}
                  className={
                    selectedPasajerosId === option.value ? "selected" : ""
                  }
                  onClick={() => handleSelectPassengers(option.value)}
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
                width={30}
                height={30}
                alt="Buscar"
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
                    e.preventDefault();
                    submitSearch(e.currentTarget.value.trim());
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
        </div>

        <div className="tg-booking-form-search-btn flex-shrink-0">
          <button
            className="btn btn-dark rounded-circle p-2"
            type="button"
            onClick={handleSearchButtonClick}
            aria-label={searchOpen ? "Buscar" : "Mostrar buscador"}
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

export default SearchFormItems;
