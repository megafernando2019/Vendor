import type { RefObject } from "react";
import type { ResultData, TravelProgram } from "./disponibilidad";
import type { CotizacionRapidaOpcion } from "./cotizacion-components";

export type { CotizacionRapidaOpcion } from "./cotizacion-components";

export interface DisponibilidadCalendarDeparture {
  date_departure: string;
  uid_blockade: string;
  blockade: string;
}

export interface DisponibilidadTableCalendarProps {
  month?: number;
  year?: number;
  departures?: DisponibilidadCalendarDeparture[];
  date?: string;
  price: number;
}

export interface TourCarouselProps {
  tours: ResultData[];
  setBloqueo?: (bloqueo: TravelProgram) => void;
  setView?: (view: string) => void;
  titulo?: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
}

export interface TourCardProps {
  clv: string;
  nombre: string;
  dias: number;
  noches: number;
  precio: number;
  moneda?: string;
  salidas: number;
  imagen: string;
  favorito?: boolean;
  destinationName?: string;
  departureAirport?: { iata: string; region_name: string };
  priorityImage?: boolean;
}

export interface ContentResultadosProps {
  data: ResultData[];
}

export interface ContentCarrouselResultadosProps {
  data?: ResultData[];
  mode?: "static" | "recommendations";
}

export interface CardCarouselItem {
  image: string;
  name: string;
  price: number;
  sale_price: number;
}

export interface Salida {
  blq: string;
  clv: number;
  departured_at: string;
  returned_at:string;
 dbl_adt_cost:number;
  fechaSalida: string;
  fechaRegreso: string;
  totalDBL: number;
  currency: string;
  comision: number;
  comisionCurrency: string;
  esComisionEspecial?: boolean;
}

export interface TablaSalidasProps {
  salida?: string;
  paises?: string[];
  salidas: Salida[];
  setView?: (view: string) => void;
  onWhatsApp?: (blq: string) => void;
  onCotizar?: (salida: Salida) => void;
  onCotizacionRapida?: (salida: Salida, tipo: CotizacionRapidaOpcion) => void;
}

export interface TourFiltersProps {
  data: ResultData[];
  setResultados?: (data: ResultData[]) => void;
}

export interface RangeSliderProps {
  label: string;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
  format: (v: number) => string;
  pct: (val: number, min: number, max: number) => number;
}
