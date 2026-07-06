"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import BookingFormsSticky from "@/components/common/banner-form/BookingFormsSticky";
import FooterThree from "@/components/common/FooterThree";
import RecommendationTourCard from "@/components/homes/home-three/RecommendationTourCard";
import RecommendationTourCardSkeleton from "@/components/disponibilidad/RecommendationTourCardSkeleton";
import TourFilters from "@/components/disponibilidad/TourFilters";
import { useDisponibilidadInfiniteScroll } from "@/hooks/useDisponibilidadInfiniteScroll";
import { useRestoreDisponibilidadSearch } from "@/hooks/useRestoreDisponibilidadSearch";
import {
  computeDisponibilidadFilterLimits,
  createDefaultFilters,
  filterDisponibilidadResults,
  hasActiveDisponibilidadFilters,
  type DisponibilidadFilters,
} from "@/interfaces/disponibilidad-components";
import { formatSearchCriteriaSummary } from "@/lib/searchLabels";
import { hasPersistedSearchSession } from "@/lib/searchFormState";
import { SEARCH_PAGE_LIMIT } from "@/redux/slices/searchSlice";
import {
  mapResultDataToCards,
  type RecommendationCard,
} from "@/utils/recommendations";

const LOAD_MORE_SKELETON_COUNT = 4;

