"use client";

import SearchFormExpandablePanel from "./SearchFormExpandablePanel";
import SearchFormPortals from "./SearchFormPortals";
import { useSearchFormItems } from "./useSearchFormItems";

export type { SearchFormData } from "./searchFormItemsUtils";

interface FormItemsProps {
  searchOpen: boolean;
  onToggle: () => void;
}

const SearchFormItems = ({ searchOpen, onToggle }: FormItemsProps) => {
  const form = useSearchFormItems({ searchOpen, onToggle });

  return (
    <form className="banner-form-two" onSubmit={form.handleFormSubmit}>
      <div
        className={`tg-booking-form-input-group align-items-center${searchOpen ? "" : " banner-form-two-collapsed"}`}
      >
        <div
          className={`banner-form-two-expandable min-w-0${searchOpen && form.formFieldsVisible ? " banner-form-two-expandable--visible" : ""}${searchOpen ? " banner-form-two-expandable--open" : ""}`}
          aria-hidden={!searchOpen || !form.formFieldsVisible}
        >
          <SearchFormExpandablePanel
            isMobileSearchUI={form.isMobileSearchUI}
            isResponsivePickerUI={form.isResponsivePickerUI}
            location={form.location}
            passengers={form.passengers}
            selectedDestinoId={form.selectedDestinoId}
            selectedPasajerosId={form.selectedPasajerosId}
            dateRange={form.dateRange}
            keyword={form.keyword}
            keywordEditing={form.keywordEditing}
            keywordSheetOpen={form.keywordSheetOpen}
            locationRef={form.locationRef}
            passengersRef={form.passengersRef}
            keywordInputRef={form.keywordInputRef}
            flatpickrRef={form.flatpickrRef}
            setLocation={form.setLocation}
            setPassengers={form.setPassengers}
            setKeywordSheetOpen={form.setKeywordSheetOpen}
            setDateRange={form.setDateRange}
            onSelectDestination={form.handleSelectDestination}
            onSelectPassengers={form.handleSelectPassengers}
            handleKeywordTriggerClick={form.handleKeywordTriggerClick}
            handleKeywordBlur={form.handleKeywordBlur}
            submitSearch={form.submitSearch}
          />
        </div>

        <div className="tg-booking-form-search-btn flex-shrink-0">
          <button
            className="btn btn-dark rounded-circle banner-form-two-icon-btn"
            type="button"
            onClick={form.handleSearchButtonClick}
            aria-label={searchOpen ? "Buscar" : "Mostrar buscador"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
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
          </button>
        </div>
      </div>

      <SearchFormPortals
        location={form.location}
        passengers={form.passengers}
        closeMobilePickers={form.closeMobilePickers}
        mounted={form.mounted}
        keyword={form.keyword}
        keywordSheetInputRef={form.keywordSheetInputRef}
        closeKeywordSheet={form.closeKeywordSheet}
        setKeyword={form.setKeyword}
        submitSearch={form.submitSearch}
        selectedDestinoId={form.selectedDestinoId}
        selectedPasajerosId={form.selectedPasajerosId}
        onSelectDestination={form.handleSelectDestination}
        onSelectPassengers={form.handleSelectPassengers}
        pickerDialogRef={form.pickerDialogRef}
        keywordDialogRef={form.keywordDialogRef}
        pickerAnchorStyle={form.pickerAnchorStyle}
      />
    </form>
  );
};

export default SearchFormItems;
