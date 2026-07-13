import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  addProgramToList,
  type AddProgramToListPayload,
} from "@/services/list";
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
    const body = (await req.json()) as Partial<AddProgramToListPayload>;
    const userIdFromCookie = getUserIdFromUserCookie(userRaw);
    const userId =
      userIdFromCookie ??
      (body.user_id != null ? Number(body.user_id) : NaN);
    const listName =
      typeof body.list_name === "string" ? body.list_name.trim() : "";
    const program: Partial<AddProgramToListPayload["program"]> =
      body.program ?? {};
    const mt = typeof program.mt === "string" ? program.mt.trim() : "";
    const name = typeof program.name === "string" ? program.name.trim() : "";
    const order =
      typeof program.order === "string"
        ? program.order.trim()
        : program.order != null
          ? String(program.order)
          : "";

    if (!Number.isFinite(userId) || userId < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No se pudo obtener user_id de la sesión",
        },
        { status: 422 },
      );
    }

    if (!listName) {
      return NextResponse.json(
        { success: false, message: "list_name es requerido" },
        { status: 422 },
      );
    }

    if (!mt) {
      return NextResponse.json(
        { success: false, message: "program.mt es requerido" },
        { status: 422 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: "program.name es requerido" },
        { status: 422 },
      );
    }

    const payload: AddProgramToListPayload = {
      user_id: userId,
      list_name: listName,
      program: {
        mt,
        name,
        order,
      },
    };

    const res = await addProgramToList(token, payload);
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
      { success: false, message: "Error al agregar el programa a la lista" },
      { status: 500 },
    );
  }
}
