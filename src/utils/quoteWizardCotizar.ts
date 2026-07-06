import type { MonthDepartures, RecommendationDeparture } from "@/interfaces/disponibilidad";
import { normalizeCountries } from "@/utils/recommendations";
import {
  buildWizardCalendarData,
  normalizeMtParam,
  type WizardCalendarData,
} from "@/utils/quoteWizardCalendar";

export type QuoteWizardTour = {
  clv: string;
  name: string;
  days: number;
  nights: number;
  destination_name: string;
  countries: string;
  multimedias: string[];
};

export type QuoteWizardAdditional = {
  itinerary: string;
  include: string;
  not_include: string;
  visas: string;
};

export const EMPTY_QUOTE_WIZARD_ADDITIONAL: QuoteWizardAdditional = {
  itinerary: "",
  include: "",
  not_include: "",
  visas: "",
};

type CotizarAdditionalRaw = {
  itinerary?: string;
  include?: string;
  not_include?: string;
  visas?: string;
};

type CotizarProgramRaw = {
  clv?: string;
  name?: string;
  days?: number;
  nights?: number;
  destination_name?: string;
  countries?: unknown;
  multimedias?: string[];
  departures?: MonthDepartures[];
  additional?: CotizarAdditionalRaw;
};

type DepartureWithBlockade = RecommendationDeparture & { blockade?: string };

function extractCotizarPrograms(payload: unknown): CotizarProgramRaw[] {
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.data)) {
    return record.data as CotizarProgramRaw[];
  }

  const nested = record.data;
  if (
    nested &&
    typeof nested === "object" &&
    Array.isArray((nested as Record<string, unknown>).data)
  ) {
    return (nested as { data: CotizarProgramRaw[] }).data;
  }

  return [];
}

function mapCotizarDeparturesToRecommendation(
  departuresData: MonthDepartures[],
): DepartureWithBlockade[] {
  const result: DepartureWithBlockade[] = [];

  for (const monthGroup of departuresData) {
    for (const departure of monthGroup.departures ?? []) {
      result.push({
        uid: departure.uid_blockade,
        departured_at: departure.date_departure,
        returned_at: "",
        dbl_adt_cost: departure.prices?.dbl ?? 0,
        currency: departure.currency || "USD",
        blockade: departure.blockade,
      });
    }
  }

  return result;
}

/** blockade suele venir como "12472-13" (MT + variante de salida) */
export function blockadeBelongsToMt(blockade: string, mt: string): boolean {
  const normalizedMt = normalizeMtParam(mt);
  const normalizedBlockade = normalizeMtParam(blockade);
  if (!normalizedBlockade) return true;
  if (normalizedBlockade === normalizedMt) return true;
  const blockadeBase = normalizedBlockade.split("-")[0]?.trim();
  return blockadeBase === normalizedMt;
}

function programHasDeparturesForMt(
  program: CotizarProgramRaw,
  mt: string,
): boolean {
  const departures = mapCotizarDeparturesToRecommendation(
    program.departures ?? [],
  );
  return departures.some((departure) =>
    blockadeBelongsToMt(departure.blockade ?? "", mt),
  );
}

function pickPrimaryProgram(
  programs: CotizarProgramRaw[],
  mt: string,
): CotizarProgramRaw {
  const normalizedMt = normalizeMtParam(mt);

  return (
    programs.find(
      (item) => normalizeMtParam(String(item.clv ?? "")) === normalizedMt,
    ) ??
    programs.find((item) => programHasDeparturesForMt(item, normalizedMt)) ??
    programs[0]
  );
}

function splitDeparturesByBlockadeMt(
  departures: DepartureWithBlockade[],
  mt: string,
): {
  selected: RecommendationDeparture[];
  similar: RecommendationDeparture[];
  similarClv?: string;
} {
  const normalizedMt = normalizeMtParam(mt);
  const selected: RecommendationDeparture[] = [];
  const similar: RecommendationDeparture[] = [];
  let similarClv: string | undefined;

  for (const departure of departures) {
    if (blockadeBelongsToMt(departure.blockade ?? "", normalizedMt)) {
      selected.push(departure);
      continue;
    }

    similar.push(departure);
    if (!similarClv && departure.blockade) {
      const candidate = normalizeMtParam(departure.blockade.split("-")[0] ?? "");
      if (candidate && candidate !== normalizedMt) {
        similarClv = candidate;
      }
    }
  }

  return { selected, similar, similarClv };
}

function mapAdditional(raw?: CotizarAdditionalRaw): QuoteWizardAdditional {
  return {
    itinerary: raw?.itinerary ?? "",
    include: raw?.include ?? "",
    not_include: raw?.not_include ?? "",
    visas: raw?.visas ?? "",
  };
}

export function mapCotizarResponseToWizard(
  payload: unknown,
  mt: string,
): {
  tour: QuoteWizardTour;
  calendar: WizardCalendarData;
  similarClv?: string;
  additional: QuoteWizardAdditional;
} | null {
  const programs = extractCotizarPrograms(payload);
  if (programs.length === 0) return null;

  const normalizedMt = normalizeMtParam(mt);
  const primary = pickPrimaryProgram(programs, normalizedMt);

  if (!primary) return null;

  const allDepartures = programs.flatMap((program) =>
    mapCotizarDeparturesToRecommendation(program.departures ?? []),
  );
  const { selected, similar, similarClv: similarClvFromBlockade } =
    splitDeparturesByBlockadeMt(allDepartures, normalizedMt);

  const calendar = buildWizardCalendarData(selected, similar);
  const countries = normalizeCountries(primary.countries).join(", ");

  return {
    tour: {
      clv: normalizeMtParam(String(primary.clv ?? normalizedMt)),
      name: primary.name ?? `MT${normalizedMt}`,
      days: Number(primary.days) || 0,
      nights: Number(primary.nights) || 0,
      destination_name: primary.destination_name ?? "",
      countries,
      multimedias: primary.multimedias ?? [],
    },
    calendar,
    similarClv: similarClvFromBlockade,
    additional: mapAdditional(primary.additional),
  };
}
