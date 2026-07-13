"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import { fetchCotizar } from "@/redux/slices/cotizacionSlice";
import type { RecommendationCard } from "@/utils/recommendations";

const DEFAULT_COTIZAR_PASSENGERS = 2;

export function useStartCotizacionFromRecommendation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startCotizacion = useCallback(
    async (item: RecommendationCard) => {
      const clv = item.clv?.trim();
      if (!clv || loading) return;

      setLoading(true);
      try {
        await dispatch(
          fetchCotizar({
            clv,
            uuid: String(item.id ?? clv),
            passengers: DEFAULT_COTIZAR_PASSENGERS,
            startRange: "",
            endRange: "",
            nombre: item.title,
            dias: item.days,
            noches: item.nights,
            destinationName: item.location,
            precio: item.price,
            moneda: item.currency,
          }),
        ).unwrap();

        router.push(`/quote-wizard/${clv}`);
      } catch (error) {
        const message =
          typeof error === "string" && error.length > 0
            ? error
            : "No se pudo cargar la cotización";
        toast.error(message, { position: "top-center" });
      } finally {
        setLoading(false);
      }
    },
    [dispatch, loading, router],
  );

  return { startCotizacion, loading };
}
