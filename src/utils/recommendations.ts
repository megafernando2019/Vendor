import type {
  Promotions,
  RecommendationDeparture,
  RecommendationItem,
  RecommendationsData,
  ResultData,
} from "@/interfaces/disponibilidad";

export type RecommendationGroupTab = {
  category: string;
  name: string;
};

export type { Promotions };

export type RecommendationCard = {
  id: string | number;
  category: string;
  clv: string;
  thumb?: string;
  title: string;
  tag?: string;
  offer?: string;
  location: string;
  time: string;
  deletePrice?: number;
  price: number;
  currency: string;
  departuresCount: number;
  days: number;
  nights: number;
  has_promotions: boolean;
  promotions: Promotions[];
  dblAdtBase?: number;
  dblAdtTax?: number;
  dblAdtSupplements?: number;
  filteredDepartures: RecommendationDeparture[];
};

const EMPTY_RECOMMENDATIONS: RecommendationsData = {
  top_10: [],
  exatravel: [],
  cruceros: [],
  ofertas: [],
};

export function normalizeCountries(countries: unknown): string[] {
  if (Array.isArray(countries)) {
    return countries.flatMap((country) => {
      const value = String(country);
      return value ? [value] : [];
    });
  }
  if (typeof countries === "string" && countries.trim()) {
    return countries.split(" - ").flatMap((country) => {
      const value = country.trim();
      return value ? [value] : [];
    });
  }
  return [];
}

function readRecommendationItems(
  source: Record<string, unknown>,
  ...keys: string[]
): RecommendationItem[] {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value as RecommendationItem[];
    }
  }
  return [];
}

export function normalizeRecommendationsData(raw: unknown): RecommendationsData {
  if (!raw || typeof raw !== "object") {
    return EMPTY_RECOMMENDATIONS;
  }

  const record = raw as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  const hasSections = (source: Record<string, unknown>) =>
    "top_10" in source ||
    "exatravel" in source ||
    "cruceros" in source ||
    "ofertas" in source ||
    "offers" in source;

  const source =
    nested && hasSections(nested)
      ? nested
      : hasSections(record)
        ? record
        : nested ?? record;

  return {
    top_10: readRecommendationItems(source, "top_10", "top10"),
    exatravel: readRecommendationItems(source, "exatravel", "exa_travel"),
    cruceros: readRecommendationItems(source, "cruceros", "cruises"),
    ofertas: readRecommendationItems(source, "ofertas", "offers", "promociones"),
  };
}

function normalizePromotions(value: unknown): Promotions[] {
  if (!Array.isArray(value)) return [];

  const result: Promotions[] = [];
  for (const promotion of value) {
    if (
      !promotion ||
      typeof promotion !== "object" ||
      !("name" in promotion || "title" in promotion)
    ) {
      continue;
    }

    const normalized = {
      uuid: String(promotion.uuid ?? promotion.name ?? promotion.title ?? ""),
      name: String(promotion.name ?? promotion.title ?? ""),
    };

    if (normalized.name.trim().length > 0) {
      result.push(normalized);
    }
  }

  return result;
}

function normalizeHasPromotions(
  value: unknown,
  promotions: Promotions[],
): boolean {
  if (promotions.length > 0) return true;
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  return false;
}

function mapRecommendationToResultData(
  item: RecommendationItem
): ResultData {
  const promotions = normalizePromotions(item.promotions);

  return {
    clv: item.clv,
    uuid: item.clv,
    name: item.name,
    destination_id: 0,
    destination_uid: "",
    destination_name: item.destination_name ?? "",
    days: item.days,
    nights: item.nights,
    total_from: item.total_from,
    total_upto: item.total_upto,
    has_promotions: normalizeHasPromotions(item.has_promotions, promotions),
    promotions,
    departures_count: item.departures_count,
    countries: normalizeCountries(item.countries),
    filtered_departures: item.filtered_departures ?? [],
    currencies: item.currencies ?? [],
    multimedias: item.multimedias ?? [],
  };
}
const RECOMMENDATION_SECTIONS: {
  key: keyof RecommendationsData;
  titulo: string;
  descripcion: string;
}[] = [
  {
    key: "top_10",
    titulo: "Top 10",
    descripcion: "Los tours más populares y mejor valorados.",
  },
  {
    key: "exatravel",
    titulo: "Exa Travel",
    descripcion: "Experiencias premium con Exa Travel.",
  },
  {
    key: "cruceros",
    titulo: "Cruceros",
    descripcion: "Viajes con crucero incluido.",
  },
  {
    key: "ofertas",
    titulo: "Ofertas",
    descripcion: "Promociones y precios especiales.",
  },
];

function getRecommendationSectionMeta(key: keyof RecommendationsData) {
  return RECOMMENDATION_SECTIONS.find((s) => s.key === key);
}

