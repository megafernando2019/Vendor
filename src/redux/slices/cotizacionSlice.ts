import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { TravelProgram, ProgramInfo } from "@/interfaces/disponibilidad";
import { normalizePassengers } from "@/lib/searchValidation";
import type { HabitacionCotizacion } from "@/interfaces/cotizacion-components";
import type { AsistenciaSeleccionada } from "@/interfaces/seguros-cotizacion";
import type { OpcionalSeleccionado } from "@/interfaces/opcionales-cotizacion";

export const COTIZACION_HABITACIONES_KEY = "cotizacion_habitaciones";
export const COTIZACION_ASISTENCIAS_KEY = "cotizacion_asistencias";
export const COTIZACION_OPCIONALES_KEY = "cotizacion_opcionales";

type CotizacionState = {
  bloqueo: TravelProgram | null;
  programInfo: ProgramInfo | null;
  habitacionesSeleccionadas: HabitacionCotizacion[];
  asistenciasSeleccionadas: AsistenciaSeleccionada[];
  opcionalesSeleccionados: OpcionalSeleccionado[];
  loading: boolean;
  error: string | null;
};

function ensureHabitaciones(state: CotizacionState) {
  if (!Array.isArray(state.habitacionesSeleccionadas)) {
    state.habitacionesSeleccionadas = [];
  }
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
  localStorage.setItem(COTIZACION_HABITACIONES_KEY, JSON.stringify(habitaciones));
}

function syncAsistenciasLocalStorage(asistencias: AsistenciaSeleccionada[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COTIZACION_ASISTENCIAS_KEY, JSON.stringify(asistencias));
}

function syncOpcionalesLocalStorage(opcionales: OpcionalSeleccionado[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COTIZACION_OPCIONALES_KEY, JSON.stringify(opcionales));
}

const initialState: CotizacionState = {
  bloqueo: null,
  programInfo: null,
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

      // ✅ Nuevo shape: data.data.data[0]
      const raw = data?.data?.data?.[0];

      if (!raw) {
        return rejectWithValue("No se encontraron datos del programa");
      }

      // ✅ Remapeamos al shape que espera el componente
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

const cotizacionSlice = createSlice({
  name: "cotizacion",
  initialState,
  reducers: {
    resetCotizacion(state) {
      state.bloqueo = null;
      state.programInfo = null;
      state.habitacionesSeleccionadas = [];
      state.asistenciasSeleccionadas = [];
      state.opcionalesSeleccionados = [];
      state.error = null;
      state.loading = false;
      syncHabitacionesLocalStorage([]);
      syncAsistenciasLocalStorage([]);
      syncOpcionalesLocalStorage([]);
    },
    addHabitacion(state, action: PayloadAction<HabitacionCotizacion>) {
      ensureHabitaciones(state);
      state.habitacionesSeleccionadas.push(action.payload);
      syncHabitacionesLocalStorage(state.habitacionesSeleccionadas);
    },
    removeHabitacion(state, action: PayloadAction<string>) {
      ensureHabitaciones(state);
      state.habitacionesSeleccionadas = state.habitacionesSeleccionadas.filter(
        (h) => h.id !== action.payload
      );
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
      });
  },
});

export const {
  resetCotizacion,
  addHabitacion,
  removeHabitacion,
  clearHabitaciones,
  addAsistencia,
  removeAsistencia,
  clearAsistencias,
  addOpcional,
  removeOpcional,
  clearOpcionales,
} = cotizacionSlice.actions;
export default cotizacionSlice.reducer;