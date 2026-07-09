"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import BookingFormsSticky from "@/components/common/banner-form/BookingFormsSticky";
import FooterThree from "@/components/common/FooterThree";
import RecommendationTourCard from "@/components/homes/home-three/RecommendationTourCard";
import RecommendationTourCardSkeleton from "@/components/disponibilidad/RecommendationTourCardSkeleton";
import TourFilters from "@/components/disponibilidad/TourFilters";
import PromotionFilters from "@/components/disponibilidad/PromotionFilters";
import DisponibilidadViewSwitcher from "@/components/disponibilidad/DisponibilidadViewSwitcher";
import { useDisponibilidadInfiniteScroll } from "@/hooks/useDisponibilidadInfiniteScroll";
import { useRestoreDisponibilidadSearch } from "@/hooks/useRestoreDisponibilidadSearch";
import useWow from "@/hooks/useWow";
import {
  computeDisponibilidadFilterLimits,
  computeDisponibilidadPromotionOptions,
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
  useWow();
  useRestoreDisponibilidadSearch();
  const { sentinelRef, hasMore, loadingMore } =
    useDisponibilidadInfiniteScroll();

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

  const promotionOptions = useMemo(
    () => computeDisponibilidadPromotionOptions(resultados),
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

  const handleAddToWishlist = useCallback(
    (_item: RecommendationCard) => {},
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(createDefaultFilters(filterLimits));
  }, [filterLimits]);

  const handlePromotionChange = useCallback((promotions: string[]) => {
    setFilters((current) => ({ ...current, promotions }));
  }, []);

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
    : "col-12 col-sm-6 col-md-4";

  return (
    <>
      <main>
        <div className="tg-booking-sticky-scope tg-disponibilidad-sticky-scope">
          <BookingFormsSticky />
          <div className="container py-4 py-md-5">
            <div className="row g-3 disponibilidad-layout-row">
            <div className="col-md-3">
              <div className="card border-0 shadow h-100 disponibilidad-sidebar-panel">
                <div className="card-body p-3 p-md-4">
                  <div className="tg-location-section-title text-left mb-30">
                    <h5
                      className="d-block mb-15 wow fadeInUp text-hortencia text-purple text-morado-custom"
                      data-wow-delay=".4s"
                      data-wow-duration=".9s"
                    >
                      Resultados para tu búsqueda
                    </h5>
                    <h2
                      className="mb-15 text-capitalize wow fadeInUp"
                      data-wow-delay=".5s"
                      data-wow-duration=".9s"
                    >
                      Búsqueda
                    </h2>
                  </div>
                  <h5>Filtros</h5>
                  {loadedCount > 0 && (
                    <TourFilters
                      limits={filterLimits}
                      filters={filters}
                      onFiltersChange={setFilters}
                      onReset={handleResetFilters}
                    />
                  )}

                  {loadedCount > 0 && (
                    <PromotionFilters
                      options={promotionOptions}
                      selected={filters.promotions}
                      onChange={handlePromotionChange}
                    />
                  )}

                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="card border-0 shadow disponibilidad-results-panel">
                <div className="card-body p-3 p-md-4">
              <section className="tg-disponibilidad-area">

                  {totalResults > 0 && hasSearchSession && (
                    <p className="disponibilidad-search-summary mb-20 text-muted">
  {filtersActive ? (
                        <>
                          {visibleCount} resultado
                          {visibleCount === 1 ? "" : "s"} con filtros
                          {loadedCount < totalResults ? (
                            <span className="disponibilidad-results-total__loaded">
                              · {loadedCount} de {totalResults} cargados
                            </span>
                          ) : (
                            <span className="disponibilidad-results-total__loaded">
                              · de {totalResults} en total
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          {totalResults} resultado
                          {totalResults === 1 ? "" : "s"}
                          {loadedCount > 0 && loadedCount < totalResults && (
                            <span className="disponibilidad-results-total__loaded mr-10">
                              · para: 
                            </span>
                          )}
                        </>
                      )}
                      {searchSummary}
                    </p>
                  )}

                  {(showInitialSkeleton || cards.length > 0) &&
                    !showFilterEmptyState && <DisponibilidadViewSwitcher />}

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
                          <div
                            key={`skeleton-${index}`}
                            className={gridColumnClass}
                          >
                            <RecommendationTourCardSkeleton
                              layout={isListView ? "list" : "grid"}
                            />
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
                      Ningún tour coincide con los filtros seleccionados.
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
                        Array.from(
                          { length: LOAD_MORE_SKELETON_COUNT },
                          (_, index) => (
                            <div
                              key={`load-more-skeleton-${index}`}
                              className={gridColumnClass}
                            >
                              <RecommendationTourCardSkeleton
                                layout={isListView ? "list" : "grid"}
                              />
                            </div>
                          ),
                        )}
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
              </section>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>

      <FooterThree />
    </>
  );
};

export default DisponibilidadContent;
