import type {
  HabitacionCotizacion,
  RoomRule,
  RoomRules,
  RoomTypeApi,
} from "@/src/interfaces/cotizacion-components";
import type {
  CotizacionQuotePayload,
  CotizacionQuotePassenger,
  CotizacionQuoteAssistancePax,
  CotizacionQuoteTour,
  CotizacionQuoteCustomerContext,
} from "@/src/interfaces/cotizacion-quote-payload";
import type {
  AddonSeleccionado,
  AsistenciaSeleccionada,
  CoberturaLinea,
} from "@/src/interfaces/seguros-cotizacion";
import type { OpcionalSeleccionado } from "@/src/interfaces/opcionales-cotizacion";

const DEFAULT_PASSENGER_RATE = "1";
const DEFAULT_ROOM_RATE = "1";

const PASSENGER_AGE_BY_TYPE: Record<string, string> = {
  adt: "1900-01-01",
  mnr: "1900-01-01",
  mnr1: "1900-01-01",
  inf: "1900-01-01",
};

function str(n: number): string {
  return String(n);
}

function passengerAge(type: string): string {
  return PASSENGER_AGE_BY_TYPE[type.toLowerCase()] ?? "1900-01-01";
}

function buildPassengers(
  adt: number,
  mnrA: number,
  inf: number
): CotizacionQuotePassenger[] {
  const passengers: CotizacionQuotePassenger[] = [];

  for (let i = 0; i < adt; i++) {
    passengers.push({
      type: "adt",
      age: passengerAge("adt"),
      rate: DEFAULT_PASSENGER_RATE,
    });
  }
  for (let i = 0; i < mnrA; i++) {
    passengers.push({
      type: "mnr",
      age: passengerAge("mnr"),
      rate: DEFAULT_PASSENGER_RATE,
    });
  }
  for (let i = 0; i < inf; i++) {
    passengers.push({
      type: "inf",
      age: passengerAge("inf"),
      rate: DEFAULT_PASSENGER_RATE,
    });
  }

  return passengers;
}

function buildRoomFromHabitacion(h: HabitacionCotizacion) {
  const adt = h.adt ?? 0;
  const mnr = h.mnrA ?? 0;
  const inf = h.inf ?? 0;

  return {
    rate: DEFAULT_ROOM_RATE,
    type: h.roomType,
    adt: str(adt),
    mnr: str(mnr),
    inf: str(inf),
    tot_infants: str(inf),
    passengers: buildPassengers(adt, mnr, inf),
  };
}

function buildAssistanceEntry(
  linea: CoberturaLinea,
  asistencia: AsistenciaSeleccionada,
  addon: AddonSeleccionado | undefined,
  rateExchange: number
): CotizacionQuoteAssistancePax {
  const base: CotizacionQuoteAssistancePax = {
    id_insurance: str(linea.productId),
    is_elderly: linea.is_elderly ?? "75",
    price_day: linea.price_day ?? "0.00",
    name: linea.name,
    insurer: asistencia.providerKey,
    rate_exchange: rateExchange,
  };

  if (!addon) {
    return base;
  }

  return {
    ...base,
    addon: true,
    addon_id: str(addon.id),
    addon_price_travel: addon.price.toFixed(2),
    addon_name: addon.name,
  };
}

function buildAssistancePaxList(
  asistencias: AsistenciaSeleccionada[],
  rateExchange: number
): CotizacionQuoteAssistancePax[] {
  const list: CotizacionQuoteAssistancePax[] = [];

  for (const asistencia of asistencias) {
    const lineas =
      asistencia.coberturas && asistencia.coberturas.length > 0
        ? asistencia.coberturas
        : [
            {
              productId: asistencia.productId,
              name: asistencia.name,
            },
          ];

    const addon = asistencia.addonsSeleccionados?.[0];

    for (const linea of lineas) {
      list.push(buildAssistanceEntry(linea, asistencia, addon, rateExchange));
    }
  }

  return list;
}

function buildTours(opcionales: OpcionalSeleccionado[]): CotizacionQuoteTour[] {
  const tours: CotizacionQuoteTour[] = [];

  for (const tour of opcionales) {
    for (const line of tour.lineas) {
      if (line.quantity <= 0) continue;
      tours.push({
        pax: str(line.quantity),
        code: line.code.toLowerCase(),
        uid: tour.tourUid,
      });
    }
  }

  return tours;
}

