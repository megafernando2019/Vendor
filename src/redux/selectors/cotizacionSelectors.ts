import type { RootState } from "../store";
import { sumPassengersFromHabitaciones } from "@/src/interfaces/opcionales-cotizacion";

export const selectHabitacionesCotizacion = (state: RootState) =>
  state.cotizacion?.habitacionesSeleccionadas ?? [];

export const selectHasHabitacionesForBlockade = (
  state: RootState,
  blockadeUid: string | undefined
) => {
  if (!blockadeUid) return false;
  return selectHabitacionesCotizacion(state).some(
    (h) => h.blockadeUid === blockadeUid
  );
};

export const selectCotizacionPassengerTotals = (state: RootState) =>
  sumPassengersFromHabitaciones(selectHabitacionesCotizacion(state));

export const selectAsistenciasCotizacion = (state: RootState) =>
  state.cotizacion?.asistenciasSeleccionadas ?? [];

export const selectOpcionalesCotizacion = (state: RootState) =>
  state.cotizacion?.opcionalesSeleccionados ?? [];

export const selectTotalHabitaciones = (state: RootState) =>
  selectHabitacionesCotizacion(state).reduce((sum, h) => sum + h.total, 0);

export const selectTotalAsistencias = (state: RootState) =>
  selectAsistenciasCotizacion(state).reduce((sum, a) => sum + a.price, 0);

export const selectTotalOpcionales = (state: RootState) =>
  selectOpcionalesCotizacion(state).reduce((sum, o) => sum + o.total, 0);

export const selectTotalCotizacion = (state: RootState) =>
  selectTotalHabitaciones(state) +
  selectTotalAsistencias(state) +
  selectTotalOpcionales(state);
