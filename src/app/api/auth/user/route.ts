import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("user")?.value;

  if (!raw) {
    return NextResponse.json(
      { success: false, message: "Sin sesión de usuario" },
      { status: 401 }
    );
  }

  try {
    const user = JSON.parse(raw) as Record<string, unknown>;
    const agency =
      user.agency && typeof user.agency === "object"
        ? (user.agency as Record<string, unknown>)
        : null;
    const agencyMc =
      agency?.mc != null ? String(agency.mc) : "";
    const userMc = user.mc != null ? String(user.mc) : "";

    return NextResponse.json({
      success: true,
      user: {
        mc: agencyMc || userMc,
        email: user.email != null ? String(user.email) : "",
        fn: user.fn != null ? String(user.fn) : "",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Cookie de usuario inválida" },
      { status: 400 }
    );
  }
}
