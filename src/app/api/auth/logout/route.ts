import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logoutUser } from "@/src/services/auth/session";

const tokenCookieOptions = {
  httpOnly: true,
  path: "/",
  maxAge: 0,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      await logoutUser(token);
    } catch {
    }
  }

  const response = NextResponse.json(
    { success: true, message: "Sesión cerrada" },
    { status: 200 }
  );
  response.cookies.set("token", "", tokenCookieOptions);
  response.cookies.set("mc", "", tokenCookieOptions);
  return response;
}
