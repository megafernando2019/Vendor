import { NextResponse } from "next/server";
import { loginUser } from "@/src/services/auth/session";
import { getApiMessage } from "@/src/utils/apiMessage";

const authCookieOptions = {
  httpOnly: true,
  path: "/",
  maxAge: 60 * 60 * 8,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

function setAuthCookies(
  response: NextResponse,
  data: {
    access_token: string;
    refresh_token?: string;
    user?: Record<string, unknown>;
  }
) {
  response.cookies.set("user", JSON.stringify(data.user ?? {}), authCookieOptions);
  response.cookies.set("token", data.access_token, authCookieOptions);
  response.cookies.set("refresh_token", data.refresh_token ?? "", authCookieOptions);
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email y contraseña son requeridos" },
        { status: 422 }
      );
    }

    const data = await loginUser(email, password);
    const apiMessage = (fallback: string) =>
      getApiMessage(data as Record<string, unknown>, fallback);

    switch (data.status) {
      case 200: {
        const accessToken =
          data.access_token ??
          (typeof (data as Record<string, unknown>).token === "string"
            ? ((data as Record<string, unknown>).token as string)
            : undefined);

        if (!accessToken) {
          return NextResponse.json(
            {
              success: false,
              message: apiMessage("Respuesta de login inválida"),
            },
            { status: 502 }
          );
        }

        const response = NextResponse.json(
          {
            token: accessToken,
            success: true,
            message: "Ok",
          },
          { status: 200 }
        );

        setAuthCookies(response, {
          access_token: accessToken,
          refresh_token: data.refresh_token,
          user: data.user,
        });

        return response;
      }
      case 401:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("No autorizado. Credenciales inválidas."),
          },
          { status: 401 }
        );
      case 403:
        return NextResponse.json(
          { success: false, message: apiMessage("Acceso prohibido.") },
          { status: 403 }
        );
      case 404:
        return NextResponse.json(
          { success: false, message: apiMessage("Recurso no encontrado.") },
          { status: 404 }
        );
      case 406:
        return NextResponse.json(
          { success: false, message: apiMessage("Solicitud no aceptable.") },
          { status: 406 }
        );
      case 422:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Datos inválidos en la solicitud."),
          },
          { status: 422 }
        );
      case 500:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage("Error interno del servidor externo."),
          },
          { status: 502 }
        );
      default:
        return NextResponse.json(
          {
            success: false,
            message: apiMessage(
              `Error inesperado: ${data.statusText ?? "Desconocido"}`
            ),
            status: data.status,
          },
          { status: data.status >= 400 ? data.status : 500 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
