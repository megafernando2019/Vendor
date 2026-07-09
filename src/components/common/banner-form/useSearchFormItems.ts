"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import { fetchBusqueda, setItemSearch } from "@/redux/slices/searchSlice";
import { resetView } from "@/redux/slices/viewSlice";
import { useDelayedPanelItems } from "@/hooks/useDelayedPanelItems";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRestoredSearchFormFields } from "@/hooks/useSyncSearchFormFromStore";
import { useIsClient } from "@/hooks/useIsClient";
import {
  computePickerAnchorStyle,
  type PickerAnchorStyle,
} from "./computePickerAnchorStyle";
import {
  buildBusquedaPayload,
  DEFAULT_DESTINO_ID,
  DEFAULT_PASAJEROS_ID,
  getDefaultDateRange,
  MOBILE_SEARCH_MQ,
  RESPONSIVE_PICKER_MQ,
} from "./searchFormItemsUtils";

type UseSearchFormItemsOptions = {
  searchOpen: boolean;
  onToggle: () => void;
};

export const useSearchFormItems = ({
  searchOpen,
  onToggle,
}: UseSearchFormItemsOptions) => {
  const formFieldsVisible = useDelayedPanelItems(searchOpen);
  const isMobileSearchUI = useMediaQuery(MOBILE_SEARCH_MQ);
  const isResponsivePickerUI = useMediaQuery(RESPONSIVE_PICKER_MQ);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [location, setLocationState] = useState(false);
  const [passengers, setPassengersState] = useState(false);
  const [selectedDestinoId, setSelectedDestinoId] =
    useState(DEFAULT_DESTINO_ID);
  const [selectedPasajerosId, setSelectedPasajerosId] =
    useState(DEFAULT_PASAJEROS_ID);
  const [dateRange, setDateRange] = useState<Date[]>(getDefaultDateRange);
  const [keyword, setKeyword] = useState("");
  const [keywordEditing, setKeywordEditing] = useState(false);
  const [keywordSheetOpen, setKeywordSheetOpenState] = useState(false);
  const mounted = useIsClient();
  const [prevFormFieldsVisible, setPrevFormFieldsVisible] =
    useState(formFieldsVisible);

  const locationRef = useRef<HTMLDivElement>(null);
  const passengersRef = useRef<HTMLDivElement>(null);
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const keywordSheetInputRef = useRef<HTMLInputElement>(null);
  const flatpickrRef = useRef<any>(null);
  const pickerDialogRef = useRef<HTMLDialogElement>(null);
  const keywordDialogRef = useRef<HTMLDialogElement>(null);
  const pickerOpenRef = useRef({ location: false, passengers: false });
  const [pickerAnchorStyle, setPickerAnchorStyle] = useState<PickerAnchorStyle | null>(
    null,
  );
  const [storeFieldsSynced, setStoreFieldsSynced] = useState(false);

  const restoredSearchFields = useRestoredSearchFormFields({
    defaultDestinoId: DEFAULT_DESTINO_ID,
    defaultPasajerosId: DEFAULT_PASAJEROS_ID,
    getDefaultDateRange,
  });

  if (restoredSearchFields && !storeFieldsSynced) {
    setStoreFieldsSynced(true);
    setSelectedDestinoId(restoredSearchFields.destinoId);
    setSelectedPasajerosId(restoredSearchFields.pasajerosId);
    setKeyword(restoredSearchFields.keyword);

    if (restoredSearchFields.dateRange) {
      setDateRange(restoredSearchFields.dateRange);
    }
  }

  const syncPickerDialog = (open: boolean) => {
    if (!isResponsivePickerUI || !mounted) return;
    requestAnimationFrame(() => {
      const dialog = pickerDialogRef.current;
      if (!dialog) return;
      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }

      if (!open) {
        setPickerAnchorStyle(null);
        return;
      }

      const anchorEl = pickerOpenRef.current.location
        ? locationRef.current
        : passengersRef.current;

      if (!anchorEl) return;

      setPickerAnchorStyle(
        computePickerAnchorStyle(anchorEl, {
          preferAbove: isMobileSearchUI,
        }),
      );
    });
  };

  const syncKeywordDialog = (open: boolean) => {
    if (!isMobileSearchUI || !mounted) return;
    requestAnimationFrame(() => {
      const dialog = keywordDialogRef.current;
      if (!dialog) return;
      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    });
  };

  const recomputePickerDialog = () => {
    syncPickerDialog(
      pickerOpenRef.current.location || pickerOpenRef.current.passengers,
    );
  };

  const setLocation: Dispatch<SetStateAction<boolean>> = (value) => {
    setLocationState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      pickerOpenRef.current.location = next;
      recomputePickerDialog();
      return next;
    });
  };

  const setPassengers: Dispatch<SetStateAction<boolean>> = (value) => {
    setPassengersState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      pickerOpenRef.current.passengers = next;
      recomputePickerDialog();
      return next;
    });
  };

  const setKeywordSheetOpen: Dispatch<SetStateAction<boolean>> = (value) => {
    setKeywordSheetOpenState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      syncKeywordDialog(next);
      return next;
    });
  };

  const closeAllMobileDialogs = () => {
    pickerOpenRef.current = { location: false, passengers: false };
    syncPickerDialog(false);
    syncKeywordDialog(false);
  };

  if (formFieldsVisible !== prevFormFieldsVisible) {
    setPrevFormFieldsVisible(formFieldsVisible);
    if (!formFieldsVisible) {
      pickerOpenRef.current = { location: false, passengers: false };
      setLocationState(false);
      setPassengersState(false);
      setKeywordEditing(false);
      setKeywordSheetOpenState(false);
      closeAllMobileDialogs();
    }
  }

  const closeKeywordSheet = (saveValue = true) => {
    if (saveValue && keywordSheetInputRef.current) {
      setKeyword(keywordSheetInputRef.current.value.trim());
    }
    setKeywordSheetOpenState(false);
    syncKeywordDialog(false);
  };

  const openKeywordSheet = () => {
    pickerOpenRef.current = { location: false, passengers: false };
    setLocationState(false);
    setPassengersState(false);
    syncPickerDialog(false);
    setKeywordEditing(false);
    setKeywordSheetOpenState(true);
    syncKeywordDialog(true);
    requestAnimationFrame(() => {
      keywordSheetInputRef.current?.focus();
    });
  };

  const handleKeywordTriggerClick = () => {
    setLocation(false);
    setPassengers(false);

    if (isMobileSearchUI) {
      openKeywordSheet();
      return;
    }

    if (!keywordEditing) {
      setKeywordEditing(true);
      requestAnimationFrame(() => {
        keywordInputRef.current?.focus();
      });
    }
  };

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

  const closeMobilePickers = () => {
    pickerOpenRef.current = { location: false, passengers: false };
    setLocationState(false);
    setPassengersState(false);
    syncPickerDialog(false);
  };

  const closeKeywordSheetRef = useRef(closeKeywordSheet);
  const closeMobilePickersRef = useRef(closeMobilePickers);
  const setLocationRef = useRef(setLocation);
  const setPassengersRef = useRef(setPassengers);
  closeKeywordSheetRef.current = closeKeywordSheet;
  closeMobilePickersRef.current = closeMobilePickers;
  setLocationRef.current = setLocation;
  setPassengersRef.current = setPassengers;

  const mobilePickerOpen =
    isResponsivePickerUI && mounted && (location || passengers);

  const updatePickerAnchor = useCallback(() => {
    if (!isResponsivePickerUI || (!location && !passengers)) {
      setPickerAnchorStyle(null);
      return;
    }

    const anchorEl = location ? locationRef.current : passengersRef.current;
    if (!anchorEl) return;

    setPickerAnchorStyle(
      computePickerAnchorStyle(anchorEl, {
        preferAbove: isMobileSearchUI,
      }),
    );
  }, [isResponsivePickerUI, isMobileSearchUI, location, passengers]);

  useLayoutEffect(() => {
    if (!isResponsivePickerUI || (!location && !passengers)) {
      setPickerAnchorStyle(null);
      return;
    }

    updatePickerAnchor();

    const frame = requestAnimationFrame(() => {
      updatePickerAnchor();
      requestAnimationFrame(updatePickerAnchor);
    });

    return () => cancelAnimationFrame(frame);
  }, [
    isResponsivePickerUI,
    isMobileSearchUI,
    location,
    passengers,
    formFieldsVisible,
    searchOpen,
    updatePickerAnchor,
  ]);

  useEffect(() => {
    if (!mobilePickerOpen) return;

    const handleReposition = () => updatePickerAnchor();

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [mobilePickerOpen, location, passengers, isResponsivePickerUI, updatePickerAnchor]);

  useEffect(() => {
    const shouldLockScroll =
      keywordSheetOpen || (isResponsivePickerUI && (location || passengers));

    document.body.style.overflow = shouldLockScroll ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [keywordSheetOpen, isResponsivePickerUI, location, passengers]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (keywordSheetOpen) {
        closeKeywordSheetRef.current(true);
        return;
      }

      if (isResponsivePickerUI && (location || passengers)) {
        closeMobilePickersRef.current();
      }
    };

    if (!keywordSheetOpen && !(isResponsivePickerUI && (location || passengers))) {
      return;
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [keywordSheetOpen, isResponsivePickerUI, location, passengers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const calendarEl = flatpickrRef.current?.flatpickr?.calendarContainer;
      if (calendarEl && calendarEl.contains(target)) return;

      if (pickerDialogRef.current?.contains(target)) return;

      if (locationRef.current && !locationRef.current.contains(target)) {
        setLocationRef.current(false);
      }
      if (passengersRef.current && !passengersRef.current.contains(target)) {
        setPassengersRef.current(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchOpen) {
      void submitSearch();
      return;
    }
    onToggle();
  };

  return {
    formFieldsVisible,
    isMobileSearchUI,
    isResponsivePickerUI,
    location,
    passengers,
    selectedDestinoId,
    selectedPasajerosId,
    dateRange,
    keyword,
    keywordEditing,
    keywordSheetOpen,
    mounted,
    locationRef,
    passengersRef,
    keywordInputRef,
    keywordSheetInputRef,
    flatpickrRef,
    pickerDialogRef,
    keywordDialogRef,
    setLocation,
    setPassengers,
    setKeywordSheetOpen,
    setDateRange,
    setKeyword,
    handleKeywordTriggerClick,
    handleKeywordBlur,
    submitSearch,
    handleSearchButtonClick,
    closeMobilePickers,
    mobilePickerOpen,
    pickerAnchorStyle,
    closeKeywordSheet,
    handleSelectDestination,
    handleSelectPassengers,
    handleFormSubmit,
  };
};
