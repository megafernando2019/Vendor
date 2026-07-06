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

import type { HabitacionCotizacion } from "@/interfaces/cotizacion-components";
import { getHabitacionQuantity } from "@/interfaces/cotizacion-components";

const RATE_LABELS: Record<string, string> = {
  adt: "Adulto",
  mnr1: "Menor",
  mnr2: "Menor 2",
  mnr: "Menor",
  inf: "Infante",
  chd: "Niño",
};

const RATE_SORT_ORDER = ["adt", "mnr1", "mnr2", "mnr", "mnra", "chd", "inf"];

function getOpcionalRateCurrency(
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
  title?: string;
  description?: string;
  image_url?: string;
  image?: string;
  multimedia?: string;
  multimedias?: string[];
  is_package?: boolean;
  is_refundable?: boolean;
  start_at?: string;
  end_at?: string | null;
  rates?: TourRateFromApi[];
  tour_rates_same_currency?: TourRateFromApi[];
};

export type DeparturesToursBlockFromApi = {
  destination_id?: number;
  uid?: string;
  blq?: string;
  tours?: TourFromApi[];
};

export type OpcionalTour = {
  uid: string;
  name: string;
  description: string;
  imageUrl: string;
  rates: {
    code: string;
    price: number;
    currency: string;
  }[];
};

