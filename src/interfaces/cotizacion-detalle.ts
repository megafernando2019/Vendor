import type { CotizacionQuotePayload } from "./cotizacion-quote-payload";

export type CotizacionSavePassenger = {
  type: string;
  name: string;
  price: string;
  tax: string;
  suplements: { name: string; price: string }[];
};

export type CotizacionSaveRoom = {
  room_sequence: number;
  type: string;
  name: string;
  passengers: CotizacionSavePassenger[];
};

export type CotizacionSaveInsurance = {
  uid: string;
  name: string;
  insurer: string;
  price_day: number;
  days: number;
  total: number;
  addon: number;
  addon_name: string | null;
  addon_price_travel: number;
  is_elderly: number;
};

export type CotizacionSaveTour = {
  uid: string;
  name: string;
  code: string;
  price: string;
  passengers: number;
};

export type CotizacionSaveResponse = {
  uid: string;
  status: {
    id: number;
    name: string;
  };
  bloqueo: {
    name: string;
    departured_at: string;
    returned_at: string;
    currency: {
      name: string;
      code: string;
    };
  };
  total: number;
  taxes: number;
  suplements: number;
  rooms: CotizacionSaveRoom[];
  insurances: CotizacionSaveInsurance[];
  tours: CotizacionSaveTour[];
  count_rooms: number;
  count_passengers: number;
  created: string;
};

export type CotizacionDetalleStorage = {
  payload: CotizacionQuotePayload;
  response: CotizacionSaveResponse;
  quoteKey: string;
  contactEmail: string;
  savedAt: string;
};

export const COTIZACION_DETALLE_KEY = "cotizacion_detalle";
