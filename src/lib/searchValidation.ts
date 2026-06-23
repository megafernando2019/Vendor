import { addYears, format } from "date-fns";
import {
  SEARCH_PAGE_LIMIT,
  DEFAULT_PASSENGERS,
  DEFAULT_DESTINATION,
} from "@/interfaces/search";
import type { ItemSearch } from "@/redux/slices/searchSlice";

const DATE_FORMAT = "yyyy-MM-dd";

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
  if (!raw) return "";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export function isSearchReady(item: ItemSearch): boolean {
  const hasDestination = Number(item.destination) > 0;
  const hasSearch = (item.search ?? "").trim().length > 0;
  return hasDestination || hasSearch;
}

export function searchValidationMessage(item: ItemSearch): string | null {
  if (isSearchReady(item)) return null;
  return "Selecciona un destino o escribe un término de búsqueda.";
}

export function normalizePassengers(count: number): number {
  return Number(count) > 0 ? Number(count) : DEFAULT_PASSENGERS;
}

export function formatPassengersLabel(count: number): string {
  const n = normalizePassengers(count);
  return n === 1 ? "1 Pasajero" : `${n} Pasajeros`;
}

export function getDefaultSearchDateRange(): {
  startRange: string;
  endRange: string;
} {
  const today = new Date();
  return {
    startRange: format(today, DATE_FORMAT),
    endRange: format(addYears(today, 1), DATE_FORMAT),
  };
}

export function applySearchDefaults(item: ItemSearch): ItemSearch {
  const defaults = getDefaultSearchDateRange();
  const startRange = item.startRange?.trim() || defaults.startRange;
  const endRange = item.endRange?.trim() || defaults.endRange;
  const destination =
    Number(item.destination) > 0 ? Number(item.destination) : DEFAULT_DESTINATION;

  return {
    ...item,
    destination,
    passengers: normalizePassengers(item.passengers),
    startRange,
    endRange,
    search: (item.search ?? "").trim(),
    page: Number(item.page) > 0 ? Number(item.page) : 1,
    limit: Number(item.limit) > 0 ? Number(item.limit) : SEARCH_PAGE_LIMIT,
  };
}

export function normalizeItemSearch(item: ItemSearch): ItemSearch {
  const passengers = normalizePassengers(item.passengers);
  const startRange = item.startRange?.trim() ?? "";
  const endRange = item.endRange?.trim() ?? "";

  let normalizedStart = startRange;
  let normalizedEnd = endRange;

  if (!normalizedStart && !normalizedEnd) {
    const defaults = getDefaultSearchDateRange();
    normalizedStart = defaults.startRange;
    normalizedEnd = defaults.endRange;
  }

  return {
    ...item,
    destination:
      Number(item.destination) > 0 ? Number(item.destination) : DEFAULT_DESTINATION,
    passengers,
    startRange: normalizedStart,
    endRange: normalizedEnd,
    search: (item.search ?? "").trim(),
    page: Number(item.page) > 0 ? Number(item.page) : 1,
    limit: Number(item.limit) > 0 ? Number(item.limit) : SEARCH_PAGE_LIMIT,
  };
}

export function prepareItemSearch(
  item: ItemSearch
): { ok: true; params: ItemSearch } | { ok: false; error: string } {
  const error = searchValidationMessage(item);
  if (error) return { ok: false, error };
  return { ok: true, params: normalizeItemSearch(item) };
}
