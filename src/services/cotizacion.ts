const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import type { CotizacionQuotePayload } from "@/src/interfaces/cotizacion-quote-payload";
import type { CotizacionSaveResponse } from "@/src/interfaces/cotizacion-detalle";

export async function getRulesCotizacion(
  token: string,
  mt: string,
  uid: string
) {
  const params = new URLSearchParams({ mt: String(mt) });
  if (uid) {
    params.set("blockade_uid", uid);
  }
  const urlRules = `${apiUrl}departures/blockade?${params.toString()}`;
  const res = await fetch(urlRules, {
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
export async function getCostsRooms(
  token: string,
  destination_id: number,
  passengers: any,
  room_type: string,
  blockade_uid: string) {

  const urlRules = `${apiUrl}departures/costs/rooms`;
  const res = await fetch(urlRules, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token} `,
    },
    body: JSON.stringify({
      "destination_id": String(destination_id),
      "passengers": passengers,
      "room_type": room_type,
      "blockade_uid": blockade_uid
    })
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return data;
}


export async function getInsurancesCotizacion(
  token: string,
  mt: string  | null,
  days: string | null
) {
  const params = new URLSearchParams({ mt: String(mt) });
  if (days) {
    params.set("days", days);
  }
  const urlInsurances = `${apiUrl}insurance/insurance?${params.toString()}`;
  const res = await fetch(urlInsurances, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token} `,
    },
  });
  let data = null;
  try {
    data = await res.json();
   console.log(data)
  } catch {
    data = null;
  }

  return {
    status: res.status,
    statusText: res.statusText,
    ...(data ?? {}),
  };
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

export async function departuresToursCotizacion(
  token: string,
  blockade_uid: string  | null,
) {
  const params = new URLSearchParams({ blockade_uid: String(blockade_uid) });
  const urlDeparturestour = `${apiUrl}departures/blockade/tours?${params.toString()}`;
  const res = await fetch(urlDeparturestour, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token} `,
    },
  });
  let data = null;
  try {
    data = await res.json();
   console.log(data)
  } catch {
    data = null;
  }

  return {
    status: res.status,
    statusText: res.statusText,
    ...(data ?? {}),
  };
}      
export type SaveCotizacionResult = {
  status: number;
  statusText: string;
  message?: string;
  data?: CotizacionSaveResponse;
};

export async function saveCotizacion(
  token: string,
  payload: CotizacionQuotePayload
): Promise<SaveCotizacionResult> {
  try {
    const url = `${apiUrl}quote/create_quote`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    let json: { data?: CotizacionSaveResponse; message?: string } & Partial<CotizacionSaveResponse> | null =
      null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    const message = typeof json?.message === "string" ? json.message : undefined;

    if (res.ok) {
      const quoteData =
        json?.data ?? (json?.uid ? (json as CotizacionSaveResponse) : undefined);

      return {
        status: res.status,
        statusText: res.statusText,
        message,
        data: quoteData,
      };
    }

    return {
      status: res.status,
      statusText: res.statusText,
      message,
    };
  } catch {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "Error de conexión con el servidor",
    };
  }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          