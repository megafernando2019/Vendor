import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRulesCotizacion } from "@/src/services/cotizacion";

type RouteParams = { params: Promise<{ mt: string; uid: string; date: string }> };

export async function GET(_req: Request, context: RouteParams) {
  const { mt, uid, date } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
  }

  try {
    const res = await getRulesCotizacion(token, mt, uid);

    switch (res.status) {
      case 200:
        return NextResponse.json({ success: true, data: res }, { status: 200 });
      case 401:
        return NextResponse.json(
          { success: false, message: "No autorizado. Token inválido o expirado." },
          { status: 401 }
        );
      case 403:
        return NextResponse.json({ success: false, message: "Acceso prohibido." }, { status: 403 });
      case 404:
        return NextResponse.json({ success: false, message: "Recurso no encontrado." }, { status: 404 });
      case 422:
        return NextResponse.json(
          { success: false, message: "Datos inválidos en la solicitud." },
          { status: 422 }
        );
      case 500:
        return NextResponse.json(
          { success: false, message: "Error interno del servidor externo." },
          { status: 502 }
        );
      default:
        return NextResponse.json(
          {
            success: false,
            message: `Error inesperado: ${res.statusText ?? "Desconocido"}`,
            status: res.status,
          },
          { status: res.status ?? 500 }
        );
    }
  } catch {
    return NextResponse.json({ success: false, message: "Error al consultar" }, { status: 500 });
  }
}
