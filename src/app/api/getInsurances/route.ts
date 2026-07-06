import { NextResponse } from "next/server";
import { getInsurancesCotizacion } from "@/src/services/cotizacion";
import { parseInsuranceProvidersMap } from "@/src/interfaces/seguros-cotizacion";
import { cookies } from "next/headers";

type GetInsurancesBody = {
  mt?: string | number | null;
  days?: string | number | null;
};

function buildInsurancesResponse(
  res: Awaited<ReturnType<typeof getInsurancesCotizacion>>,
  mt: string | null,
) {
  switch (res.status) {
    case 200: {
      const response = NextResponse.json(
        {
          success: true,
          data: parseInsuranceProvidersMap(
            (res as { data?: unknown }).data ?? res,
          ),
        },
        { status: 200 },
      );
      response.cookies.set("mt", String(mt ?? ""), {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 8,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return response;
    }

    case 401:
      return NextResponse.json(
        {
          success: false,
          message: "No autorizado. Token inválido o expirado.",
        },
        { status: 401 },
      );

    case 403:
      return NextResponse.json(
        { success: false, message: "Acceso prohibido." },
        { status: 403 },
      );

    case 404:
      return NextResponse.json(
        { success: false, message: "Recurso no encontrado." },
        { status: 404 },
      );

    case 422:
      return NextResponse.json(
        { success: false, message: "Datos inválidos en la solicitud." },
        { status: 422 },
      );

    case 500:
      return NextResponse.json(
        { success: false, message: "Error interno del servidor externo." },
        { status: 502 },
      );

    default:
      return NextResponse.json(
        {
          success: false,
          message: `Error inesperado: ${res.statusText ?? "Desconocido"}`,
          status: res.status,
        },
        { status: res.status ?? 500 },
      );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No hay conexión" },
        { status: 401 },
      );
    }

    const body = (await req.json()) as GetInsurancesBody;
    const mt = body.mt != null ? String(body.mt) : null;
    const days = body.days != null ? String(body.days) : null;

    if (!mt) {
      return NextResponse.json(
        { success: false, message: "Parámetro mt requerido" },
        { status: 400 },
      );
    }

    const res = await getInsurancesCotizacion(token, mt, days);
    return buildInsurancesResponse(res, mt);
  } catch {
    return NextResponse.json(
      { success: false, message: "Error al consultar" },
      { status: 500 },
    );
  }
}
