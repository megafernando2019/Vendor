export type AdminUserQuote = {
  quote_uid: string;
  status_name: string;
  bloqueo_uid: string;
  bloqueo_name: string;
  bloqueo_departure_at: string;
};

export function filterUserQuotes(
  quotes: AdminUserQuote[],
  search: string
): AdminUserQuote[] {
  const query = search.trim().toLowerCase();
  if (!query) return quotes;

  return quotes.filter((quote) => {
    const haystack = [
      quote.quote_uid,
      quote.bloqueo_uid,
      quote.bloqueo_name,
      quote.status_name,
      quote.bloqueo_departure_at,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function paginateUserQuotes<T>(
  items: T[],
  page: number,
  pageSize: number
): {
  items: T[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
} {
  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
  const safePage =
    totalPages === 0 ? 1 : Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      page_size: pageSize,
      total_items: totalItems,
      total_pages: totalPages,
    },
  };
}
