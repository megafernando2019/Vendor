import { addYears, format } from "date-fns";
import { DEFAULT_PASSENGERS } from "@/interfaces/search";
import type { ItemSearch } from "@/redux/slices/searchSlice";

const DATE_FORMAT = "yyyy-MM-dd";

export type QuoteWizardSearchParams = {
  passengers: number;
  startRange: string;
  endRange: string;
};

function getQuoteWizardDefaultDateRange(): Pick<
  QuoteWizardSearchParams,
  "startRange" | "endRange"
> {
  const today = new Date();
  return {
    startRange: format(today, DATE_FORMAT),
    endRange: format(addYears(today, 1), DATE_FORMAT),
  };
}

export function resolveQuoteWizardSearchParams(
  itemSearch: ItemSearch,
): QuoteWizardSearchParams {
  const defaults = getQuoteWizardDefaultDateRange();
  const passengers =
    Number(itemSearch.passengers) > 0
      ? Number(itemSearch.passengers)
      : DEFAULT_PASSENGERS;

  return {
    passengers,
    startRange: itemSearch.startRange?.trim() || defaults.startRange,
    endRange: itemSearch.endRange?.trim() || defaults.endRange,
  };
}