const DisponibilidadContent = () => {
  useRestoreDisponibilidadSearch();
  const { sentinelRef, hasMore, loadingMore } = useDisponibilidadInfiniteScroll();

  const { itemSearch, resultados, pagination, uuid, loading, error } =
    useAppSelector((state) => state.search);
  const viewMode = useAppSelector((state) => state.view.view);
  const isListView = viewMode === "lista";

  const resultadosKey = useMemo(
    () => resultados.map((item) => item.clv).join(","),
    [resultados],
  );

  const filterLimits = useMemo(
    () => computeDisponibilidadFilterLimits(resultados),
    [resultados],
  );

  const [filters, setFilters] = useState<DisponibilidadFilters>(() =>
    createDefaultFilters(filterLimits),
  );

  const prevResultadosKey = useRef("");

  useEffect(() => {
    if (resultadosKey === prevResultadosKey.current) return;
    prevResultadosKey.current = resultadosKey;
    setFilters(createDefaultFilters(filterLimits));
  }, [resultadosKey, filterLimits]);

  const filteredResultados = useMemo(
    () => filterDisponibilidadResults(resultados, filters),
    [resultados, filters],
  );

  const cards = useMemo(
    () => mapResultDataToCards(filteredResultados),
    [filteredResultados],
  );

  const filtersActive = hasActiveDisponibilidadFilters(filters, filterLimits);

  const skeletonCount =
    itemSearch.limit > 0 ? itemSearch.limit : SEARCH_PAGE_LIMIT;

  const hasSearchSession = hasPersistedSearchSession({
    pagination,
    uuid,
    resultadosCount: resultados.length,
  });

  const searchSummary = useMemo(
    () => formatSearchCriteriaSummary(itemSearch),
    [itemSearch],
  );

  const handleAddToWishlist = useCallback((_item: RecommendationCard) => {}, []);

  const handleResetFilters = useCallback(() => {
    setFilters(createDefaultFilters(filterLimits));
  }, [filterLimits]);

  const showInitialSkeleton = loading && cards.length === 0 && !filtersActive;
  const showEmptyState =
    !loading && !loadingMore && cards.length === 0 && !error;
  const showFilterEmptyState =
    showEmptyState && resultados.length > 0 && filtersActive;
  const totalResults = pagination?.total ?? 0;
  const loadedCount = resultados.length;
  const visibleCount = cards.length;

  const gridColumnClass = isListView
    ? "col-12"
    : "col-12 col-sm-6 col-lg-4 col-xl-3";

  return (
    <>
      <main>
        <div className="tg-booking-sticky-scope tg-disponibilidad-sticky-scope">
          <BookingFormsSticky />

          <section className="tg-disponibilidad-area pt-60 pb-120">
            <div className="container">
              <h1 className="mb-20">Disponibilidad</h1>

              {hasSearchSession && (
                <p className="disponibilidad-search-summary mb-20 text-muted">
                  {searchSummary}
                </p>
              )}

              {totalResults > 0 && (
                <p className="disponibilidad-results-total mb-20 text-muted">
                  {filtersActive ? (
                    <>
                      {visibleCount} resultado
                      {visibleCount === 1 ? "" : "s"} con filtros
                      {loadedCount < totalResults ? (
                        <span className="disponibilidad-results-total__loaded">
                          {" "}
                          · {loadedCount} de {totalResults} cargados
                        </span>
                      ) : (
                        <span className="disponibilidad-results-total__loaded">
                          {" "}
                          · de {totalResults} en total
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {totalResults} resultado
                      {totalResults === 1 ? "" : "s"}
                      {loadedCount > 0 && loadedCount < totalResults && (
                        <span className="disponibilidad-results-total__loaded">
                          {" "}
                          · mostrando {loadedCount}
                        </span>
                      )}
                    </>
                  )}
                </p>
              )}

              {loadedCount > 0 && (
                <TourFilters
                  limits={filterLimits}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={handleResetFilters}
                />
              )}

              {error && (
                <div className="alert alert-danger mb-20" role="alert">
                  {error}
                </div>
              )}

              {showInitialSkeleton && (
                <>
                  {totalResults === 0 && (
                    <p className="mb-30 text-muted" aria-live="polite">
                      Buscando disponibilidad...
                    </p>
                  )}

                  <div
                    className={`row g-4 disponibilidad-gallery${
                      isListView ? " disponibilidad-gallery--list" : ""
                    }`}
                    aria-busy="true"
                    aria-label="Cargando resultados"
                  >
                    {Array.from({ length: skeletonCount }, (_, index) => (
                      <div key={`skeleton-${index}`} className={gridColumnClass}>
                        <RecommendationTourCardSkeleton layout={isListView ? "list" : "grid"} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {showEmptyState && !showFilterEmptyState && (
                <p className="mb-20">
                  No hay resultados guardados. Realiza una búsqueda desde el
                  inicio.
                </p>
              )}

              {showFilterEmptyState && (
                <div className="alert alert-info mb-20" role="status">
                  Ningún tour coincide con los filtros seleccionados.{" "}
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 align-baseline"
                    onClick={handleResetFilters}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}

              {cards.length > 0 && (
                <div
                  className={`row g-4 disponibilidad-gallery${
                    isListView ? " disponibilidad-gallery--list" : ""
                  }`}
                >
                  {cards.map((item) => (
                    <div
                      key={item.id}
                      className={`${gridColumnClass} disponibilidad-gallery__item--loaded`}
                    >
                      <RecommendationTourCard
                        item={item}
                        onAddToWishlist={handleAddToWishlist}
                        linkMode="quote-wizard"
                        layout={isListView ? "list" : "grid"}
                      />
                    </div>
                  ))}

                  {loadingMore &&
                    Array.from({ length: LOAD_MORE_SKELETON_COUNT }, (_, index) => (
                      <div
                        key={`load-more-skeleton-${index}`}
                        className={gridColumnClass}
                      >
                        <RecommendationTourCardSkeleton
                          layout={isListView ? "list" : "grid"}
                        />
                      </div>
                    ))}
                </div>
              )}

              {resultados.length > 0 && hasMore && (
                <div
                  ref={sentinelRef}
                  className="disponibilidad-infinite-sentinel"
                  aria-hidden="true"
                />
              )}

              {resultados.length > 0 && loadingMore && (
                <p
                  className="disponibilidad-load-more-status text-muted text-center mt-4 mb-0"
                  aria-live="polite"
                >
                  Cargando más resultados...
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      <FooterThree />
    </>
  );
};

export default DisponibilidadContent;
