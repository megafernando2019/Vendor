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
  total: number;
}

export const ROOM_TAB_DISPLAY: Record<RoomTabLabel, string> = {
  sencilla: "Sencilla",
  doble: "Doble",
  triple: "Triple",
  cuadruple: "Cuádruple",
};

export function tabToRoomType(tab: RoomTabLabel): RoomTypeApi {
  if (tab === "sencilla") return "sgl";
  if (tab === "doble") return "dbl";
  if (tab === "cuadruple") return "cpl";
  return "tpl";
}

export const COTIZACION_RAPIDA_OPCIONES = [
  "2 ADT",
  "2 ADT + 1MNR",
  "2 ADT + Asistencias Full",
] as const;

export type CotizacionRapidaOpcion = (typeof COTIZACION_RAPIDA_OPCIONES)[number];
