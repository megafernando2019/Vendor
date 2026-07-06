export interface CotizacionCalendarPrices {
  dbl?: number;
  tpl?: number;
}

export interface CotizacionCalendarDeparture {
  date_departure: string;
  uid_blockade: string;
  blockade: string;
  currency: string;
  prices: CotizacionCalendarPrices;
}

export interface CotizacionTableCalendarProps {
  readonly month?: number;
  readonly year?: number;
  readonly departures?: CotizacionCalendarDeparture[];
  readonly sendDep: (dep: readonly [string, string]) => void;
}
export interface RoutesImages {
  sencilla?: String;   // Adultos
  doble?: String;   // Infantes
  triple?: String;  // Menores tipo 1
}


export interface RoomRules {
  sgl?: RoomRule[]; // Habitación sencilla
  dbl?: RoomRule[]; // Habitación doble
  tpl?: RoomRule[]; // Habitación triple
  cpl?: RoomRule[]; // Habitación triple
}
export interface RulesTab {
  tab: keyof RulesText;
}

export type RoomTabLabel = "sencilla" | "doble" | "triple" | "cuadruple";
export type RoomTypeApi = "sgl" | "dbl" | "tpl" | "cpl";

export interface RoomRule {
  adt?: number;
  mnrA?: number;
  inf?: number;
}

export interface RulesText {
  sencilla: string;
  doble: string;
  triple: string;
}

export interface HabitacionCosts {
  grand_base: number;
  grand_suplements: number;
  grand_tax: number;
  grand_total: number;
}

export interface HabitacionCotizacion {
  id: string;
  roomLabel: RoomTabLabel;
  roomType: RoomTypeApi;
  adt: number;
  mnrA: number;
  inf: number;
  destinationId: number;
  blockadeUid: string;
  costs: HabitacionCosts;
  /** Total unitario USD de una habitación */
  total: number;
  quantity?: number;
}

export function getHabitacionQuantity(room: HabitacionCotizacion): number {
  return room.quantity && room.quantity > 0 ? room.quantity : 1;
}

export function getHabitacionUnitTotal(room: HabitacionCotizacion): number {
  return room.total ?? room.costs?.grand_total ?? 0;
}

export function getHabitacionLineTotal(room: HabitacionCotizacion): number {
  return getHabitacionUnitTotal(room) * getHabitacionQuantity(room);
}

export function habitacionConfigKey(
  room: Pick<
    HabitacionCotizacion,
    "roomType" | "adt" | "mnrA" | "inf" | "blockadeUid"
  >,
): string {
  return `${room.roomType}|${room.adt}|${room.mnrA}|${room.inf}|${room.blockadeUid}`;
}

const ROOM_TAB_DISPLAY: Record<RoomTabLabel, string> = {
  sencilla: "Sencilla",
  doble: "Doble",
  triple: "Triple",
  cuadruple: "Cuádruple",
};

export const ROOM_TAB_LABELS: RoomTabLabel[] = [
  "sencilla",
  "doble",
  "triple",
];

export function tabToRoomType(tab: RoomTabLabel): RoomTypeApi {
  if (tab === "sencilla") return "sgl";
  if (tab === "doble") return "dbl";
  if (tab === "cuadruple") return "cpl";
  return "tpl";
}

export function getRoomTabDisplay(tab: RoomTabLabel): string {
  return ROOM_TAB_DISPLAY[tab];
}

export function getRoomRulesForTab(
  rules: RoomRules,
  tab: RoomTabLabel,
): RoomRule[] {
  const roomType = tabToRoomType(tab);
  return rules[roomType] ?? [];
}

export function ruleKey(rule: RoomRule, index: number): string {
  return `${rule.adt ?? 0}-${rule.mnrA ?? 0}-${rule.inf ?? 0}-${index}`;
}

export function formatRuleSummary(rule: RoomRule): string {
  const parts: string[] = [];
  if (rule.adt) parts.push(`${rule.adt} ADT`);
  if (rule.mnrA) parts.push(`${rule.mnrA} MNR`);
  if (rule.inf) parts.push(`${rule.inf} INF`);
  return parts.join(" + ") || "Sin pasajeros";
}

export type CotizacionSelectedDeparture = {
  mt: string;
  blockadeUid: string;
  departuredAt: string;
  currency: string;
  price: number;
};

export type CotizacionRulesData = {
  destinationId: number;
  roomRules: RoomRules;
  rulesText: RulesText;
  routesImages: RoutesImages;
  currency: string;
};

const COTIZACION_RAPIDA_OPCIONES = [
  "2 ADT",
  "2 ADT + 1MNR",
  "2 ADT + Asistencias Full",
] as const;

export type CotizacionRapidaOpcion = (typeof COTIZACION_RAPIDA_OPCIONES)[number];
