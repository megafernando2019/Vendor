import type { Promotions, ResultData } from "@/interfaces/disponibilidad";
import { normalizeCountries } from "@/utils/recommendations";

export type BusquedaPromotionSummary = {
  uuid: string;
  name: string;
  count: number;
};

export type BusquedaPagePayload = {
  documents: ResultData[];
  promotions_summary: BusquedaPromotionSummary[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizePromotions(value: unknown): Promotions[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((promotion) => {
    if (!isRecord(promotion)) return [];
    const name = String(promotion.name ?? promotion.title ?? "").trim();
    if (!name) return [];

    return [
      {
        uuid: String(promotion.uuid ?? name),
        name,
      },
    ];
  });
}

function normalizeDocument(raw: unknown): ResultData | null {
  if (!isRecord(raw)) return null;

  const clv = String(raw.clv ?? "").trim();
  const name = String(raw.name ?? "").trim();
  if (!clv || !name) return null;

  const countries = normalizeCountries(raw.countries);
  const promotions = normalizePromotions(raw.promotions);
  const filteredDepartures = Array.isArray(raw.filtered_departures)
    ? raw.filtered_departures
    : [];
  const multimedias = Array.isArray(raw.multimedias)
    ? raw.multimedias.map(String)
    : [];
  const currencies = Array.isArray(raw.currencies)
    ? raw.currencies.map(String)
    : [];

  return {
    clv,
    uuid: String(raw.uuid ?? clv),
    name,
    destination_id: Number(raw.destination_id) || 0,
    destination_uid: String(raw.destination_uid ?? ""),
    destination_name: String(raw.destination_name ?? ""),
    days: Number(raw.days) || 0,
    nights: Number(raw.nights) || 0,
    total_from: Number(raw.total_from) || 0,
    total_upto: Number(raw.total_upto) || 0,
    departures_count:
      Number(raw.departures_count) || filteredDepartures.length || 0,
    has_promotions:
      Boolean(raw.has_promotions) || promotions.length > 0,
    promotions,
    countries,
    filtered_departures: filteredDepartures,
    currencies,
    multimedias,
  };
}

function normalizePromotionSummary(
  value: unknown,
): BusquedaPromotionSummary[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const name = String(entry.name ?? "").trim();
    if (!name) return [];

    return [
      {
        uuid: String(entry.uuid ?? name),
        name,
        count: Number(entry.count) || 0,
      },
    ];
  });
}

/**
 * Supports both shapes:
 * - Legacy: data = ResultData[]
 * - Current: data = [{ documents: ResultData[], promotions_summary: [...] }]
 */
export function normalizeBusquedaPayload(rawData: unknown): BusquedaPagePayload {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return { documents: [], promotions_summary: [] };
  }

  const first = rawData[0];

  if (isRecord(first) && Array.isArray(first.documents)) {
    return {
      documents: first.documents
        .map(normalizeDocument)
        .filter((item): item is ResultData => item != null),
      promotions_summary: normalizePromotionSummary(first.promotions_summary),
    };
  }

  return {
    documents: rawData
      .map(normalizeDocument)
      .filter((item): item is ResultData => item != null),
    promotions_summary: [],
  };
}
