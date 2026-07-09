import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { TravelProgram, ProgramInfo } from "@/interfaces/disponibilidad";
import { normalizePassengers } from "@/lib/searchValidation";
import { DEFAULT_DESTINATION } from "@/interfaces/search";
import type {
  CotizacionRulesData,
  CotizacionSelectedDeparture,
  HabitacionCotizacion,
  HabitacionCosts,
  RoomRule,
  RoomTabLabel,
  RoomTypeApi,
} from "@/interfaces/cotizacion-components";
import {
  getHabitacionQuantity,
  habitacionConfigKey,
} from "@/interfaces/cotizacion-components";
import type { AsistenciaSeleccionada } from "@/interfaces/seguros-cotizacion";
import type { OpcionalSeleccionado } from "@/interfaces/opcionales-cotizacion";
import {
  departureDateForRulesApi,
  parseRoomCostsResponse,
  parseRulesCotizacionResponse,
} from "@/utils/cotizacionRules";

export const COTIZACION_HABITACIONES_KEY = "cotizacion_habitaciones:v1";
export const COTIZACION_ASISTENCIAS_KEY = "cotizacion_asistencias:v1";
export const COTIZACION_OPCIONALES_KEY = "cotizacion_opcionales:v1";

const LEGACY_COTIZACION_HABITACIONES_KEY = "cotizacion_habitaciones";
const LEGACY_COTIZACION_ASISTENCIAS_KEY = "cotizacion_asistencias";
const LEGACY_COTIZACION_OPCIONALES_KEY = "cotizacion_opcionales";

type CotizacionState = {
  bloqueo: TravelProgram | null;
  programInfo: ProgramInfo | null;
  selectedDeparture: CotizacionSelectedDeparture | null;
  rules: CotizacionRulesData | null;
  rulesLoading: boolean;
  rulesError: string | null;
  roomCostsPreview: HabitacionCosts | null;
  roomCostsLoading: boolean;
  roomCostsError: string | null;
  habitacionesSeleccionadas: HabitacionCotizacion[];
  asistenciasSeleccionadas: AsistenciaSeleccionada[];
  opcionalesSeleccionados: OpcionalSeleccionado[];
  loading: boolean;
  error: string | null;
};

function ensureHabitaciones(state: CotizacionState) {
  if (!Array.isArray(state.habitacionesSeleccionadas)) {
    state.habitacionesSeleccionadas = [];
    return;
  }
  state.habitacionesSeleccionadas = state.habitacionesSeleccionadas.map((room) => ({
    ...room,
    quantity: getHabitacionQuantity(room),
  }));
}

function ensureAsistencias(state: CotizacionState) {
  if (!Array.isArray(state.asistenciasSeleccionadas)) {
    state.asistenciasSeleccionadas = [];
  }
}

function ensureOpcionales(state: CotizacionState) {
  if (!Array.isArray(state.opcionalesSeleccionados)) {
    state.opcionalesSeleccionados = [];
    return;
  }
  state.opcionalesSeleccionados = state.opcionalesSeleccionados.map((item) => {
    if (Array.isArray(item.lineas) && item.lineas.length > 0) return item;
    const legacy = item as OpcionalSeleccionado & {
      quantity?: number;
      unitPrice?: number;
    };
    if (legacy.quantity != null && legacy.unitPrice != null) {
      return {
        ...item,
        lineas: [
          {
            code: "adt",
            label: "Adulto",
            quantity: legacy.quantity,
            unitPrice: legacy.unitPrice,
            currency: legacy.currency ?? "USD",
            subtotal: legacy.total,
          },
        ],
      };
    }
    return { ...item, lineas: item.lineas ?? [] };
  });
}

function syncHabitacionesLocalStorage(habitaciones: HabitacionCotizacion[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      COTIZACION_HABITACIONES_KEY,
      JSON.stringify(habitaciones),
    );
    localStorage.removeItem(LEGACY_COTIZACION_HABITACIONES_KEY);
  } catch {
    // Storage may be unavailable or quota exceeded.
  }
}

