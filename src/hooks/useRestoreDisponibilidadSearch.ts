import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBusqueda } from "@/redux/slices/searchSlice";
import { isSearchReady } from "@/lib/searchValidation";
import { hasPersistedSearchSession } from "@/lib/searchFormState";
import { usePersistBootstrapped } from "@/hooks/usePersistBootstrapped";

export function useRestoreDisponibilidadSearch() {
  const dispatch = useAppDispatch();
  const bootstrapped = usePersistBootstrapped();
  const restoredRef = useRef(false);
  const { itemSearch, resultados, pagination, uuid, loading } = useAppSelector(
    (state) => state.search,
  );

  useEffect(() => {
    if (!bootstrapped || restoredRef.current) return;
    restoredRef.current = true;

    if (resultados.length > 0) return;

    const hasSession = hasPersistedSearchSession({
      pagination,
      uuid,
      resultadosCount: resultados.length,
    });

    if (!hasSession || !isSearchReady(itemSearch) || loading) {
      return;
    }

    void dispatch(fetchBusqueda({ ...itemSearch, page: 1 }));
  }, [
    bootstrapped,
    dispatch,
    itemSearch,
    loading,
    pagination,
    resultados.length,
    uuid,
  ]);
}
