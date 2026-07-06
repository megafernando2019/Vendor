import { format } from "date-fns";
import type { ItemSearch } from "@/redux/slices/searchSlice";

export const MOBILE_SEARCH_MQ = "(max-width: 574px)";

export const DEFAULT_DESTINO_ID = "3";
export const DEFAULT_PASAJEROS_ID = "2";
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

export const getDefaultDateRange = (): Date[] => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  return [start, end];
};

export const buildBusquedaPayload = (
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