function syncAsistenciasLocalStorage(asistencias: AsistenciaSeleccionada[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      COTIZACION_ASISTENCIAS_KEY,
      JSON.stringify(asistencias),
    );
    localStorage.removeItem(LEGACY_COTIZACION_ASISTENCIAS_KEY);
  } catch {
    // Storage may be unavailable or quota exceeded.
  }
}

function syncOpcionalesLocalStorage(opcionales: OpcionalSeleccionado[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      COTIZACION_OPCIONALES_KEY,
      JSON.stringify(opcionales),
    );
    localStorage.removeItem(LEGACY_COTIZACION_OPCIONALES_KEY);
  } catch {
    // Storage may be unavailable or quota exceeded.
  }
}

const initialState: CotizacionState = {
  bloqueo: null,
  programInfo: null,
  selectedDeparture: null,
  rules: null,
  rulesLoading: false,
  rulesError: null,
  roomCostsPreview: null,
  roomCostsLoading: false,
  roomCostsError: null,
  habitacionesSeleccionadas: [],
  asistenciasSeleccionadas: [],
  opcionalesSeleccionados: [],
  loading: false,
  error: null,
};

type FetchCotizarArgs = {
  clv: string;
  uuid: string;
  passengers: number;
  startRange: string;
  endRange: string;
  nombre: string;
  dias: number;
  noches: number;
  destinationName: string;
  precio: number;
  moneda: string;
  departureAirport?: { iata: string; region_name: string };
  tours?: any[];
};

export const fetchCotizar = createAsyncThunk(
  "cotizacion/fetchCotizar",
  async (args: FetchCotizarArgs, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/getcotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clv: args.clv,
          uuid: args.uuid,
          passengers: args.passengers,
          startRange: args.startRange,
          endRange: args.endRange,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Ha ocurrido un error");
      }
      const raw = data?.data?.data?.[0];

      if (!raw) {
        return rejectWithValue("No se encontraron datos del programa");
      }

  
      const bloqueo: TravelProgram = {
        departures_data: raw.departures ?? [],
        program_data: {
          additional: raw.additional ?? {},
        },
      };

      const programInfo: ProgramInfo = {
        clv: args.clv,
        name: args.nombre,
        days: args.dias,
        nights: args.noches,
        destination_name: args.destinationName,
        total_from: args.precio,
        currency: args.moneda,
        passengers: normalizePassengers(args.passengers),
        departure_airport: args.departureAirport,
        tours: args.tours ?? [],
      };

      return { bloqueo, programInfo };
    } catch (err) {
      return rejectWithValue("Error de conexión con el servidor");
    }
  }
);

export const fetchRulesCotizacion = createAsyncThunk(
  "cotizacion/fetchRulesCotizacion",
  async (
    args: {
      mt: string;
      uid: string;
      departuredAt: string;
      currency: string;
      price: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const date = departureDateForRulesApi(args.departuredAt);
      const res = await fetch(
        `/api/getRulesCotizacion/${encodeURIComponent(args.mt)}/${encodeURIComponent(args.uid)}/${encodeURIComponent(date)}`,
        { credentials: "include" },
      );
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        data?: unknown;
      };

      if (!res.ok || data.success === false) {
        return rejectWithValue(
          data.message ?? "No se pudieron cargar las reglas de habitación",
        );
      }

      const rules = parseRulesCotizacionResponse(data.data, args.currency);
      if (!rules) {
        return rejectWithValue("No se encontraron reglas para esta salida");
      }

      const selectedDeparture: CotizacionSelectedDeparture = {
        mt: args.mt,
        blockadeUid: args.uid,
        departuredAt: args.departuredAt,
        currency: args.currency,
        price: args.price,
      };

      return { rules, selectedDeparture };
    } catch {
      return rejectWithValue("Error de conexión al consultar reglas");
    }
  },
);

