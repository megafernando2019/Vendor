import type { ResultData } from "@/interfaces/disponibilidad";
import type { RecommendationSectionConfig } from "@/utils/recommendations";
import type { BusquedaPromotionSummary } from "@/utils/normalizeBusqueda";

const PROMOTIONS_SUMMARY_KEY = "promotions_summary";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeCountries(value: unknown): string | string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string") return value;
  return "";
}

function normalizePromotions(
  value: unknown,
): ResultData["promotions"] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const name = String(entry.name ?? "").trim();
    if (!name) return [];
    return [
      {
        uuid: String(entry.uuid ?? name),
        name,
      },
    ];
  });
}

function normalizeProgram(raw: unknown): ResultData | null {
  if (!isRecord(raw)) return null;

  const clv = String(raw.clv ?? "").trim();
  const name = String(raw.name ?? "").trim();
  if (!clv || !name) return null;

  const filteredDepartures = Array.isArray(raw.filtered_departures)
    ? raw.filtered_departures
    : [];
  const promotions = normalizePromotions(raw.promotions);

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
    has_promotions: Boolean(raw.has_promotions) || promotions.length > 0,
    promotions,
    countries: normalizeCountries(raw.countries),
    filtered_departures: filteredDepartures,
    currencies: Array.isArray(raw.currencies)
      ? raw.currencies.map(String)
      : [],
    multimedias: Array.isArray(raw.multimedias)
      ? raw.multimedias.map(String)
      : [],
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

export type AgencyListsCatalog = {
  lists: Record<string, ResultData[]>;
  promotionsSummary: BusquedaPromotionSummary[];
  sections: RecommendationSectionConfig[];
};

export function normalizeAgencyListsCatalog(
  data: unknown,
): AgencyListsCatalog {
  if (!isRecord(data)) {
    return { lists: {}, promotionsSummary: [], sections: [] };
  }

  const promotionsSummary = normalizePromotionSummary(
    data[PROMOTIONS_SUMMARY_KEY],
  );
  const lists: Record<string, ResultData[]> = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === PROMOTIONS_SUMMARY_KEY) continue;
    if (!Array.isArray(value)) continue;

    const programs = value
      .map(normalizeProgram)
      .filter((item): item is ResultData => item != null);

    lists[key] = programs;
  }

  const sections: RecommendationSectionConfig[] = Object.entries(lists)
    .map(([key, items], index) => ({
      key,
      label: key,
      description: "",
      count: items.length,
      order: index + 1,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "es"));

  return { lists, promotionsSummary, sections };
}
