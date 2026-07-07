/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import {
  mapRecommendationItemsToCards,
  type RecommendationCard,
  type RecommendationSectionKey,
} from "@/utils/recommendations";
import { useRecommendationsQuery } from "@/hooks/useRecommendationsQuery";
import { useSearchDisponibilidad } from "@/hooks/useSearchDisponibilidad";
import RecommendationTourCard from "./RecommendationTourCard";

const MAX_SLIDES_PER_VIEW = 4;

const SWIPER_BREAKPOINTS = {
  "1200": { slidesPerView: 4 },
  "992": { slidesPerView: 3 },
  "768": { slidesPerView: 2 },
  "576": { slidesPerView: 2 },
  "0": { slidesPerView: 1 },
};

export type RecommendationCarrouselProps = {
  sectionKey: RecommendationSectionKey;
  subtitle: string;
  title: string;
  backgroundImage: string;
  includeBg?: boolean;
  ratingLabel?: string;
  headerClassName?: string;
  titleColumnClassName?: string;
  emptyMessage?: string;
};

const RecommendationCarrousel = ({
  sectionKey,
  subtitle,
  title,
  backgroundImage,
  includeBg = true,
  ratingLabel,
  headerClassName = "mb-40 w-full",
  titleColumnClassName = "col-lg-12",
  emptyMessage = "No hay recomendaciones disponibles.",
}: RecommendationCarrouselProps) => {
  const dispatch = useDispatch();
  const swiperRef = useRef<SwiperType | null>(null);
  const { searchByKeyword, searching } = useSearchDisponibilidad();
  const recommendationsQuery = useRecommendationsQuery();

  const { cards, loading, error } = useMemo(() => {
    if (recommendationsQuery.status === "loading") {
      return { cards: [] as RecommendationCard[], loading: true, error: null };
    }

    if (recommendationsQuery.status === "error") {
      return {
        cards: [] as RecommendationCard[],
        loading: false,
        error: recommendationsQuery.error,
      };
    }

    const items = recommendationsQuery.data[sectionKey] ?? [];
    const { cards: mappedCards } = mapRecommendationItemsToCards(items);

    return { cards: mappedCards, loading: false, error: null };
  }, [recommendationsQuery, sectionKey]);

  const navigationId = useMemo(
    () => `recommendation-carousel-${sectionKey.replace(/_/g, "-")}`,
    [sectionKey],
  );

  const swiperSettings = useMemo(
    () => ({
      spaceBetween: 24,
      loop: cards.length > MAX_SLIDES_PER_VIEW,
      centerInsufficientSlides: true,
      speed: 500,
      autoplay: { delay: 4000 },
      navigation: {
        nextEl: `.${navigationId}-next`,
        prevEl: `.${navigationId}-prev`,
      },
      breakpoints: SWIPER_BREAKPOINTS,
    }),
    [navigationId, cards.length],
  );

  const handleAddToWishlist = (item: RecommendationCard) => {
    dispatch(addToWishlist(item as any));
  };

  const handleActionMenuOpenChange = useCallback((open: boolean) => {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay) return;

    if (open) {
      swiper.autoplay.stop();
      return;
    }

    swiper.autoplay.start();
  }, []);

  return (
    <div className={`recommendation-carrousel-root pt-50 ${backgroundImage}`}>
      <div className="container">
        <div className="row">
          <div className="tg-listing-5-slider-navigation text-end mb-10">
            <div className={titleColumnClassName}>
              <div className={`tg-location-section-title ${headerClassName}`}>
                <h5 className="mb-15 mt-15 text-hortencia text-left text-purple text-morado-custom d-flex justify-content-start">
                  {subtitle}
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <h2 className="text-bold text-left text-dark fs-1 d-flex justify-content-start">
                      {title}
                    </h2>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className={`${navigationId}-prev tg-listing-5-slide-prev`}
                      aria-label="Anterior"
                    >
                      <i className="fa-solid fa-chevron-left" />
                    </button>
                    <button
                      type="button"
                      className={`${navigationId}-next tg-listing-5-slide-next`}
                      aria-label="Siguiente"
                    >
                      <i className="fa-solid fa-chevron-right" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <p>Cargando recomendaciones...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && cards.length === 0 && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <p>{emptyMessage}</p>
            </div>
          </div>
        )}

        {!loading && !error && cards.length > 0 && (
          <div className="row">
            <div className="col-12">
              <div className="recommendation-carousel-wrap">
                <Swiper
                  {...swiperSettings}
                  modules={[Autoplay, Navigation]}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  className="swiper recommendation-carousel"
                >
                  {cards.map((item) => (
                    <SwiperSlide key={item.id} className="swiper-slide">
                      <RecommendationTourCard
                        item={item}
                        ratingLabel={ratingLabel}
                        onAddToWishlist={handleAddToWishlist}
                        onActionMenuOpenChange={handleActionMenuOpenChange}
                        linkMode="search-disponibilidad"
                        onSearchNavigate={searchByKeyword}
                        searchNavigateDisabled={searching}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCarrousel;