function parseOpcionalPrice(value: string | number | undefined): number {
  if (value == null || value === "") return 0;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Convierte HTML de descripción del API a texto legible en la tarjeta */
export function plainTextFromOpcionalDescription(html: string): string {
  if (!html) return "";

  const withoutTags = html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<\/li>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (typeof document !== "undefined") {
    const el = document.createElement("textarea");
    el.innerHTML = withoutTags;
    return el.value.replace(/\s+/g, " ").trim();
  }

  return withoutTags
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú")
    .replace(/&ntilde;/gi, "ñ")
    .replace(/&iexcl;/gi, "¡")
    .replace(/&ndash;/gi, "–");
}

function isTourFromApi(value: unknown): value is TourFromApi {
  if (!value || typeof value !== "object") return false;
  const item = value as TourFromApi;
  return Boolean(item.uid && (item.name || item.rates?.length));
}

function isDeparturesToursBlock(value: unknown): value is DeparturesToursBlockFromApi {
  if (!value || typeof value !== "object") return false;
  return Array.isArray((value as DeparturesToursBlockFromApi).tours);
}

function extractToursFromDeparturesPayload(source: unknown): TourFromApi[] {
  if (!source) return [];

  if (Array.isArray(source)) {
    const tours: TourFromApi[] = [];

    for (const item of source) {
      if (isDeparturesToursBlock(item)) {
        tours.push(...(item.tours ?? []));
        continue;
      }
      if (isTourFromApi(item)) {
        tours.push(item);
      }
    }

    return tours;
  }

  if (typeof source === "object") {
    const root = source as Record<string, unknown>;
    if (Array.isArray(root.tours)) {
      return root.tours.filter(isTourFromApi);
    }
    if (Array.isArray(root.data)) {
      return extractToursFromDeparturesPayload(root.data);
    }
  }

  return [];
}

function getTourImageUrl(raw: TourFromApi): string {
  if (raw.image_url) return raw.image_url;
  if (raw.image) return raw.image;
  if (raw.multimedia) return raw.multimedia;
  if (Array.isArray(raw.multimedias) && raw.multimedias[0]) {
    return raw.multimedias[0];
  }
  return "";
}

function normalizeTourFromApi(raw: TourFromApi): OpcionalTour {
  const ratesSource = raw.rates?.length
    ? raw.rates
    : raw.tour_rates_same_currency ?? [];

  return {
    uid: raw.uid,
    name: raw.title ?? raw.name,
    description: plainTextFromOpcionalDescription(raw.description ?? ""),
    imageUrl: getTourImageUrl(raw),
    rates: ratesSource.map((rate) => ({
      code: rate.code,
      price: parseOpcionalPrice(rate.price),
      currency: getOpcionalRateCurrency(rate.currency),
    })),
  };
}

export function parseDeparturesToursResponse(source: unknown): OpcionalTour[] {
  return extractToursFromDeparturesPayload(source).map(normalizeTourFromApi);
}

export function opcionalQtyKey(tourUid: string, rateCode: string): string {
  return `${tourUid}|${rateCode}`;
}

export function getOpcionalRateLabel(code: string): string {
  const key = code.toLowerCase();
  return RATE_LABELS[key] ?? code.toUpperCase();
}

/** Totales de pasajeros según habitaciones agregadas en cotización */
export type CotizacionPassengerTotals = {
  adt: number;
  mnrA: number;
  inf: number;
};

const EMPTY_PASSENGER_TOTALS: CotizacionPassengerTotals = {
  adt: 0,
  mnrA: 0,
  inf: 0,
};

type HabitacionPax = Pick<HabitacionCotizacion, "adt" | "mnrA" | "inf" | "quantity">;

function sumPassengersFromHabitaciones(
  habitaciones: HabitacionPax[],
): CotizacionPassengerTotals {
  return habitaciones.reduce(
    (acc, room) => {
      const qty = getHabitacionQuantity(room as HabitacionCotizacion);
      return {
        adt: acc.adt + (room.adt ?? 0) * qty,
        mnrA: acc.mnrA + (room.mnrA ?? 0) * qty,
        inf: acc.inf + (room.inf ?? 0) * qty,
      };
    },
    { ...EMPTY_PASSENGER_TOTALS },
  );
}

function sortOpcionalRates<T extends { code: string }>(rates: T[]): T[] {
  return rates.toSorted((a, b) => {
    const ai = RATE_SORT_ORDER.indexOf(a.code.toLowerCase());
    const bi = RATE_SORT_ORDER.indexOf(b.code.toLowerCase());
    if (ai === -1 && bi === -1) return a.code.localeCompare(b.code);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

/** Tarifas del tour que aplican según pasajeros en habitaciones */
export function getVisibleOpcionalRates(
  tour: OpcionalTour,
  totals: CotizacionPassengerTotals,
): OpcionalTour["rates"] {
  const rateCodes = tour.rates.map((rate) => rate.code);
  return sortOpcionalRates(
    tour.rates.filter(
      (rate) => getMaxQtyForOpcionalRate(rate.code, totals, rateCodes) > 0,
    ),
  );
}

export function hasOpcionalPassengers(totals: CotizacionPassengerTotals): boolean {
  return totals.adt + totals.mnrA + totals.inf > 0;
}

function isMinorRateCode(code: string): boolean {
  const c = code.toLowerCase();
  return c === "mnr1" || c === "mnr2" || c === "mnr" || c === "mnra";
}

/** Si el tour no trae tarifa inf/chd, el infante de habitación cuenta en tarifa menor */
function tourHasInfantRate(tourRateCodes: string[]): boolean {
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
      }
    }
  }

  return next;
}

export function buildQuantityOptions(max: number): number[] {
  if (max <= 0) return [];
  return Array.from({ length: max }, (_, i) => i + 1);
}

export function getPassengerTotalsFromHabitaciones(
  habitaciones: HabitacionCotizacion[],
): CotizacionPassengerTotals {
  return sumPassengersFromHabitaciones(habitaciones);
}

function calcularTotalOpcional(lineas: OpcionalRateLine[]): number {
  return lineas.reduce((sum, line) => sum + line.subtotal, 0);
}

export function buildOpcionalSeleccionado(
  tour: OpcionalTour,
  quantities: Record<string, number>,
): OpcionalSeleccionado | null {
  const lineas: OpcionalRateLine[] = [];

  for (const rate of tour.rates) {
    const quantity = quantities[opcionalQtyKey(tour.uid, rate.code)] ?? 0;
    if (quantity <= 0) continue;

    lineas.push({
      code: rate.code,
      label: getOpcionalRateLabel(rate.code),
      quantity,
      unitPrice: rate.price,
      currency: rate.currency,
      subtotal: rate.price * quantity,
    });
  }

  if (lineas.length === 0) return null;

  return {
    id: crypto.randomUUID(),
    tourUid: tour.uid,
    name: tour.name,
    lineas,
    total: calcularTotalOpcional(lineas),
    currency: lineas[0]?.currency ?? "USD",
  };
}

export function getOpcionalCartLineSummaries(item: OpcionalSeleccionado): string[] {
  const summaries: string[] = [];
  for (const linea of item.lineas) {
    if (linea.quantity <= 0) continue;
    summaries.push(
      `${linea.code.toLowerCase()}: ${linea.quantity} X $${linea.unitPrice.toFixed(2)}`,
    );
  }
  return summaries;
}
