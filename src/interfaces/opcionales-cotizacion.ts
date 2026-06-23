export interface OpcionalRateLine {
  code: string;
  label: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  subtotal: number;
}

export interface OpcionalSeleccionado {
  id: string;
  tourUid: string;
  name: string;
  /** Líneas por tipo de pasajero (adt, mnr1, inf, etc.) */
  lineas: OpcionalRateLine[];
  total: number;
  currency: string;
}

const RATE_LABELS: Record<string, string> = {
  adt: "Adulto",
  mnr1: "Menor",
  mnr2: "Menor 2",
  mnr: "Menor",
  inf: "Infante",
  chd: "Niño",
};

export function getOpcionalRateLabel(code: string): string {
  const key = code.toLowerCase();
  return RATE_LABELS[key] ?? code.toUpperCase();
}

export function getOpcionalRateCurrency(
  currency: string | { code?: string; name?: string } | undefined
): string {
  if (!currency) return "USD";
  if (typeof currency === "string") return currency;
  return currency.code ?? "USD";
}

export type TourRateFromApi = {
  code: string;
  price: string | number;
  currency?: string | { code?: string; name?: string };
};

export type TourFromApi = {
  uid: string;
  name: string;
  description?: string;
  rates?: TourRateFromApi[];
  tour_rates_same_currency?: TourRateFromApi[];
};

export function normalizeTourFromApi(raw: TourFromApi) {
  const ratesSource = raw.rates?.length
    ? raw.rates
    : raw.tour_rates_same_currency ?? [];

  return {
    uid: raw.uid,
    name: raw.name,
    description: raw.description ?? "",
    rates: ratesSource.map((rate) => ({
      code: rate.code,
      price: rate.price,
      currency: getOpcionalRateCurrency(rate.currency),
    })),
  };
}

export function calcularTotalOpcional(lineas: OpcionalRateLine[]): number {
  return lineas.reduce((sum, line) => sum + line.subtotal, 0);
}

/** Totales de pasajeros según habitaciones agregadas en cotización */
export type CotizacionPassengerTotals = {
  adt: number;
  mnrA: number;
  inf: number;
};

export const EMPTY_PASSENGER_TOTALS: CotizacionPassengerTotals = {
  adt: 0,
  mnrA: 0,
  inf: 0,
};

type HabitacionPax = { adt: number; mnrA: number; inf: number };

export function sumPassengersFromHabitaciones(
  habitaciones: HabitacionPax[]
): CotizacionPassengerTotals {
  return habitaciones.reduce(
    (acc, h) => ({
      adt: acc.adt + (h.adt ?? 0),
      mnrA: acc.mnrA + (h.mnrA ?? 0),
      inf: acc.inf + (h.inf ?? 0),
    }),
    { ...EMPTY_PASSENGER_TOTALS }
  );
}

export function getTotalPassengers(totals: CotizacionPassengerTotals): number {
  return totals.adt + totals.mnrA + totals.inf;
}

function isMinorRateCode(code: string): boolean {
  const c = code.toLowerCase();
  return c === "mnr1" || c === "mnr2" || c === "mnr" || c === "mnra";
}

/** Si el tour no trae tarifa inf/chd, el infante de habitación cuenta en tarifa menor */
export function tourHasInfantRate(tourRateCodes: string[]): boolean {
  return tourRateCodes.some((c) => {
    const code = c.toLowerCase();
    return code === "inf" || code === "chd";
  });
}

/** Máximo seleccionable en opcionales según código de tarifa (adt, mnr1, inf, …) */
export function getMaxQtyForOpcionalRate(
  rateCode: string,
  totals: CotizacionPassengerTotals,
  tourRateCodes: string[] = []
): number {
  const code = rateCode.toLowerCase();
  if (code === "adt") return totals.adt;
  if (code === "inf" || code === "chd") return totals.inf;
  if (isMinorRateCode(code)) {
    const infantAsMinor = tourHasInfantRate(tourRateCodes) ? 0 : totals.inf;
    return totals.mnrA + infantAsMinor;
  }
  return 0;
}

/** Ajusta cantidades al máximo permitido; si solo cabe 1, deja 1 por defecto */
export function syncOpcionalQuantities(
  tours: { uid: string; rates: { code: string }[] }[],
  totals: CotizacionPassengerTotals,
  prev: Record<string, number>,
  keyFn: (tourUid: string, rateCode: string) => string
): Record<string, number> {
  const next: Record<string, number> = {};

  for (const tour of tours) {
    const rateCodes = tour.rates.map((r) => r.code);
    for (const rate of tour.rates) {
      const key = keyFn(tour.uid, rate.code);
      const max = getMaxQtyForOpcionalRate(rate.code, totals, rateCodes);
      if (max <= 0) continue;

      const prevQty = prev[key] ?? 0;
      if (prevQty > 0) {
        next[key] = Math.min(prevQty, max);
      } else if (max === 1) {
        next[key] = 1;
      }
    }
  }

  return next;
}

export function buildQuantityOptions(max: number): number[] {
  if (max <= 0) return [];
  return Array.from({ length: max }, (_, i) => i + 1);
}
