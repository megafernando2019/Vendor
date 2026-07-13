import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { showLists, type ShowListsPayload } from "@/services/list";
import { getApiMessage } from "@/utils/apiMessage";

function getUserIdFromUserCookie(raw: string | undefined): number | null {
  if (!raw) return null;

  try {
    const user = JSON.parse(raw) as Record<string, unknown>;
    const userId = Number(user.id);

    if (!Number.isFinite(userId) || userId < 0) {
      return null;
    }

    return userId;
  } catch {
    return null;
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
    let body: Partial<ShowListsPayload> = {};
    try {
      body = (await req.json()) as Partial<ShowListsPayload>;
    } catch {
      body = {};
    }

    const userIdFromCookie = getUserIdFromUserCookie(userRaw);
    const userId =
      userIdFromCookie ??
      (body.user_id != null ? Number(body.user_id) : NaN);
    const nameList =
      typeof body.name_list === "string" ? body.name_list.trim() : "";
    const rawTypeView =
      body.type_view === undefined || body.type_view === null
        ? 1
        : Number(body.type_view);

    if (!Number.isFinite(userId) || userId < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No se pudo obtener user_id de la sesión",
        },
        { status: 422 },
      );
    }

    if (rawTypeView !== 0 && rawTypeView !== 1) {
      return NextResponse.json(
        { success: false, message: "type_view debe ser 0 o 1" },
        { status: 422 },
      );
    }

    const payload: ShowListsPayload = {
      user_id: userId,
      name_list: nameList,
      type_view: rawTypeView,
    };

    const res = await showLists(token, payload);
    const apiMessage = (fallback: string) =>
      getApiMessage(res as Record<string, unknown>, fallback);

    switch (res.status) {
      case 200:
      case 201:
        return NextResponse.json(
          {
            success: true,
            message: res.message,
            data: Array.isArray(res.data) ? res.data : [],
          },
          { status: 200 },
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
      { success: false, message: "Error al consultar las listas" },
      { status: 500 },
    );
  }
}
