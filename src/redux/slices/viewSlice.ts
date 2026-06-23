import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ViewType = "cards" | "lista" | "cotizacion" | "detalle" | "resumen";

type ViewState = {
  view: ViewType;
};

const initialState: ViewState = {
  view: "cards",
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    changeView(state, action: PayloadAction<ViewType>) {
      state.view = action.payload;
    },
    resetView(state) {
      state.view = "cards";
    },
  },
});

export const { changeView, resetView } = viewSlice.actions;
export default viewSlice.reducer;