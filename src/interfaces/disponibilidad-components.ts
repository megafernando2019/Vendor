import type { Promotions, ResultData } from "@/interfaces/disponibilidad";

export type DisponibilidadFilterLimits = {
  duracion: { min: number; max: number };
  precio: { min: number; max: number };
};

export type PromotionFilterOption = {
  key: string;
  name: string;
  count: number;
};

export type DisponibilidadFilters = {
  salida: string;
  duracionMin: number;
  duracionMax: number;
  precioMin: number;
  precioMax: number;
  promotions: string[];
};

export type TourFiltersProps = {
  limits: DisponibilidadFilterLimits;
  filters: DisponibilidadFilters;
  onFiltersChange: (filters: DisponibilidadFilters) => void;
  onReset: () => void;
};

export type PromotionFiltersProps = {
  options: PromotionFilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export type RangeSliderProps = {
  label: string;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  "aria-label"?: string;
  valueMin: number;
  valueMax: number;
  onChangeMin: (value: number) => void;
  onChangeMax: (value: number) => void;
  format: (value: number) => string;
  pct: (val: number, min: number, max: number) => number;
};

const DEFAULT_FILTER_LIMITS: DisponibilidadFilterLimits = {
  duracion: { min: 1, max: 60 },
  precio: { min: 0, max: 15000 },
};

export function createDefaultFilters(
  limits: DisponibilidadFilterLimits = DEFAULT_FILTER_LIMITS,
): DisponibilidadFilters {
  return {
    salida: "",
    duracionMin: limits.duracion.min,
    duracionMax: limits.duracion.max,
    precioMin: limits.precio.min,
    precioMax: limits.precio.max,
    promotions: [],
  };
}

function getPromotionKey(promotion: Promotions): string {
  const uuid = promotion.uuid?.trim();
  if (uuid) return uuid;

  const name = promotion.name?.trim();
  if (!name) return "";

  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function computeDisponibilidadPromotionOptions(
  data: ResultData[],
): PromotionFilterOption[] {
  const options = new Map<string, { name: string; count: number }>();

  for (const item of data) {
    const seenInItem = new Set<string>();

    for (const promotion of item.promotions ?? []) {
      const key = getPromotionKey(promotion);
      if (!key || seenInItem.has(key)) continue;

      seenInItem.add(key);
      const existing = options.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        options.set(key, {
          name: promotion.name?.trim() || key,
          count: 1,
        });
      }
    }
  }

  return Array.from(options.entries())
    .map(([key, value]) => ({
      key,
      name: value.name,
      count: value.count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function resultMatchesPromotionFilters(
  item: ResultData,
  selectedPromotions: string[],
): boolean {
  if (selectedPromotions.length === 0) return true;

  const itemPromotionKeys = new Set(
    (item.promotions ?? [])
      .map(getPromotionKey)
      .filter((key): key is string => Boolean(key)),
  );

  return selectedPromotions.some((key) => itemPromotionKeys.has(key));
}

export function computeDisponibilidadFilterLimits(
  data: ResultData[],
): DisponibilidadFilterLimits {
  if (data.length === 0) {
    return DEFAULT_FILTER_LIMITS;
  }

  const dias = data.map((item) => item.days);
  const precios = data.map((item) => item.total_from);

  return {
    duracion: { min: Math.min(...dias), max: Math.max(...dias) },
    precio: { min: Math.min(...precios), max: Math.max(...precios) },
  };
}

function getResultDepartureIatas(item: ResultData): string[] {
  const extended = item as ResultData & {
    departure_airports?: { iata?: string }[];
  };

  const fromAirports = (extended.departure_airports ?? [])
    .map((airport) => airport.iata?.toUpperCase())
    .filter((iata): iata is string => Boolean(iata));

  if (fromAirports.length > 0) {
    return fromAirports;
  }

  const fromDepartures = (item.filtered_departures ?? []).flatMap((departure) => {
    if (!departure || typeof departure !== "object") return [];
    const record = departure as { departure_airport?: { iata?: string } };
    const iata = record.departure_airport?.iata?.toUpperCase();
    return iata ? [iata] : [];
  });

  return fromDepartures;
}

export function filterDisponibilidadResults(
  data: ResultData[],
  filters: DisponibilidadFilters,
): ResultData[] {
  return data.filter((item) => {
    if (
      item.days < filters.duracionMin ||
      item.days > filters.duracionMax ||
      item.total_from < filters.precioMin ||
      item.total_from > filters.precioMax
    ) {
      return false;
    }

    if (!resultMatchesPromotionFilters(item, filters.promotions)) {
      return false;
    }

    if (!filters.salida) {
      return true;
    }

    const iatas = getResultDepartureIatas(item);
    if (iatas.length === 0) {
      return true;
    }

    return iatas.includes(filters.salida.toUpperCase());
  });
}

export function hasActiveDisponibilidadFilters(
  filters: DisponibilidadFilters,
  limits: DisponibilidadFilterLimits,
): boolean {
  return (
    filters.salida !== "" ||
    filters.promotions.length > 0 ||
    filters.duracionMin !== limits.duracion.min ||
    filters.duracionMax !== limits.duracion.max ||
    filters.precioMin !== limits.precio.min ||
    filters.precioMax !== limits.precio.max
  );
}
