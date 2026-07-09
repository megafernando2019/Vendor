"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { useAppSelector } from "@/redux/hooks";
import BookingFormsSticky from "@/components/common/banner-form/BookingFormsSticky";
import FooterThree from "@/components/common/FooterThree";
import RecommendationTourCardSkeleton from "@/components/disponibilidad/RecommendationTourCardSkeleton";
import RecommendationTourCard from "@/components/homes/home-three/RecommendationTourCard";
import RecommendationPageToolbar from "@/components/recomendaciones/RecommendationPageToolbar";
import RecommendationSectionNav from "@/components/recomendaciones/RecommendationSectionNav";
import { useRecommendationsQuery } from "@/hooks/useRecommendationsQuery";
import { useSearchDisponibilidad } from "@/hooks/useSearchDisponibilidad";
import useWow from "@/hooks/useWow";
import {
  getRecommendationSections,
  mapRecommendationItemsToCards,
  type RecommendationCard,
  type RecommendationSectionConfig,
} from "@/utils/recommendations";

const SKELETON_COUNT = 6;

const RecomendacionesContent = () => {
  useWow();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recommendationsQuery = useRecommendationsQuery();
  const { searchByKeyword, searching } = useSearchDisponibilidad();
  const viewMode = useAppSelector((state) => state.view.view);
  const isListView = viewMode === "lista";

  const sectionFromUrl = searchParams.get("section") ?? "";

  const [activeSection, setActiveSection] = useState(sectionFromUrl);

  const sections = useMemo<RecommendationSectionConfig[]>(() => {
    if (recommendationsQuery.status !== "success") return [];
    return getRecommendationSections(recommendationsQuery.data);
  }, [recommendationsQuery]);

  useEffect(() => {
    if (sections.length === 0) return;

    setActiveSection((current) => {
      const preferred =
        sectionFromUrl &&
        sections.some((section) => section.key === sectionFromUrl)
          ? sectionFromUrl
          : current;

      if (preferred && sections.some((section) => section.key === preferred)) {
        return preferred;
      }

      return sections[0]?.key ?? "";
    });
  }, [sections, sectionFromUrl]);

  const handleSectionChange = useCallback(
    (sectionKey: string) => {
      setActiveSection(sectionKey);

      const params = new URLSearchParams(searchParams.toString());
      params.set("section", sectionKey);
      router.replace(`/recomendaciones?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const activeSectionMeta = useMemo(
    () => sections.find((section) => section.key === activeSection),
    [sections, activeSection],
  );

  const cards = useMemo(() => {
    if (recommendationsQuery.status !== "success" || !activeSection) {
      return [] as RecommendationCard[];
    }

    const items = recommendationsQuery.data[activeSection] ?? [];
    return mapRecommendationItemsToCards(items).cards;
  }, [recommendationsQuery, activeSection]);

  const handleAddToWishlist = useCallback(
    (item: RecommendationCard) => {
      dispatch(addToWishlist(item as never));
    },
    [dispatch],
  );

  const loading = recommendationsQuery.status === "loading";
  const error =
    recommendationsQuery.status === "error" ? recommendationsQuery.error : null;

  const gridColumnClass = isListView ? "col-12" : "col-12 col-sm-6 col-xl-4";
  const showViewSwitcher = !loading && cards.length > 0;

  return (
    <>
      <main>
        <div className="tg-booking-sticky-scope tg-disponibilidad-sticky-scope">
          <BookingFormsSticky />

          <div className="container py-4 py-md-5">
            <div className="row g-3 align-items-center tg-recomendaciones-layout__header">
              <div className="col-md-3">
                <div className="recommendation-page-header">
                  <p className="recommendation-page-header__subtitle text-hortencia text-morado-custom mb-1">
                    Conoce nuestras
                  </p>
                  <h1 className="recommendation-page-header__title mb-0">
                    Recomendaciones
                  </h1>
                </div>
              </div>

              <div className="col-md-9">
                <RecommendationPageToolbar
                  activeSectionLabel={
                    activeSectionMeta?.label ?? "Recomendaciones"
                  }
                  showViewSwitcher={showViewSwitcher}
                />
              </div>
            </div>

            <div className="row g-4 disponibilidad-layout-row tg-recomendaciones-layout">
              <div className="col-md-3">
                <div className="card border-0 shadow recommendation-sidebar-card recommendation-section-nav-panel h-100">
                  <div className="card-body p-4 p-md-4">
                    <h2 className="recommendation-sidebar-card__title mb-0">
                      Recomendaciones
                    </h2>

                    {loading ? (
                      <div
                        className="recommendation-section-nav-skeleton mt-4"
                        aria-hidden="true"
                      />
                    ) : (
                      <div className="mt-4">
                        <RecommendationSectionNav
                          sections={sections}
                          activeSection={activeSection}
                          onSectionChange={handleSectionChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-9">
                <div className="card border-0 shadow h-100 disponibilidad-results-panel">
                  <div className="card-body p-3 p-md-4">
                    <section className="tg-recomendaciones-area">
                      {error && (
                        <div className="alert alert-danger mb-20" role="alert">
                          {error}
                        </div>
                      )}

                      {loading && (
                        <>
                          <p className="mb-30 text-muted" aria-live="polite">
                            Cargando recomendaciones...
                          </p>
                          <div
                            className={`row g-4 disponibilidad-gallery${
                              isListView ? " disponibilidad-gallery--list" : ""
                            }`}
                            aria-busy="true"
                          >
                            {Array.from(
                              { length: SKELETON_COUNT },
                              (_, index) => (
                                <div
                                  key={`skeleton-${index}`}
                                  className={gridColumnClass}
                                >
                                  <RecommendationTourCardSkeleton
                                    layout={isListView ? "list" : "grid"}
                                  />
                                </div>
                              ),
                            )}
                          </div>
                        </>
                      )}

                      {!loading && !error && cards.length === 0 && (
                        <p className="text-muted mb-0">
                          No hay tours en esta categoría por el momento.
                        </p>
                      )}

                      {!loading && !error && cards.length > 0 && (
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
                                onSearchNavigate={searchByKeyword}
                                searchNavigateDisabled={searching}
                              />
                            </div>
                          ))}
                        </div>
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

export default RecomendacionesContent;
