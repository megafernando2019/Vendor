import { getApiBaseUrl } from "@/lib/searchValidation";

export async function getRecommendations(token: string) {
  const apiUrl = getApiBaseUrl();
  if (!apiUrl) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "NEXT_PUBLIC_API_URL no está configurada",
      data: [],
    };
  }

  const url = `${apiUrl}departures/recommendations`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
    ...(data ?? {})
  };
}
export async function getSearch(
  token: string,
  destination: number,
  passengers: number,
  startRange: string,
  endRange: string,
  page: number,
  limit: number,
  search: string
) {
  const apiUrl = getApiBaseUrl();
  if (!apiUrl) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "NEXT_PUBLIC_API_URL no está configurada",
      data: [],
    };
  }

  const params = new URLSearchParams({
    pax: String(passengers),
    destination_id: String(destination),
  });
  if (search) {
    params.set("keyword", search);
  }
  if (page > 0) {
    params.set("page", String(page));
  }
  if (limit > 0) {
    params.set("limit", String(limit));
  }
  if (startRange) {
    params.set("range_start", startRange);
  }
  if (endRange) {
    params.set("range_end", endRange);
  }
  const url = `${apiUrl}departures/programs?${params.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
    ...(data ?? {})
  };
}

export async function getCotizar(
  token: string,
  passengers: number,
  clv: number,
  startRange: string,
  endRange: string
) {
  const apiUrl = getApiBaseUrl();
  if (!apiUrl) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "NEXT_PUBLIC_API_URL no está configurada",
    };
  }

  const params = new URLSearchParams({
    mt: String(clv),
  });
  if (passengers) {
    params.set("pax", String(passengers));
  }
  if (startRange) {
    params.set("range_start", startRange);
  }
  if (endRange) {
    params.set("range_end", endRange);
  }
  const urlCotizar = `${apiUrl}departures/program?${params.toString()}`;
  console.log(urlCotizar)
  const res = await fetch(urlCotizar, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
