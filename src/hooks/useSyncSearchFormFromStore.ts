import { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { usePersistBootstrapped } from "@/hooks/usePersistBootstrapped";
import {
  hasPersistedSearchSession,
  mapItemSearchToFormFields,
  type SearchFormFieldValues,
} from "@/lib/searchFormState";

type UseRestoredSearchFormFieldsOptions = {
  defaultDestinoId: string;
  defaultPasajerosId: string;
  getDefaultDateRange: () => Date[];
};

export function useRestoredSearchFormFields({
  defaultDestinoId,
  defaultPasajerosId,
  getDefaultDateRange,
}: UseRestoredSearchFormFieldsOptions): SearchFormFieldValues | null {
  const bootstrapped = usePersistBootstrapped();
  const { itemSearch, pagination, uuid, resultados } = useAppSelector(
    (state) => state.search,
  );

  return useMemo(() => {
    if (!bootstrapped) return null;

    const hasSession = hasPersistedSearchSession({
      pagination,
      uuid,
      resultadosCount: resultados.length,
    });

    if (!hasSession) return null;

    return mapItemSearchToFormFields(itemSearch, {
      destinoId: defaultDestinoId,
      pasajerosId: defaultPasajerosId,
      dateRange: getDefaultDateRange(),
    });
  }, [
    bootstrapped,
    defaultDestinoId,
    defaultPasajerosId,
    getDefaultDateRange,
    itemSearch,
    pagination,
    resultados.length,
    uuid,
  ]);
}
