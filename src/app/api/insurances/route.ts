import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getInsurancesCotizacion } from "@/src/services/cotizacion";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mt = searchParams.get("mt");
  const days = searchParams.get("days") ?? "";

  if (!mt) {
    return NextResponse.json(
      { success: false, message: "Parámetro mt requerido" },
      { status: 400 }
    );
  }

  try {
    const res = await getInsurancesCotizacion(token, mt, days);

    if (res.status === 200 && res.data) {
      return NextResponse.json({ success: true, data: res.data }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, message: res.message ?? "No se encontraron seguros" },
      { status: res.status >= 400 ? res.status : 404 }
    );
  } catch (err) {
    console.error("[api/insurances]", err);
    return NextResponse.json(
      { success: false, message: "Error al consultar seguros" },
      { status: 500 }
    );
  }
}