function slugifyCategory(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveRecommendationCurrency(item: RecommendationItem): string {
  const fromDeparture = item.filtered_departures?.find(
    (departure) => departure.currency
  )?.currency;
  if (fromDeparture) return fromDeparture;
  if (item.currencies?.[0]) return item.currencies[0];
  return "MXN";
}

function buildDiscountOffer(
  totalFrom: number,
  totalUpto: number,
): string | undefined {
  if (totalUpto <= totalFrom || totalUpto <= 0) return undefined;
  const percent = Math.round(((totalUpto - totalFrom) / totalUpto) * 100);
  return percent > 0 ? `${percent}% Off` : undefined;
}

function resolveSupplements(
  supplements?: number,
  legacySupplements?: number,
): number | undefined {
  if (supplements != null) return supplements;
  if (legacySupplements != null) return legacySupplements;
  return undefined;
}

function resolvePriceBreakdown(item: RecommendationItem): {
  dblAdtBase?: number;
  dblAdtTax?: number;
  dblAdtSupplements?: number;
} {
  const itemBase = item.dbl_adt_base;
  const itemTax = item.dbl_adt_tax;
  const itemSupplements = resolveSupplements(
    item.dbl_adt_supplements,
    item.dbl_adt_suplements,
  );

  if (
    itemBase != null ||
    itemTax != null ||
    itemSupplements != null
  ) {
    return {
      dblAdtBase: itemBase,
      dblAdtTax: itemTax,
      dblAdtSupplements: itemSupplements,
    };
  }

  const cheapestDeparture = (item.filtered_departures ?? []).toSorted(
    (a, b) => a.dbl_adt_cost - b.dbl_adt_cost,
  )[0];

  if (!cheapestDeparture) {
    return {};
  }

  return {
    dblAdtBase: cheapestDeparture.dbl_adt_base,
    dblAdtTax: cheapestDeparture.dbl_adt_tax,
    dblAdtSupplements: resolveSupplements(
      cheapestDeparture.dbl_adt_supplements,
      cheapestDeparture.dbl_adt_suplements,
    ),
  };
}

function mapRecommendationToCard(
  item: RecommendationItem,
  index = 0
): RecommendationCard {
  const countries = normalizeCountries(item.countries);
  const primaryCountry = countries[0];
  const hasDiscount = item.total_upto > item.total_from;
  const promotions = normalizePromotions(item.promotions);
  const hasPromotions = normalizeHasPromotions(item.has_promotions, promotions);
  const priceBreakdown = resolvePriceBreakdown(item);

  return {
    id: item.clv || index,
    category: primaryCountry ? slugifyCategory(primaryCountry) : "general",
    clv: item.clv,
    thumb: item.multimedias?.[0],
    title: item.name,
    tag: primaryCountry,
    offer: buildDiscountOffer(item.total_from, item.total_upto),
    location: item.destination_name || countries.join(" - ") || "Destino",
    time: `${item.days} Días / ${item.nights} Noches`,
    deletePrice: hasDiscount ? item.total_upto : undefined,
    price: item.total_from,
    currency: resolveRecommendationCurrency(item),
    departuresCount: item.departures_count ?? 0,
    days: item.days,
    nights: item.nights,
    has_promotions: hasPromotions,
    promotions,
    filteredDepartures: item.filtered_departures ?? [],
    ...priceBreakdown,
  };
}

function mapResultDataToCard(
  item: ResultData,
  index = 0,
): RecommendationCard {
  return mapRecommendationToCard(
    {
      clv: item.clv,
      destination_name: item.destination_name,
      name: item.name,
      days: item.days,
      nights: item.nights,
      countries: item.countries,
      total_from: item.total_from,
      total_upto: item.total_upto,
      has_promotions: item.has_promotions,
      promotions: item.promotions,
      multimedias: item.multimedias,
      filtered_departures: item.filtered_departures ?? [],
      currencies: item.currencies,
      departures_count: item.departures_count,
    },
    index,
  );
}

export function mapResultDataToCards(items: ResultData[]): RecommendationCard[] {
  return items.map((item, index) => mapResultDataToCard(item, index));
}

function buildCountryFilterGroups(
  items: RecommendationItem[]
): RecommendationGroupTab[] {
  const groups = new Map<string, string>();

  for (const item of items) {
    for (const country of normalizeCountries(item.countries)) {
      const category = slugifyCategory(country);
      if (!groups.has(category)) {
        groups.set(category, country);
      }
    }
  }

  return Array.from(groups.entries()).map(([category, name]) => ({
    category,
    name,
  }));
}

export type RecommendationSectionKey = keyof RecommendationsData;

export function mapRecommendationItemsToCards(items: RecommendationItem[]): {
  cards: RecommendationCard[];
  groups: RecommendationGroupTab[];
} {
  const cards = items.map((item, index) => mapRecommendationToCard(item, index));
  return {
    cards,
    groups: buildCountryFilterGroups(items),
  };
}

/** @deprecated Use mapRecommendationItemsToCards */
function mapTop10Recommendations(items: RecommendationItem[]): {
  cards: RecommendationCard[];
  groups: RecommendationGroupTab[];
} {
  return mapRecommendationItemsToCards(items);
}
