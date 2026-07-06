import type { ResultData } from "@/interfaces/disponibilidad";

export type DisponibilidadFilterLimits = {
  duracion: { min: number; max: number };
  precio: { min: number; max: number };
};

export type DisponibilidadFilters = {
  salida: string;
  duracionMin: number;
  duracionMax: number;
  precioMin: number;
  precioMax: number;
};

export type TourFiltersProps = {
  limits: DisponibilidadFilterLimits;
  filters: DisponibilidadFilters;
  onFiltersChange: (filters: DisponibilidadFilters) => void;
  onReset: () => void;
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
  };
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
    filters.duracionMin !== limits.duracion.min ||
    filters.duracionMax !== limits.duracion.max ||
    filters.precioMin !== limits.precio.min ||
    filters.precioMax !== limits.precio.max
  );
}
