import { COTIZACION_DETALLE_KEY } from "@/src/interfaces/cotizacion-detalle";
import {
  COTIZACION_ASISTENCIAS_KEY,
  COTIZACION_HABITACIONES_KEY,
  COTIZACION_OPCIONALES_KEY,
} from "@/src/redux/slices/cotizacionSlice";

export const PERSIST_APP_KEY = "persist:app";
export const TOTALES_KEY = "totales";

export const PRE_LOGIN_STORAGE_KEYS = [
  COTIZACION_ASISTENCIAS_KEY,
  COTIZACION_DETALLE_KEY,
  COTIZACION_HABITACIONES_KEY,
  COTIZACION_OPCIONALES_KEY,
  PERSIST_APP_KEY,
  TOTALES_KEY,
] as const;

function deleteCookie(name: string): void {
  const encoded = encodeURIComponent(name);
  document.cookie = `${encoded}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function clearPreLoginStorage(): void {
  if (typeof window === "undefined") return;

  for (const key of PRE_LOGIN_STORAGE_KEYS) {
    localStorage.removeItem(key);
    deleteCookie(key);
  }
}