function ruleTotal(rule: RoomRule): number {
  return (rule.adt ?? 0) + (rule.mnrA ?? 0) + (rule.inf ?? 0);
}

function findMatchingRoomRule(
  passengerCount: number,
  roomRules?: RoomRules
): { roomType: RoomTypeApi; rule: RoomRule } | null {
  if (!roomRules) return null;

  const types: { roomType: RoomTypeApi; key: keyof RoomRules }[] = [
    { roomType: "sgl", key: "sgl" },
    { roomType: "dbl", key: "dbl" },
    { roomType: "tpl", key: "tpl" },
    { roomType: "cpl", key: "cpl" },
  ];

  for (const { roomType, key } of types) {
    const rules = roomRules[key];
    if (!rules?.length) continue;
    const match = rules.find((rule) => ruleTotal(rule) === passengerCount);
    if (match) return { roomType, rule: match };
  }

  return null;
}

function defaultRoomForPassengers(passengerCount: number): {
  roomType: RoomTypeApi;
  rule: RoomRule;
} {
  if (passengerCount <= 1) {
    return { roomType: "sgl", rule: { adt: 1, mnrA: 0, inf: 0 } };
  }
  if (passengerCount === 2) {
    return { roomType: "dbl", rule: { adt: 2, mnrA: 0, inf: 0 } };
  }
  if (passengerCount === 3) {
    return { roomType: "tpl", rule: { adt: 3, mnrA: 0, inf: 0 } };
  }
  return {
    roomType: "cpl",
    rule: { adt: passengerCount, mnrA: 0, inf: 0 },
  };
}

/** Habitación por defecto para cotización rápida según pasajeros del buscador. */
export function buildQuickQuoteHabitaciones(
  passengerCount: number,
  roomRules?: RoomRules
): HabitacionCotizacion[] {
  const count = Math.max(1, passengerCount);
  const match =
    findMatchingRoomRule(count, roomRules) ?? defaultRoomForPassengers(count);

  const roomLabelByType = {
    sgl: "sencilla",
    dbl: "doble",
    tpl: "triple",
    cpl: "cuadruple",
  } as const;

  return [
    {
      id: "quick-quote-room",
      roomLabel: roomLabelByType[match.roomType],
      roomType: match.roomType,
      adt: match.rule.adt ?? count,
      mnrA: match.rule.mnrA ?? 0,
      inf: match.rule.inf ?? 0,
      destinationId: 0,
      blockadeUid: "",
      costs: {
        grand_base: 0,
        grand_suplements: 0,
        grand_tax: 0,
        grand_total: 0,
      },
      total: 0,
    },
  ];
}

export type BuildCotizacionQuoteInput = {
  habitaciones: HabitacionCotizacion[];
  asistencias: AsistenciaSeleccionada[];
  opcionales: OpcionalSeleccionado[];
  skipInsurance: boolean;
  bloqueoUid: string;
  destinationId: number | string;
  mt: string;
  customer?: CotizacionQuoteCustomerContext;
};

export function buildCotizacionQuotePayload(
  input: BuildCotizacionQuoteInput
): CotizacionQuotePayload {
  const {
    habitaciones,
    asistencias,
    opcionales,
    skipInsurance,
    bloqueoUid,
    destinationId,
    mt,
    customer = {},
  } = input;

  const rateExchange = customer.rate_exchange ?? 19;
  const primaryAsistencia = asistencias[0];

  return {
    observations: null,
    rooms: habitaciones.map(buildRoomFromHabitacion),
    include_insurance: skipInsurance
      ? ""
      : (primaryAsistencia?.providerKey ?? ""),
    assistance_pax: skipInsurance
      ? []
      : buildAssistancePaxList(asistencias, rateExchange),
    tours: buildTours(opcionales),
    buid: bloqueoUid,
    bloqueo_uid: bloqueoUid,
    uuid: null,
    customer_model: customer.customer_model ?? "CustomerA",
    customer_mc: customer.customer_mc ?? "",
    customer_contact_mail: customer.customer_contact_mail ?? "",
    customer_fn: customer.customer_fn ?? "",
    quote_contact_way_id: customer.quote_contact_way_id ?? "4",
    destination_id: str(Number(destinationId)),
    mt: mt,
  };
}
