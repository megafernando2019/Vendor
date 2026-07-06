"use client";

import { useCallback, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import BookingFormsSticky from "@/components/common/banner-form/BookingFormsSticky";
import FooterThree from "@/components/common/FooterThree";
import RecommendationTourCard from "@/components/homes/home-three/RecommendationTourCard";
import RecommendationTourCardSkeleton from "@/components/disponibilidad/RecommendationTourCardSkeleton";
import { useDisponibilidadInfiniteScroll } from "@/hooks/useDisponibilidadInfiniteScroll";
import { useRestoreDisponibilidadSearch } from "@/hooks/useRestoreDisponibilidadSearch";
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

  const cards = useMemo(
    () => mapResultDataToCards(resultados),
    [resultados],
  );

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

  const showInitialSkeleton = loading && cards.length === 0;
  const showEmptyState = !loading && !loadingMore && cards.length === 0 && !error;
  const totalResults = pagination?.total ?? 0;

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
                <p className="disponibilidad-results-total mb-30 text-muted">
                  {totalResults} resultado
                  {totalResults === 1 ? "" : "s"}
                  {cards.length > 0 && cards.length < totalResults && (
                    <span className="disponibilidad-results-total__loaded">
                      {" "}
                      · mostrando {cards.length}
                    </span>
                  )}
                </p>
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
                    className="row g-4 disponibilidad-gallery"
                    aria-busy="true"
                    aria-label="Cargando resultados"
                  >
                    {Array.from({ length: skeletonCount }, (_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="col-12 col-sm-6 col-lg-4 col-xl-3"
                      >
                        <RecommendationTourCardSkeleton />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {showEmptyState && (
                <p className="mb-20">
                  No hay resultados guardados. Realiza una búsqueda desde el
                  inicio.
                </p>
              )}

              {cards.length > 0 && (
                <div className="row g-4 disponibilidad-gallery">
                  {cards.map((item) => (
                    <div
                      key={item.id}
                      className="col-12 col-sm-6 col-lg-4 col-xl-3 disponibilidad-gallery__item--loaded"
                    >
                      <RecommendationTourCard
                        item={item}
                        onAddToWishlist={handleAddToWishlist}
                        linkMode="quote-wizard"
                      />
                    </div>
                  ))}

                  {loadingMore &&
                    Array.from({ length: LOAD_MORE_SKELETON_COUNT }, (_, index) => (
                      <div
                        key={`load-more-skeleton-${index}`}
                        className="col-12 col-sm-6 col-lg-4 col-xl-3"
                      >
                        <RecommendationTourCardSkeleton />
                      </div>
                    ))}
                </div>
              )}

              {cards.length > 0 && hasMore && (
                <div
                  ref={sentinelRef}
                  className="disponibilidad-infinite-sentinel"
                  aria-hidden="true"
                />
              )}

              {cards.length > 0 && loadingMore && (
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
