export interface ResultData {
    clv: string;
    uuid: string;
    name: string;
    destination_id: number;
    destination_uid: string;
    destination_name: string;
    days: number;
    nights: number;
    total_from: number;
    total_upto: number;
    departures_count: number;

countries: string[];        // ← agregar
  filtered_departures: any[]; // ← agregar (reemplaza `any` con el tipo real)
    currencies: string[];
    multimedias: string[];
}

export interface RecommendationDeparture {
  uid: string;
  departured_at: string;
  returned_at: string;
  dbl_adt_cost: number;
  currency: string;
}

export interface RecommendationItem {
  clv: string;
  destination_name: string;
  name: string;
  days: number;
  nights: number;
  countries: string | string[];
  total_from: number;
  total_upto: number;
  multimedias: string[];
  filtered_departures: RecommendationDeparture[];
  currencies: string[];
  departures_count: number;
}

export interface RecommendationsData {
  top_10: RecommendationItem[];
  exatravel: RecommendationItem[];
  cruceros: RecommendationItem[];
  ofertas: RecommendationItem[];
}

export interface DepartureData {
  month: string; 
  total: number; 
  prices: Prices;
  departures: string[]; 
}

export interface Prices {
  dbl: number; 
  tpl: number;
}

export interface ProgramData {
  additional: AdditionalData;
}

export interface AdditionalData {
  airlines: Airline[];
  countries: Country[];
  cities: City[];
  itinerary: string; 
  visas: string; 
  include: string; 
  not_include: string; 
  hotels: string; 
  additional_notes: string; 
}

export interface Airline {
  name: string;
  code: string;
  img: string; 
}

export interface Country {
  name: string;
  iata: string;
  visa: VisaRequirement[];
}

export interface VisaRequirement {
  country: string;
  description: string; 
}

export interface City {
  name: string;
  longitude: string;
  latitude: string;
  country_code_iata: string;
}

export interface Airline {
  name: string;
  code: string;
  img: string;
}

export interface City {
  name: string;
  longitude: string;
  latitude: string;
  country_code_iata: string;
}

export interface Additional {
  airlines: Airline[];
  cities: City[];
  itinerary: string;
  include: string;
  not_include: string;
  visas: string;
  hotels: string;
  additional_notes: string | null;
}

export interface Promotion {
  uuid: string;
  name: string;
  icon: string;
  color: string;
  has_value: boolean;
  value: string;
  notes: string;
}

export interface DepartureAirport {
  iata: string;
  region_name: string;
}

export interface BloqueoData {
  _id: string;
  clv: string;
  name: string;
  destination_id: number;
  destination_name: string;
  days: number;
  nights: number;
  cities: string;
  countries: string;
  total_from: number;
  total_upto: number;
  filtered_departures_count: number;
  multimedias: string[];
  currencies: string[];
  tours: Tour[];
  promotions: Promotion[];
  departure_airports: DepartureAirport[];
  additional: Additional;
}

export interface CotizacionViewProps {
  bloqueo: {
    success: boolean;
    data: BloqueoData[];
  };
  programaId?: string;
}


export type TravelProgram = {
  departures_data: MonthDepartures[];
  program_data: {
    additional: ProgramAdditional;
  };
};

export type MonthDepartures = {
  month: string;       // "2026-05"
  total: number;
  departures: Departure[];
};

export type Departure = {
  date_departure: string;  // "2026-05-28T06:00:00"
  uid_blockade: string;
  blockade: string;
  prices: { dbl: number };
  currency: string;
};

export type ProgramAdditional = {
  airlines: { name: string; code: string; img: string }[];
  cities: { name: string; longitude: string; latitude: string; country_code_iata: string }[];
  countries: { name: string; iata: string; visa: any[] }[];
  itinerary: string;
  include: string;
  not_include: string;
  visas: string;
  hotels: string;
  additional_notes: string;
};

export type ProgramInfo = {
  clv: string;
  name: string;
  days: number;
  nights: number;
  destination_name: string;
  total_from: number;
  currency: string;
  passengers?: number;
  departure_airport?: { iata: string; region_name: string };
  tours?: Tour[];
};

export type Tour = {
  uid: string;
  name: string;
  description: string;
  is_refundable: boolean;
  rates: { code: string; price: number; currency: string }[];
};