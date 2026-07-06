import { useSyncExternalStore } from "react";
import type { RecommendationsData } from "@/interfaces/disponibilidad";
import { normalizeRecommendationsData } from "@/utils/recommendations";

type RecommendationsQueryState =
  | { status: "loading" }
  | { status: "success"; data: RecommendationsData }
  | { status: "error"; error: string };

let queryState: RecommendationsQueryState = { status: "loading" };
let fetchPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

async function loadRecommendations() {
  try {
    const res = await fetch("/api/getRecommendations");
    const json = await res.json();

    if (!res.ok || !json.success) {
      queryState = {
        status: "error",
        error: json.message ?? "No se pudieron cargar las recomendaciones",
      };
      return;
    }

    queryState = {
      status: "success",
      data: normalizeRecommendationsData(json.data ?? json),
    };
  } catch {
    queryState = {
      status: "error",
      error: "Error al consultar recomendaciones",
    };
  }
}

function ensureFetchStarted() {
  if (fetchPromise) return;
  fetchPromise = loadRecommendations().finally(notifyListeners);
}

function subscribe(listener: () => void) {
  ensureFetchStarted();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): RecommendationsQueryState {
  return queryState;
}

function getServerSnapshot(): RecommendationsQueryState {
  return { status: "loading" };
}

/** Shared, deduplicated client fetch for recommendation carousels. */
export function useRecommendationsQuery() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
