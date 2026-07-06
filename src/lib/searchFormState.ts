import { isValid, parseISO } from "date-fns";
import type { ItemSearch, PaginationMeta } from "@/redux/slices/searchSlice";

const VALID_DESTINO_IDS = new Set([
  "3",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
]);

const VALID_PASAJEROS_IDS = new Set(["1", "2", "3", "4", "5", "6", "7", "8"]);

export type SearchFormFieldValues = {
  destinoId: string;
  pasajerosId: string;
  keyword: string;
  dateRange: Date[] | null;
};

export function hasPersistedSearchSession(params: {
  pagination: PaginationMeta | null;
  uuid: string | null;
  resultadosCount: number;
}): boolean {
  return (
    params.pagination !== null ||
    params.uuid !== null ||
    params.resultadosCount > 0
  );
}

function parseItemSearchDateRange(
  startRange: string,
  endRange: string,
): Date[] | null {
  if (!startRange?.trim() || !endRange?.trim()) {
    return null;
  }

  const start = parseISO(startRange);
  const end = parseISO(endRange);

  if (!isValid(start) || !isValid(end)) {
    return null;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return [start, end];
}

export function mapItemSearchToFormFields(
  item: ItemSearch,
  defaults: {
    destinoId: string;
    pasajerosId: string;
    dateRange: Date[];
  },
): SearchFormFieldValues {
  const destinoId = VALID_DESTINO_IDS.has(String(item.destination))
    ? String(item.destination)
    : defaults.destinoId;

  const pasajerosId = VALID_PASAJEROS_IDS.has(String(item.passengers))
    ? String(item.passengers)
    : defaults.pasajerosId;

  return {
    destinoId,
    pasajerosId,
    keyword: item.search?.trim() ?? "",
    dateRange:
      parseItemSearchDateRange(item.startRange, item.endRange) ??
      defaults.dateRange,
  };
}
