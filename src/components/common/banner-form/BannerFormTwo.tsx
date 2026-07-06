"use client";
import { useEffect, useRef, useState } from "react";
import { preventNativeFormSubmit } from "@/utils/preventNativeFormSubmit";
import BannerFormTwoExpandedFields from "./BannerFormTwoExpandedFields";

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

  return (
    <form className="banner-form-two" onSubmit={preventNativeFormSubmit}>
      <div
        className={`tg-booking-form-input-group d-flex align-items-center justify-content-between${searchOpen ? "" : " banner-form-two-collapsed"}`}
      >
        {searchOpen && (
          <BannerFormTwoExpandedFields
            location={location}
            passengers={passengers}
            selectedDestination={selectedDestination}
            selectedPassengers={selectedPassengers}
            dateRange={dateRange}
            keyword={keyword}
            keywordEditing={keywordEditing}
            locationRef={locationRef}
            passengersRef={passengersRef}
            keywordInputRef={keywordInputRef}
            flatpickrRef={flatpickrRef}
            setLocation={setLocation}
            setPassengers={setPassengers}
            setDateRange={setDateRange}
            setKeywordEditing={setKeywordEditing}
            handleSelectDestination={handleSelectDestination}
            handleSelectPassengers={handleSelectPassengers}
            handleKeywordBlur={handleKeywordBlur}
          />
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
                    d="M13.22 13.22L10.52 10.52M12.20 6.49C12.20 9.64 9.64 12.20 6.49 12.20C3.33 12.20 0.78 9.64 0.78 6.49C0.78 3.33 3.33 0.78 6.49 0.78C9.64 0.78 12.20 3.33 12.20 6.49Z"
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
