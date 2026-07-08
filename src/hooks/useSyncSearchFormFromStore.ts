import { useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { usePersistBootstrapped } from "@/hooks/usePersistBootstrapped";
import {
  hasPersistedSearchSession,
  mapItemSearchToFormFields,
} from "@/lib/searchFormState";

type UseSyncSearchFormFromStoreOptions = {
  defaultDestinoId: string;
  defaultPasajerosId: string;
  getDefaultDateRange: () => Date[];
  setSelectedDestinoId: (value: string) => void;
  setSelectedPasajerosId: (value: string) => void;
  setDateRange: (value: Date[]) => void;
  setKeyword: (value: string) => void;
};

export function useSyncSearchFormFromStore({
  defaultDestinoId,
  defaultPasajerosId,
  getDefaultDateRange,
  setSelectedDestinoId,
  setSelectedPasajerosId,
  setDateRange,
  setKeyword,
}: UseSyncSearchFormFromStoreOptions) {
  const bootstrapped = usePersistBootstrapped();
  const syncedRef = useRef(false);
  const { itemSearch, pagination, uuid, resultados } = useAppSelector(
    (state) => state.search,
  );

  useEffect(() => {
    if (!bootstrapped || syncedRef.current) return;
    syncedRef.current = true;

    const hasSession = hasPersistedSearchSession({
      pagination,
      uuid,
      resultadosCount: resultados.length,
    });

    if (!hasSession) return;

    const fields = mapItemSearchToFormFields(itemSearch, {
      destinoId: defaultDestinoId,
      pasajerosId: defaultPasajerosId,
      dateRange: getDefaultDateRange(),
    });

    setSelectedDestinoId(fields.destinoId);
    setSelectedPasajerosId(fields.pasajerosId);
    setKeyword(fields.keyword);

    if (fields.dateRange) {
      setDateRange(fields.dateRange);
    }
  }, [
    bootstrapped,
    defaultDestinoId,
    defaultPasajerosId,
    getDefaultDateRange,
    itemSearch,
    pagination,
    resultados.length,
    setDateRange,
    setKeyword,
    setSelectedDestinoId,
    setSelectedPasajerosId,
    uuid,
  ]);
}
