"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { usePersistBootstrapped } from "@/hooks/usePersistBootstrapped";
import { normalizeMtParam } from "@/utils/quoteWizardCalendar";
import {
  resolveQuoteWizardSearchParams,
  type QuoteWizardSearchParams,
} from "@/utils/quoteWizardSearchParams";
import {
  mapCotizarResponseToWizard,
  EMPTY_QUOTE_WIZARD_ADDITIONAL,
  type QuoteWizardTour,
  type QuoteWizardAdditional,
} from "@/utils/quoteWizardCotizar";
import type { WizardCalendarData } from "@/utils/quoteWizardCalendar";

type QuoteWizardTourState = {
  mt: string;
  tour: QuoteWizardTour | null;
  similarClv?: string;
  calendar: WizardCalendarData;
  countries: string;
  additional: QuoteWizardAdditional;
  searchParams: QuoteWizardSearchParams;
  loading: boolean;
  error: string | null;
  notFound: boolean;
};

const EMPTY_CALENDAR: WizardCalendarData = { months: [], dayPrices: {} };

export function useQuoteWizardTour(mt: string, enabled: boolean) {
  const bootstrapped = usePersistBootstrapped();
  const { itemSearch } = useAppSelector((state) => state.search);
  const [state, setState] = useState<QuoteWizardTourState>(() => ({
    mt: normalizeMtParam(mt),
    tour: null,
    calendar: EMPTY_CALENDAR,
    countries: "",
    additional: EMPTY_QUOTE_WIZARD_ADDITIONAL,
    searchParams: resolveQuoteWizardSearchParams(itemSearch),
    loading: true,
    error: null,
    notFound: false,
  }));

  useEffect(() => {
    if (!enabled || !bootstrapped) return;

    const normalizedMt = normalizeMtParam(mt);
    const searchParams = resolveQuoteWizardSearchParams(itemSearch);
    let cancelled = false;

    const loadTour = async () => {
      setState((prev) => ({
        ...prev,
        mt: normalizedMt,
        loading: true,
        error: null,
        notFound: false,
        searchParams,
      }));

      try {
        const res = await fetch("/api/getcotizar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            clv: normalizedMt,
            passengers: searchParams.passengers,
            startRange: searchParams.startRange,
            endRange: searchParams.endRange,
          }),
        });

        const data = (await res.json()) as {
          success?: boolean;
          message?: string;
          data?: unknown;
        };

        if (cancelled) return;

        if (!res.ok || data.success === false) {
          const message =
            typeof data.message === "string" && data.message.length > 0
              ? data.message
              : "No se pudo cargar la cotización";
          setState((prev) => ({
            ...prev,
            loading: false,
            error: message,
            notFound: true,
            tour: null,
            calendar: EMPTY_CALENDAR,
            countries: "",
            additional: EMPTY_QUOTE_WIZARD_ADDITIONAL,
          }));
          return;
        }

        const mapped = mapCotizarResponseToWizard(data.data, normalizedMt);

        if (!mapped) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "No se encontraron datos del programa",
            notFound: true,
            tour: null,
            calendar: EMPTY_CALENDAR,
            countries: "",
            additional: EMPTY_QUOTE_WIZARD_ADDITIONAL,
          }));
          return;
        }

        setState({
          mt: normalizedMt,
          tour: mapped.tour,
          similarClv: mapped.similarClv,
          calendar: mapped.calendar,
          countries: mapped.tour.countries,
          additional: mapped.additional,
          searchParams,
          loading: false,
          error: null,
          notFound: false,
        });
      } catch {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Error de conexión con el servidor",
          notFound: true,
          tour: null,
          calendar: EMPTY_CALENDAR,
          countries: "",
          additional: EMPTY_QUOTE_WIZARD_ADDITIONAL,
        }));
      }
    };

    void loadTour();

    return () => {
      cancelled = true;
    };
  }, [
    bootstrapped,
    enabled,
    itemSearch.endRange,
    itemSearch.passengers,
    itemSearch.startRange,
    mt,
  ]);

  return {
    ...state,
    itemSearch: state.searchParams,
  };
}
