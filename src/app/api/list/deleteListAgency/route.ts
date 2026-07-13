import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  deleteListAgency,
  type DeleteListAgencyPayload,
} from "@/services/list";
import { getApiMessage } from "@/utils/apiMessage";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No hay conexión" },
      { status: 401 },
    );
  }

  try {
    const body = (await req.json()) as Partial<DeleteListAgencyPayload>;
    const agencyId = Number(body.agency_id);
    const userId = Number(body.user_id);
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!Number.isFinite(agencyId) || agencyId < 0) {
      return NextResponse.json(
        { success: false, message: "agency_id inválido" },
        { status: 422 },
      );
    }

    if (!Number.isFinite(userId) || userId < 0) {
      return NextResponse.json(
        { success: false, message: "user_id inválido" },
        { status: 422 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: "El nombre de la lista es requerido" },
        { status: 422 },
      );
    }

    const payload: DeleteListAgencyPayload = {
      agency_id: agencyId,
      user_id: userId,
      name,
    };

    const res = await deleteListAgency(token, payload);
    const apiMessage = (fallback: string) =>
      getApiMessage(res as Record<string, unknown>, fallback);

    switch (res.status) {
      case 200:
      case 201:
        return NextResponse.json(
          {
            success: true,
            message: res.message,
            data: res.data,
          },
          { status: res.status },
        );

      case 401:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("No autorizado. Token inválido o expirado."),
          },
          { status: 401 },
        );

      case 403:
        return NextResponse.json(
          { success: false, message: apiMessage("Acceso prohibido.") },
          { status: 403 },
        );

      case 404:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Recurso no encontrado."),
          },
          { status: 404 },
        );

      case 422:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Datos inválidos en la solicitud."),
          },
          { status: 422 },
        );

      case 500:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Error interno del servidor externo."),
          },
          { status: 502 },
        );

      default:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Error inesperado"),
            status: res.status,
          },
          { status: res.status ?? 500 },
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Error al eliminar la lista" },
      { status: 500 },
    );
  }
}
