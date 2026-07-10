import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import type { RehydrateAction } from "redux-persist";
import type { ResultData } from "@/interfaces/disponibilidad";
import { prepareItemSearch, applySearchDefaults } from "@/lib/searchValidation";
import { DEFAULT_PASSENGERS } from "@/interfaces/search";
import {
  normalizeBusquedaPayload,
  type BusquedaPromotionSummary,
} from "@/utils/normalizeBusqueda";

export const SEARCH_PAGE_LIMIT = 12;

export type ItemSearch = {
  destination: number;
  passengers: number;
  startRange: string;
  endRange: string;
  search: string;
  page: number;
  limit: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  from: number;
  to: number;
};

type SearchState = {
  itemSearch: ItemSearch;
  resultados: ResultData[];
  promotionsSummary: BusquedaPromotionSummary[];
  pagination: PaginationMeta | null;
  uuid: string | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
};

type RehydratedSearchPayload = {
  search?: SearchState;
};

export type BusquedaSuccessPayload = {
  data: ResultData[];
  promotionsSummary: BusquedaPromotionSummary[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  from: number;
  to: number;
};

const initialState: SearchState = {
  itemSearch: applySearchDefaults({
    destination: 0,
    passengers: DEFAULT_PASSENGERS,
    startRange: "",
    endRange: "",
    search: "",
    page: 1,
    limit: SEARCH_PAGE_LIMIT,
  }),
  resultados: [],
  promotionsSummary: [],
  pagination: null,
  uuid: null,
  loading: false,
  loadingMore: false,
  error: null,
};

export const fetchBusqueda = createAsyncThunk<
  BusquedaSuccessPayload,
  ItemSearch,
  { rejectValue: string }
>(
  "search/fetchBusqueda",
  async (itemSearch, { rejectWithValue }) => {
  const prepared = prepareItemSearch(itemSearch);
  if (!prepared.ok) {
    return rejectWithValue(prepared.error);
  }

  const params = prepared.params;

  try {
    const res = await fetch("/api/busqueda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });
    const data = (await res.json()) as {
      success?: boolean;
      message?: string;
      data?: unknown;
      page: number;
      limit: number;
      total: number;
      total_pages: number;
      from: number;
      to: number;
    };

    if (!res.ok || data.success === false) {
      const msg =
        typeof data.message === "string" && data.message.length > 0
          ? data.message
          : `Error ${res.status}`;
      return rejectWithValue(msg);
    }

    const { documents, promotions_summary } = normalizeBusquedaPayload(
      data.data,
    );

    return {
      data: documents,
      promotionsSummary: promotions_summary,
      page: data.page ?? 0,
      limit: data.limit ?? 0,
      total: data.total ?? 0,
      total_pages: data.total_pages ?? 0,
      from: data.from ?? 0,
      to: data.to ?? 0
    };
  } catch {
    return rejectWithValue("Error de conexión con el servidor");
  }
},
{
  condition: (itemSearch, { getState }) => {
    const prepared = prepareItemSearch(itemSearch);
    if (!prepared.ok) return false;

    const searchState = (getState() as { search: SearchState }).search;
    if (searchState.loading || searchState.loadingMore) return false;

    if (itemSearch.page > 1) {
      const { pagination } = searchState;
      if (!pagination) return false;
      if (pagination.page >= pagination.total_pages) return false;
    }

    return true;
  },
}
);

export function hasMoreSearchPages(pagination: PaginationMeta | null): boolean {
  if (!pagination) return false;
  return pagination.page < pagination.total_pages;
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setItemSearch(state, action: PayloadAction<Partial<ItemSearch>>) {
      state.itemSearch = applySearchDefaults({
        ...state.itemSearch,
        ...action.payload,
      });
    },
    resetSearch(state) {
      state.itemSearch = initialState.itemSearch;
      state.resultados = [];
      state.promotionsSummary = [];
      state.pagination = null;
      state.uuid = null;
      state.error = null;
      state.loading = false;
      state.loadingMore = false;
    },
    clearSearchLoading(state) {
      state.loading = false;
      state.loadingMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusqueda.pending, (state, action) => {
        if (action.meta.arg.page > 1) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchBusqueda.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        const requestedPage = action.meta.arg.page;
        if (requestedPage <= 1) {
          state.resultados = action.payload.data;
          state.promotionsSummary = action.payload.promotionsSummary;
        } else {
          state.resultados = [...state.resultados, ...action.payload.data];
        }
        state.itemSearch.page = Number(action.payload.page) || 1;
        state.pagination = {
          page: Number(action.payload.page) || 1,
          limit: Number(action.payload.limit) || SEARCH_PAGE_LIMIT,
          total: Number(action.payload.total) || 0,
          total_pages: Number(action.payload.total_pages) || 0,
          from: Number(action.payload.from) || 0,
          to: Number(action.payload.to) || 0,
        };
        const first = action.payload.data[0];
        const firstUuid = first?.uuid || first?.clv;
        if (firstUuid) {
          state.uuid = firstUuid;
        }
      })
      .addCase(fetchBusqueda.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        const requestedPage = action.meta.arg.page;
        if (requestedPage > 1 && state.pagination) {
          state.pagination.total_pages = state.pagination.page;
        }
        state.error = action.payload ?? "Error desconocido";
      })
      .addMatcher(
        (action): action is RehydrateAction => action.type === REHYDRATE,
        (state, action) => {
          const persistedSearch = (
            action.payload as RehydratedSearchPayload | undefined
          )?.search;
          if (!persistedSearch) return;

          state.loading = false;
          state.loadingMore = false;
          state.error = null;

          if (persistedSearch.itemSearch) {
            state.itemSearch = applySearchDefaults(persistedSearch.itemSearch);
          }
          if (Array.isArray(persistedSearch.resultados)) {
            state.resultados = persistedSearch.resultados;
          }
          if (Array.isArray(persistedSearch.promotionsSummary)) {
            state.promotionsSummary = persistedSearch.promotionsSummary;
          }
          if (persistedSearch.pagination !== undefined) {
            state.pagination = persistedSearch.pagination;
          }
          if (persistedSearch.uuid !== undefined) {
            state.uuid = persistedSearch.uuid;
          }
        },
      );
  },
});

export const { setItemSearch, resetSearch, clearSearchLoading } = searchSlice.actions;
export default searchSlice.reducer;