export const fetchRoomCosts = createAsyncThunk(
  "cotizacion/fetchRoomCosts",
  async (
    args: {
      destinationId: number;
      passengers: RoomRule;
      roomType: RoomTypeApi;
      blockadeUid: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch("/api/costsRooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          destination_id: args.destinationId,
          passengers: args.passengers,
          room_type: args.roomType,
          blockade_uid: args.blockadeUid,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        data?: unknown;
      };

      if (!res.ok || data.success === false) {
        return rejectWithValue(
          data.message ?? "No se pudieron calcular los costos",
        );
      }

      const costs = parseRoomCostsResponse(data.data);
      if (!costs) {
        return rejectWithValue("Respuesta de costos inválida");
      }

      return costs;
    } catch {
      return rejectWithValue("Error de conexión al consultar costos");
    }
  },
);

const cotizacionSlice = createSlice({
  name: "cotizacion",
  initialState,
  reducers: {
    resetCotizacion(state) {
      state.bloqueo = null;
      state.programInfo = null;
      state.selectedDeparture = null;
      state.rules = null;
      state.rulesLoading = false;
      state.rulesError = null;
      state.roomCostsPreview = null;
      state.roomCostsLoading = false;
      state.roomCostsError = null;
      state.habitacionesSeleccionadas = [];
      state.asistenciasSeleccionadas = [];
      state.opcionalesSeleccionados = [];
      state.error = null;
      state.loading = false;
      syncHabitacionesLocalStorage([]);
      syncAsistenciasLocalStorage([]);
      syncOpcionalesLocalStorage([]);
    },
    clearRulesCotizacion(state) {
      state.selectedDeparture = null;
      state.rules = null;
      state.rulesLoading = false;
      state.rulesError = null;
      state.roomCostsPreview = null;
      state.roomCostsLoading = false;
      state.roomCostsError = null;
    },
    setProgramInfo(state, action: PayloadAction<ProgramInfo>) {
      state.programInfo = action.payload;
    },
    addHabitacion(state, action: PayloadAction<HabitacionCotizacion>) {
      ensureHabitaciones(state);
      const incoming: HabitacionCotizacion = {
        ...action.payload,
        quantity: action.payload.quantity ?? 1,
      };
      const incomingKey = habitacionConfigKey(incoming);
      const existing = state.habitacionesSeleccionadas.find(
        (room) => habitacionConfigKey(room) === incomingKey,
      );

      if (existing) {
        existing.quantity = getHabitacionQuantity(existing) + incoming.quantity!;
        existing.costs = incoming.costs;
        existing.total = incoming.total;
        existing.roomLabel = incoming.roomLabel;
      } else {
        state.habitacionesSeleccionadas.push(incoming);
      }

      syncHabitacionesLocalStorage(state.habitacionesSeleccionadas);
    },
    removeHabitacion(state, action: PayloadAction<string>) {
      ensureHabitaciones(state);
      const room = state.habitacionesSeleccionadas.find(
        (item) => item.id === action.payload,
      );
      if (!room) return;

      if (getHabitacionQuantity(room) > 1) {
        room.quantity = getHabitacionQuantity(room) - 1;
      } else {
        state.habitacionesSeleccionadas = state.habitacionesSeleccionadas.filter(
          (h) => h.id !== action.payload,
        );
      }

      syncHabitacionesLocalStorage(state.habitacionesSeleccionadas);
    },
    updateHabitacion(state, action: PayloadAction<HabitacionCotizacion>) {
      ensureHabitaciones(state);
      const incoming: HabitacionCotizacion = {
        ...action.payload,
        quantity: getHabitacionQuantity(action.payload),
      };
      const index = state.habitacionesSeleccionadas.findIndex(
        (h) => h.id === incoming.id,
      );
      if (index === -1) return;

      const incomingKey = habitacionConfigKey(incoming);
      const duplicate = state.habitacionesSeleccionadas.find(
        (room, roomIndex) =>
          roomIndex !== index && habitacionConfigKey(room) === incomingKey,
      );

      if (duplicate) {
        duplicate.quantity =
          getHabitacionQuantity(duplicate) + getHabitacionQuantity(incoming);
        duplicate.costs = incoming.costs;
        duplicate.total = incoming.total;
        duplicate.roomLabel = incoming.roomLabel;
        state.habitacionesSeleccionadas.splice(index, 1);
      } else {
        state.habitacionesSeleccionadas[index] = incoming;
      }

      syncHabitacionesLocalStorage(state.habitacionesSeleccionadas);
    },
    clearHabitaciones(state) {
      state.habitacionesSeleccionadas = [];
      syncHabitacionesLocalStorage([]);
    },
    addAsistencia(state, action: PayloadAction<AsistenciaSeleccionada>) {
      ensureAsistencias(state);
      state.asistenciasSeleccionadas.push(action.payload);
      syncAsistenciasLocalStorage(state.asistenciasSeleccionadas);
    },
    removeAsistencia(state, action: PayloadAction<string>) {
      ensureAsistencias(state);
      state.asistenciasSeleccionadas = state.asistenciasSeleccionadas.filter(
        (a) => a.id !== action.payload
      );
      syncAsistenciasLocalStorage(state.asistenciasSeleccionadas);
    },
    clearAsistencias(state) {
      state.asistenciasSeleccionadas = [];
      syncAsistenciasLocalStorage([]);
    },
    addOpcional(state, action: PayloadAction<OpcionalSeleccionado>) {
      ensureOpcionales(state);
      state.opcionalesSeleccionados.push(action.payload);
      syncOpcionalesLocalStorage(state.opcionalesSeleccionados);
    },
    removeOpcional(state, action: PayloadAction<string>) {
      ensureOpcionales(state);
      state.opcionalesSeleccionados = state.opcionalesSeleccionados.filter(
        (o) => o.id !== action.payload
      );
      syncOpcionalesLocalStorage(state.opcionalesSeleccionados);
    },
    clearOpcionales(state) {
      state.opcionalesSeleccionados = [];
      syncOpcionalesLocalStorage([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(REHYDRATE, (state) => {
        ensureHabitaciones(state);
        ensureAsistencias(state);
        ensureOpcionales(state);
      })
      .addCase(fetchCotizar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCotizar.fulfilled, (state, action) => {
        state.loading = false;
        state.bloqueo = action.payload.bloqueo;
        state.programInfo = action.payload.programInfo;
        state.habitacionesSeleccionadas = [];
        state.asistenciasSeleccionadas = [];
        state.opcionalesSeleccionados = [];
        syncHabitacionesLocalStorage([]);
        syncAsistenciasLocalStorage([]);
        syncOpcionalesLocalStorage([]);
      })
      .addCase(fetchCotizar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRulesCotizacion.pending, (state, action) => {
        state.rulesLoading = true;
        state.rulesError = null;
        state.roomCostsPreview = null;
        state.roomCostsError = null;
        state.selectedDeparture = {
          mt: action.meta.arg.mt,
          blockadeUid: action.meta.arg.uid,
          departuredAt: action.meta.arg.departuredAt,
          currency: action.meta.arg.currency,
          price: action.meta.arg.price,
        };
      })
      .addCase(fetchRulesCotizacion.fulfilled, (state, action) => {
        state.rulesLoading = false;
        state.rules = action.payload.rules;
        state.selectedDeparture = action.payload.selectedDeparture;
        state.rulesError = null;
        state.roomCostsPreview = null;
      })
      .addCase(fetchRulesCotizacion.rejected, (state, action) => {
        state.rulesLoading = false;
        state.rulesError = action.payload as string;
        state.rules = null;
        state.roomCostsPreview = null;
      })
      .addCase(fetchRoomCosts.pending, (state) => {
        state.roomCostsLoading = true;
        state.roomCostsError = null;
      })
      .addCase(fetchRoomCosts.fulfilled, (state, action) => {
        state.roomCostsLoading = false;
        state.roomCostsPreview = action.payload;
      })
      .addCase(fetchRoomCosts.rejected, (state, action) => {
        state.roomCostsLoading = false;
        state.roomCostsError = action.payload as string;
        state.roomCostsPreview = null;
      });
  },
});

export const {
  resetCotizacion,
  clearRulesCotizacion,
  setProgramInfo,
  addHabitacion,
  removeHabitacion,
  updateHabitacion,
  clearHabitaciones,
  addAsistencia,
  removeAsistencia,
  clearAsistencias,
  addOpcional,
  removeOpcional,
  clearOpcionales,
} = cotizacionSlice.actions;
export default cotizacionSlice.reducer;