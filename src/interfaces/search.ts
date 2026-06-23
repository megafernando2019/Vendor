export const SEARCH_PAGE_LIMIT = 12;
export const DEFAULT_PASSENGERS = 2;
export const DEFAULT_DESTINATION = 3;

export type ItemSearch = {
  destination: number;
  passengers: number;
  startRange: string;
  endRange: string;
  search: string;
  page: number;
  limit: number;
};
