import type { RefObject } from "react";

export type SearchFormOptionRenderProps = {
  selectedDestinoId: string;
  selectedPasajerosId: string;
  onSelectDestination: (destinoId: string) => void;
  onSelectPassengers: (pasajerosId: string) => void;
};

export type SearchFormExpandablePanelProps = {
  isMobileSearchUI: boolean;
  location: boolean;
  passengers: boolean;
  selectedDestinoId: string;
  selectedPasajerosId: string;
  dateRange: Date[];
  keyword: string;
  keywordEditing: boolean;
  keywordSheetOpen: boolean;
  locationRef: RefObject<HTMLDivElement | null>;
  passengersRef: RefObject<HTMLDivElement | null>;
  keywordInputRef: RefObject<HTMLInputElement | null>;
  flatpickrRef: RefObject<any>;
  setLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setPassengers: React.Dispatch<React.SetStateAction<boolean>>;
  setKeywordSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDateRange: React.Dispatch<React.SetStateAction<Date[]>>;
  onSelectDestination: (destinoId: string) => void;
  onSelectPassengers: (pasajerosId: string) => void;
  handleKeywordTriggerClick: () => void;
  handleKeywordBlur: (value: string) => void;
  submitSearch: (keywordOverride?: string) => void;
};
