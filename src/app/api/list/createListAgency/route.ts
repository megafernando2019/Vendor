import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createListAgency,
  type CreateListAgencyPayload,
} from "@/services/list";
import { getApiMessage } from "@/utils/apiMessage";

function getSessionIdsFromUserCookie(raw: string | undefined): {
  agencyId: number | null;
  userId: number | null;
} {
  if (!raw) {
    return { agencyId: null, userId: null };
  }

  try {
    const user = JSON.parse(raw) as Record<string, unknown>;
    const agency =
      user.agency && typeof user.agency === "object"
        ? (user.agency as Record<string, unknown>)
        : null;

    const agencyId = Number(agency?.id);
    const userId = Number(user.id);

    return {
      agencyId:
        Number.isFinite(agencyId) && agencyId >= 0 ? agencyId : null,
      userId: Number.isFinite(userId) && userId >= 0 ? userId : null,
    };
  } catch {
    return { agencyId: null, userId: null };
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userRaw = cookieStore.get("user")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No hay conexión" },
      { status: 401 },
    );
  }

  try {
    const body = (await req.json()) as Partial<CreateListAgencyPayload>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const sessionIds = getSessionIdsFromUserCookie(userRaw);
    const agencyId =
      sessionIds.agencyId ??
      (body.agency_id != null ? Number(body.agency_id) : NaN);
    const userId =
      sessionIds.userId ??
      (body.user_id != null ? Number(body.user_id) : NaN);

    if (!Number.isFinite(agencyId) || agencyId < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No se pudo obtener agency_id de la sesión",
        },
        { status: 422 },
      );
    }

    if (!Number.isFinite(userId) || userId < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No se pudo obtener user_id de la sesión",
        },
        { status: 422 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: "El nombre de la lista es requerido" },
        { status: 422 },
      );
    }

    const payload: CreateListAgencyPayload = {
      agency_id: agencyId,
      user_id: userId,
      name,
    };

    const res = await createListAgency(token, payload);
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
      { success: false, message: "Error al crear la lista" },
      { status: 500 },
    );
  }
}
