import { NextResponse } from "next/server";
import { getRecommendations } from "@/services/disponibilidad";
import { cookies } from "next/headers";
import { normalizeRecommendationsData } from "@/utils/recommendations";
import { getApiMessage } from "@/utils/apiMessage";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No hay conexión" },
      { status: 401 }
    );
  }

  try {
    const res = await getRecommendations(token);
    const apiMessage = (fallback: string) =>
      getApiMessage(res as Record<string, unknown>, fallback);

    switch (res.status) {
      case 200: {
        const payload =
          res.data !== undefined ? { data: res.data } : (res as Record<string, unknown>);
        const data = normalizeRecommendationsData(payload);

        return NextResponse.json(
          {
            success: true,
            message: res.message,
            data,
          },
          { status: 200 }
        );
      }

      case 401:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("No autorizado. Token inválido o expirado."),
          },
          { status: 401 }
        );

      case 403:
        return NextResponse.json(
          { success: false, message: apiMessage("Acceso prohibido.") },
          { status: 403 }
        );

      case 404:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Recomendaciones no encontradas."),
          },
          { status: 404 }
        );

      case 422:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Datos inválidos en la solicitud."),
          },
          { status: 422 }
        );

      case 500:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Error interno del servidor externo."),
          },
          { status: 502 }
        );

      default:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Error inesperado"),
            status: res.status,
          },
          { status: res.status ?? 500 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Error al consultar recomendaciones" },
      { status: 500 }
    );
  }
}
