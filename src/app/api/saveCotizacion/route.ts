import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveCotizacion } from "@/src/services/cotizacion";
import type { CotizacionQuotePayload } from "@/src/interfaces/cotizacion-quote-payload";
import { getApiMessage } from "@/src/utils/apiMessage";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as CotizacionQuotePayload;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    if (!payload?.bloqueo_uid && !payload?.buid) {
      return NextResponse.json(
        { success: false, message: "Payload de cotización inválido" },
        { status: 422 }
      );
    }

    const data = await saveCotizacion(token, payload);
    const apiMessage = (fallback: string) =>
      getApiMessage(data as Record<string, unknown>, fallback);

    switch (data.status) {
      case 200:
        if (!data.data) {
          return NextResponse.json(
            {
              success: false,
              message: apiMessage("Respuesta de cotización inválida"),
            },
            { status: 502 }
          );
        }
        return NextResponse.json({ success: true, data: data.data }, { status: 200 });
      case 401:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("No autorizado. Token inválido o expirado."),
          },
          { status: 401 }
        );
      case 406:
        return NextResponse.json(
          { success: false, message: apiMessage("Solicitud no aceptable.") },
          { status: 406 }
        );
      case 403:
        return NextResponse.json(
          { success: false, message: apiMessage("Acceso prohibido.") },
          { status: 403 }
        );
      case 404:
        return NextResponse.json(
          { success: false, message: apiMessage("Recurso no encontrado.") },
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
            message: apiMessage(
              `Error inesperado: ${data.statusText ?? "Desconocido"}`
            ),
            status: data.status,
          },
          { status: data.status >= 400 ? data.status : 500 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Error al guardar la cotización" },
      { status: 500 }
    );
  }
}
