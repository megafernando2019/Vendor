/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import {
  mapRecommendationItemsToCards,
  normalizeRecommendationsData,
  type RecommendationCard,
  type RecommendationSectionKey,
} from "@/utils/recommendations";
import RecommendationTourCard from "./RecommendationTourCard";
import AnimateOnScroll from "@/components/common/AnimateOnScroll";

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
  headerClassName = "mb-40",
  titleColumnClassName = "col-lg-12",
  emptyMessage = "No hay recomendaciones disponibles.",
}: RecommendationCarrouselProps) => {
  const dispatch = useDispatch();
  const swiperRef = useRef<SwiperType | null>(null);
  const [cards, setCards] = useState<RecommendationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigationId = useMemo(
    () => `recommendation-carousel-${sectionKey.replace(/_/g, "-")}`,
    [sectionKey]
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
    [navigationId, cards.length]
  );

  useEffect(() => {
    let cancelled = false;

    const loadRecommendations = async () => {
      try {
        const res = await fetch("/api/getRecommendations");
        const json = await res.json();

        if (cancelled) return;

        if (!res.ok || !json.success) {
          setError(json.message ?? "No se pudieron cargar las recomendaciones");
          return;
        }

        const normalized = normalizeRecommendationsData(json.data ?? json);
        const items = normalized[sectionKey] ?? [];
        const { cards: mappedCards } = mapRecommendationItemsToCards(items);
        setCards(mappedCards);
      } catch {
        if (!cancelled) {
          setError("Error al consultar recomendaciones");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

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
    <AnimateOnScroll
      animation="fadeInUp"
      delay=".2s"
      duration=".9s"
      className={`tg-listing-area tg-grey-bg recommendation-carrousel-section${
        includeBg ? " include-bg" : ""
      }`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container">
        <div className="row align-items-end">
          <div className={titleColumnClassName}>
            <div className={`tg-location-section-title ${headerClassName}`}>
              <h5 className="mb-15 mt-15 text-hortencia text-left text-purple text-morado-custom">
                {subtitle}
              </h5>
              <h2 className="text-bold text-left text-dark fs-1">{title}</h2>
            </div>
          </div>
          <div className="col-9" />
          <div className="col-lg-3">
            <div className="tg-listing-5-slider-navigation text-end mb-50">
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
              <Swiper
                {...swiperSettings}
                modules={[Autoplay, Navigation]}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                className="swiper-container tg-listing-slider-2 p-relative fix recommendation-carousel"
              >
                {cards.map((item) => (
                  <SwiperSlide key={item.id} className="swiper-slide">
                    <RecommendationTourCard
                      item={item}
                      ratingLabel={ratingLabel}
                      onAddToWishlist={handleAddToWishlist}
                      onActionMenuOpenChange={handleActionMenuOpenChange}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </AnimateOnScroll>
  );
};

export default RecommendationCarrousel;
