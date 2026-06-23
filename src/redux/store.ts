import { configureStore, combineReducers, type Reducer } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  createTransform,
  type PersistConfig,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import persistStorage from "./persistStorage";
import searchReducer from "./slices/searchSlice";
import viewReducer from "./slices/viewSlice";
import cotizacionReducer from "./slices/cotizacionSlice";
import wishlistReducer from "./features/wishlistSlice";
import cartReducer from "./features/cartSlice";
import productReducer from "./features/productSlice";

type PersistedSearchSlice = {
  loading?: boolean;
  error?: string | null;
  [key: string]: unknown;
};

const searchPersistTransform = createTransform<PersistedSearchSlice, PersistedSearchSlice>(
  (inboundState) => ({ ...inboundState, loading: false, error: null }),
  (outboundState) => ({ ...outboundState, loading: false, error: null }),
  { whitelist: ["search"] }
);

const rootReducer = combineReducers({
  search: searchReducer,
  view: viewReducer,
  cotizacion: cotizacionReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  products: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: "app",
  storage: persistStorage,
  whitelist: ["search", "view", "cotizacion", "wishlist", "cart", "products"],
  transforms: [searchPersistTransform],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer as Reducer<RootState>
) as unknown as typeof rootReducer;
 
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
 
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;