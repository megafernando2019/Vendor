import { cookies } from "next/headers";
import { getCotizar } from "@/src/services/disponibilidad";

export type CotizarLoadParams = {
  clv: string;
  passengers: number;
  startRange: string;
  endRange: string;
};

export type CotizarLoadResult = {
  success: boolean;
  data?: unknown;
  message?: string;
  status: number;
};

function cotizarErrorMessage(
  res: Awaited<ReturnType<typeof getCotizar>>,
): string {
  switch (res.status) {
    case 401:
      return `Error inesperado: ${res.message ?? "No autorizado. Token inválido o expirado."}`;
    case 403:
      return `Error inesperado: ${res.message ?? "Acceso prohibido."}`;
    case 404:
      return res.message ?? "No se encontró el programa";
    case 422:
      return `Error inesperado: ${res.message ?? "Datos inválidos en la solicitud."}`;
    case 500:
      return `Error inesperado: ${res.message ?? "Error interno del servidor externo."}`;
    default:
      return `Error inesperado: ${res.statusText ?? "Desconocido"}`;
  }
}

export async function loadCotizar(
  params: CotizarLoadParams,
): Promise<CotizarLoadResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      success: false,
      message: "No hay conexión",
      status: 401,
    };
  }

  const clv = Number(params.clv);
  if (!Number.isFinite(clv)) {
    return {
      success: false,
      message: "Programa inválido",
      status: 400,
    };
  }

  try {
    const res = await getCotizar(
      token,
      params.passengers,
      clv,
      params.startRange,
      params.endRange,
    );

    if (res.status === 200) {
      cookieStore.set("mt", String(params.clv), {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 8,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return {
        success: true,
        data: res,
        status: 200,
      };
    }

    return {
      success: false,
      message: cotizarErrorMessage(res),
      status: res.status ?? 500,
    };
  } catch {
    return {
      success: false,
      message: "Error al consultar",
      status: 500,
    };
  }
}
