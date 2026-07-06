import { cookies } from "next/headers";

export async function requireAuth(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("No autorizado");
  }

  return token;
}
