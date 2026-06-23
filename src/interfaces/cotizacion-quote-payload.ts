/** Payload para generar cotización (shape esperado por el API) */

export type CotizacionQuotePassenger = {
  type: string;
  age: string;
  rate: string;
};

export type CotizacionQuoteRoom = {
  rate: string;
  type: string;
  adt: string;
  mnr: string;
  inf: string;
  tot_infants: string;
  passengers: CotizacionQuotePassenger[];
};

export type CotizacionQuoteAssistancePax = {
  id_insurance: string;
  is_elderly?: string;
  addon?: boolean;
  addon_id?: string;
  addon_price_travel?: string;
  addon_name?: string;
  price_day: string;
  name: string;
  insurer: string;
  rate_exchange: number;
};

export type CotizacionQuoteTour = {
  pax: string;
  code: string;
  uid: string;
};

export type CotizacionQuotePayload = {
  observations: null;
  rooms: CotizacionQuoteRoom[];
  include_insurance: string;
  assistance_pax: CotizacionQuoteAssistancePax[];
  tours: CotizacionQuoteTour[];
  buid: string;
  bloqueo_uid: string;
  uuid: null;
  customer_model: string;
  customer_mc: string;
  customer_contact_mail: string;
  customer_fn: string;
  quote_contact_way_id: string;
  destination_id: string;
  mt: string;
};

export type CotizacionQuoteCustomerContext = {
  customer_model?: string;
  customer_mc?: string;
  customer_contact_mail?: string;
  customer_fn?: string;
  quote_contact_way_id?: string;
  rate_exchange?: number;
};

export type SessionUserCookie = {
  mc?: string;
  email?: string;
  fn?: string;
};
