import type { CotizacionDetalleStorage } from "@/src/interfaces/cotizacion-detalle";
import { COTIZACION_DETALLE_KEY } from "@/src/interfaces/cotizacion-detalle";

export function saveCotizacionDetalle(data: CotizacionDetalleStorage): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COTIZACION_DETALLE_KEY, JSON.stringify(data));
}

export function getCotizacionDetalle(): CotizacionDetalleStorage | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(COTIZACION_DETALLE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CotizacionDetalleStorage;
  } catch {
    return null;
  }
}

export function clearCotizacionDetalle(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(COTIZACION_DETALLE_KEY);
}
