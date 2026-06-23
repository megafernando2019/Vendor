const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export async function getQuotes(
  token: string,
  quote: string
) {
  const params = new URLSearchParams({ quote: String(quote) });
  const urlQuotes = `${apiUrl}quote/get_quote?${params.toString()}`;
  const res = await fetch(urlQuotes, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token} `,
    },
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return {
    status: res.status,
    statusText: res.statusText,
    ...(data ?? {}),
  };
}

export type UserQuotesPagination = {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
};

export type GetUserQuotesOptions = {
  page?: number;
  page_size?: number;
  search?: string;
};

export async function getUserQuotes(
  token: string,
  idUser: number,
  role: string,
  options: GetUserQuotesOptions = {}
) {
  const params = new URLSearchParams();
  if (idUser) {
    params.set("id_user", String(idUser));
  }
  if (role) {
    params.set("role", String(role));
  }
  if (options.page) {
    params.set("page", String(options.page));
  }
  if (options.page_size) {
    params.set("page_size", String(options.page_size));
  }
  const search = options.search?.trim();
  if (search) {
    params.set("quote_uid", search);
    params.set("keyword", search);
    params.set("search", search);
  }
  const urlQuotes = `${apiUrl}quote/get_user_quotes?${params.toString()}`;
  const res = await fetch(urlQuotes, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token} `,
    },
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return {
    status: res.status,
    statusText: res.statusText,
    ...(data ?? {}),
  };
}