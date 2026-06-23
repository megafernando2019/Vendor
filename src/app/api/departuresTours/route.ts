import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { departuresToursCotizacion } from "@/src/services/cotizacion";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No autorizado" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const blockadeUid = searchParams.get("blockade_uid");

  if (!blockadeUid) {
    return NextResponse.json(
      { success: false, message: "Parámetro blockade_uid requerido" },
      { status: 400 }
    );
  }

  try {
    const res = await departuresToursCotizacion(token, blockadeUid);

    if (res.status === 200 && Array.isArray(res.data)) {
      return NextResponse.json(
        { success: true, data: res.data, message: res.message },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: res.message ?? "No se encontraron opcionales" },
      { status: res.status ?? 404 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Error al consultar opcionales" },
      { status: 500 }
    );
  }
}
