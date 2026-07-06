import { cookies } from "next/headers";
import { getInsurancesCotizacion } from "@/src/services/cotizacion";
import {
  parseInsuranceProvidersMap,
  type InsuranceProvidersMap,
} from "@/interfaces/seguros-cotizacion";

export type InsurancesLoadResult = {
  success: boolean;
  data: InsuranceProvidersMap;
  message?: string;
  status: number;
};

export async function loadInsurances(
  mt: string,
  days: number | string,
): Promise<InsurancesLoadResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      success: false,
      data: {},
      message: "No hay conexión",
      status: 401,
    };
  }

  if (!mt) {
    return {
      success: false,
      data: {},
      message: "Parámetro mt requerido",
      status: 400,
    };
  }

  try {
    const res = await getInsurancesCotizacion(token, mt, String(days));

    if (res.status === 200) {
      cookieStore.set("mt", mt, {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 8,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return {
        success: true,
        data: parseInsuranceProvidersMap(
          (res as { data?: unknown }).data ?? res,
        ),
        status: 200,
      };
    }

    const messageByStatus: Record<number, string> = {
      401: "No autorizado. Token inválido o expirado.",
      403: "Acceso prohibido.",
      404: "Recurso no encontrado.",
      422: "Datos inválidos en la solicitud.",
      500: "Error interno del servidor externo.",
    };

    return {
      success: false,
      data: {},
      message:
        messageByStatus[res.status] ??
        `Error inesperado: ${res.statusText ?? "Desconocido"}`,
      status: res.status ?? 500,
    };
  } catch {
    return {
      success: false,
      data: {},
      message: "Error al consultar",
      status: 500,
    };
  }
}
