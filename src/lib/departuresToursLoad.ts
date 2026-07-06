import { cookies } from "next/headers";
import { departuresToursCotizacion } from "@/src/services/cotizacion";
import {
  parseDeparturesToursResponse,
  type OpcionalTour,
} from "@/interfaces/opcionales-cotizacion";

export type DeparturesToursLoadResult = {
  success: boolean;
  data: OpcionalTour[];
  message?: string;
  status: number;
};

export async function loadDeparturesTours(
  blockadeUid: string,
): Promise<DeparturesToursLoadResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      success: false,
      data: [],
      message: "No autorizado",
      status: 401,
    };
  }

  if (!blockadeUid) {
    return {
      success: false,
      data: [],
      message: "Parámetro blockade_uid requerido",
      status: 400,
    };
  }

  try {
    const res = await departuresToursCotizacion(token, blockadeUid);
    const payload = (res as { data?: unknown }).data ?? res.data;
    const tours = parseDeparturesToursResponse(payload);

    if (res.status === 200) {
      return {
        success: true,
        data: tours,
        message:
          res.message ?? (tours.length === 0 ? "Sin opcionales" : undefined),
        status: 200,
      };
    }

    return {
      success: false,
      data: [],
      message: res.message ?? "No se encontraron opcionales",
      status: res.status ?? 404,
    };
  } catch {
    return {
      success: false,
      data: [],
      message: "Error al consultar opcionales",
      status: 500,
    };
  }
}
