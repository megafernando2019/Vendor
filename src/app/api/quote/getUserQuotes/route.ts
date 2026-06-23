import { NextResponse } from "next/server";
import { getUserQuotes } from "@/src/services/administracion";
import { cookies } from "next/headers";
import {
  filterUserQuotes,
  paginateUserQuotes,
  type AdminUserQuote,
} from "@/src/utils/userQuotesFilter";

const SEARCH_FETCH_PAGE_SIZE = 500;
function getUserRole(user: Record<string, unknown>): string {
  const roles = user.roles;
  if (Array.isArray(roles) && roles[0] != null) {
    return String(roles[0]);
  }
  if (user.role != null) {
    return String(user.role);
  }
  if (user.rol != null) {
    return String(user.rol);
  }
  return "";
}

type QuotesPayload = {
  quotes?: unknown[];
  pagination?: {
    page?: number;
    page_size?: number;
    total_items?: number;
    total_pages?: number;
  };
};

function parseQuotesResponse(data: unknown): QuotesPayload {
  if (!data || typeof data !== "object") {
    return { quotes: [], pagination: undefined };
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.quotes)) {
    return {
      quotes: record.quotes,
      pagination: record.pagination as QuotesPayload["pagination"],
    };
  }

  const nested = record.data;
  if (nested && typeof nested === "object") {
    const nestedRecord = nested as Record<string, unknown>;
    if (Array.isArray(nestedRecord.quotes)) {
      return {
        quotes: nestedRecord.quotes,
        pagination: nestedRecord.pagination as QuotesPayload["pagination"],
      };
    }
  }

  if (Array.isArray(data)) {
    return { quotes: data, pagination: undefined };
  }

  return { quotes: [], pagination: undefined };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userRaw = cookieStore.get("user")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No hay conexión" },
      { status: 401 }
    );
  }

  if (!userRaw) {
    return NextResponse.json(
      { success: false, message: "Sin sesión de usuario" },
      { status: 401 }
    );
  }

  try {
    const user = JSON.parse(userRaw) as Record<string, unknown>;

    const idUser = Number(user.id);
    const role = getUserRole(user);
    if (!idUser || !role) {
      return NextResponse.json(
        { success: false, message: "Usuario sin id o rol en la sesión" },
        { status: 400 }
      );
    }

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("page_size")) || 10);
    const search = searchParams.get("search")?.trim() ?? "";

    const res = await getUserQuotes(token, idUser, role, {
      page: search ? 1 : page,
      page_size: search ? SEARCH_FETCH_PAGE_SIZE : pageSize,
      search,
    });

    switch (res.status) {
      case 200: {
        const { quotes: rawQuotes, pagination } = parseQuotesResponse(res.data);
        const quotes = (rawQuotes ?? []) as AdminUserQuote[];

        if (search) {
          const filtered = filterUserQuotes(quotes, search);
          const paged = paginateUserQuotes(filtered, page, pageSize);

          return NextResponse.json(
            {
              success: true,
              message: res.message,
              data: {
                quotes: paged.items,
                pagination: paged.pagination,
              },
            },
            { status: 200 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: res.message,
            data: {
              quotes,
              pagination: {
                page: pagination?.page ?? page,
                page_size: pagination?.page_size ?? pageSize,
                total_items: pagination?.total_items ?? quotes.length,
                total_pages: pagination?.total_pages ?? 0,
              },
            },
          },
          { status: 200 }
        );
      }
      case 401:
        return NextResponse.json(
          {
            success: false,
            message: "No autorizado. Token inválido o expirado.",
          },
          { status: 401 }
        );

      case 403:
        return NextResponse.json(
          { success: false, message: "Acceso prohibido." },
          { status: 403 }
        );

      case 404:
        return NextResponse.json(
          { success: false, message: res.message },
          { status: 404 }
        );

      case 422:
        return NextResponse.json(
          { success: false, message: "Datos inválidos en la solicitud." },
          { status: 422 }
        );

      case 500:
        return NextResponse.json(
          { success: false, message: "Error interno del servidor externo." },
          { status: 502 }
        );

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Error inesperado",
            status: res.status,
          },
          { status: res.status ?? 500 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Error al consultar" },
      { status: 500 }
    );
  }
}
