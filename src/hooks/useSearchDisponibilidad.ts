"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import { fetchBusqueda, setItemSearch } from "@/redux/slices/searchSlice";
import { resetView } from "@/redux/slices/viewSlice";
import {
  buildBusquedaPayload,
  DEFAULT_DESTINO_ID,
  DEFAULT_PASAJEROS_ID,
  getDefaultDateRange,
} from "@/components/common/banner-form/searchFormItemsUtils";

export function useSearchDisponibilidad() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searching, setSearching] = useState(false);

  const searchByKeyword = useCallback(
    async (keyword: string) => {
      const trimmed = keyword.trim();
      if (!trimmed || searching) return;

      const payload = buildBusquedaPayload(
        DEFAULT_DESTINO_ID,
        DEFAULT_PASAJEROS_ID,
        getDefaultDateRange(),
        trimmed,
      );

      setSearching(true);
      try {
        dispatch(setItemSearch(payload));
        await dispatch(fetchBusqueda(payload)).unwrap();
        dispatch(resetView());
        router.push("/disponibilidad");
      } catch (error) {
        const message =
          typeof error === "string" && error.length > 0
            ? error
            : "No se pudo completar la búsqueda";
        toast.error(message, { position: "top-center" });
      } finally {
        setSearching(false);
      }
    },
    [dispatch, router, searching],
  );

  return { searchByKeyword, searching };
}
