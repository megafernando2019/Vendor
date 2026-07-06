import type {
  RecommendationDeparture,
  ResultData,
} from "@/interfaces/disponibilidad";

export type ProgramType = "selected" | "similar";

export type MonthOption = {
  key: string;
  label: string;
  monthIndex: number;
  year: number;
  count: number;
};

export type DayPrice = {
  day: number;
  price: number;
  currency: string;
  program: ProgramType;
  departureUid: string;
  departuredAt: string;
  returnedAt?: string;
};

const MONTH_LABELS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function parseDepartureDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthKeyFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function normalizeMtParam(value: string | number): string {
  return String(value).replace(/^MT/i, "").trim();
}

export function findTourByMt(
  resultados: ResultData[],
  mt: string,
): ResultData | undefined {
  const normalized = normalizeMtParam(mt);
  return resultados.find((item) => normalizeMtParam(item.clv) === normalized);
}

export function findSimilarTour(
  resultados: ResultData[],
  mt: string,
): ResultData | undefined {
  const normalized = normalizeMtParam(mt);
  return resultados.find(
    (item) =>
      normalizeMtParam(item.clv) !== normalized &&
      (item.filtered_departures?.length ?? 0) > 0,
  );
}

export function buildWizardCalendarData(
  selectedDepartures: RecommendationDeparture[],
  similarDepartures: RecommendationDeparture[],
): { months: MonthOption[]; dayPrices: Record<string, DayPrice[]> } {
  const dayPricesByMonth = new Map<string, Map<number, DayPrice>>();

  const addDeparture = (
    departure: RecommendationDeparture,
    program: ProgramType,
  ) => {
    const date = parseDepartureDate(departure.departured_at);
    if (!date) return;

    const key = monthKeyFromDate(date);
    const day = date.getDate();

    if (!dayPricesByMonth.has(key)) {
      dayPricesByMonth.set(key, new Map());
    }

    const monthMap = dayPricesByMonth.get(key)!;
    const existing = monthMap.get(day);

    if (existing?.program === "selected" && program === "similar") {
      return;
    }

    monthMap.set(day, {
      day,
      price: departure.dbl_adt_cost,
      currency: departure.currency || "USD",
      program,
      departureUid: departure.uid,
      departuredAt: departure.departured_at,
      returnedAt: departure.returned_at,
    });
  };

  for (const departure of similarDepartures) {
    addDeparture(departure, "similar");
  }
  for (const departure of selectedDepartures) {
    addDeparture(departure, "selected");
  }

  const months: MonthOption[] = Array.from(dayPricesByMonth.entries())
    .map(([key, dayMap]) => {
      const [yearStr, monthStr] = key.split("-");
      const monthIndex = Number(monthStr) - 1;
      const year = Number(yearStr);
      return {
        key,
        label: MONTH_LABELS[monthIndex] ?? key,
        monthIndex,
        year,
        count: dayMap.size,
      };
    })
    .toSorted((a, b) => a.key.localeCompare(b.key));

  const dayPrices: Record<string, DayPrice[]> = {};
  for (const [key, dayMap] of dayPricesByMonth) {
    dayPrices[key] = Array.from(dayMap.values()).toSorted(
      (a, b) => a.day - b.day,
    );
  }

  return { months, dayPrices };
}

export function formatDeparturePrice(price: number, currency: string): string {
  return `$${price.toLocaleString("en-US")} ${currency}`;
}

export function formatDisplayDate(value: string): string {
  const date = parseDepartureDate(value);
  if (!date) return value;
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const QUOTE_WIZARD_WEEKDAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

function getMondayBasedOffset(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function buildCalendarCells(monthIndex: number, year: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingEmpty = getMondayBasedOffset(firstDay);
  const cells: (number | null)[] = [];

  for (let i = 0; i < leadingEmpty; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export type WizardCalendarData = {
  months: MonthOption[];
  dayPrices: Record<string, DayPrice[]>;
};
