import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchBusqueda,
  hasMoreSearchPages,
} from "@/redux/slices/searchSlice";

const LOAD_MORE_ROOT_MARGIN = "240px";

export function useDisponibilidadInfiniteScroll() {
  const dispatch = useAppDispatch();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { itemSearch, pagination, loading, loadingMore } = useAppSelector(
    (state) => state.search,
  );

  const hasMore = hasMoreSearchPages(pagination);

  const loadNextPage = useCallback(() => {
    if (!pagination || loading || loadingMore || !hasMore) {
      return;
    }

    void dispatch(
      fetchBusqueda({
        ...itemSearch,
        page: pagination.page + 1,
        limit: itemSearch.limit,
      }),
    );
  }, [dispatch, hasMore, itemSearch, loading, loadingMore, pagination]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadNextPage();
        }
      },
      {
        root: null,
        rootMargin: LOAD_MORE_ROOT_MARGIN,
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadNextPage]);

  return {
    sentinelRef,
    hasMore,
    loadingMore,
  };
}
