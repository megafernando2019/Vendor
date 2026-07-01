/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import {
  mapTop10Recommendations,
  type RecommendationCard,
} from "@/utils/recommendations";
import type { RecommendationItem } from "@/interfaces/disponibilidad";

import fallback_thumb from "@/assets/img/listing/listing-1.jpg";

const setting = {
  spaceBetween: 24,
  loop: true,
  speed: 500,
  autoplay: {
    delay: 4000,
  },
  navigation: {
    nextEl: ".tg-listing-5-slide-next",
    prevEl: ".tg-listing-5-slide-prev",
  },
  breakpoints: {
    "1200": {
      slidesPerView: 4,
    },
    "992": {
      slidesPerView: 3,
    },
    "768": {
      slidesPerView: 2,
    },
    "576": {
      slidesPerView: 2,
    },
    "0": {
      slidesPerView: 1,
    },
  },
};

const formatPrice = (amount: number, currency: string) => {
  const symbol =
    currency === "USD" || currency === "MXN" ? "$" : `${currency} `;
  return `${symbol}${amount.toLocaleString("es-MX")}`;
};

const Top10Carrousel = () => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState<RecommendationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const top10 = (json.data?.top_10 ?? []) as RecommendationItem[];
        const { cards: mappedCards } = mapTop10Recommendations(top10);
        setCards(mappedCards);
        console.log(mappedCards);
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
  }, []);

  const handleAddToWishlist = (item: RecommendationCard) => {
    dispatch(addToWishlist(item as any));
  };

  return (
    <div
      className="tg-listing-area tg-grey-bg include-bg"
      style={{ backgroundImage: "url(/assets/img/Top-10/Top-10.png)" }}
    >
      <div className="container">
        <div className="row align-items-end">
          <div className="col-lg-12">
            <div className="tg-location-section-title mb-40">
              <h5
                className="mb-15 mt-15 wow fadeInUp text-hortencia text-left text-purple text-morado-custom"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Los tours más populares y mejor valorados
              </h5>
              <h2
                className="text-bold wow fadeInUp text-left text-dark fs-1"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                TOP 10
              </h2>
            </div>
          </div>
          <div className="col-9"></div>
          <div className="col-lg-3">
            <div
              className="tg-listing-5-slider-navigation text-end mb-50 wow fadeInUp"
              data-wow-delay=".4s"
              data-wow-duration="1s"
            >
              <button className="tg-listing-5-slide-prev">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button className="tg-listing-5-slide-next">
                <i className="fa-solid fa-chevron-right"></i>
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
              <p>No hay recomendaciones disponibles.</p>
            </div>
          </div>
        )}

        {!loading && !error && cards.length > 0 && (
          <div className="row">
            <div className="col-12">
              <Swiper
                {...setting}
                modules={[Autoplay, Navigation]}
                className="swiper-container tg-listing-slider-2 p-relative fix"
              >
                {cards.map((item) => (
                  <SwiperSlide key={item.id} className="swiper-slide">
                    <div className="tg-listing-card-item tg-listing-5-card-item mb-25">
                      <div className="tg-listing-card-thumb tg-listing-2-card-thumb mb-15 fix p-relative">
                        <Link href={`/tour-details?mt=${item.clv}`}>
                          {item.thumb ? (
                            <img
                              className="tg-card-border w-100"
                              src={item.thumb}
                              alt={item.title}
                              style={{
                                objectFit: "cover",
                                aspectRatio: "16/9",
                              }}
                            />
                          ) : (
                            <Image
                              className="tg-card-border w-100"
                              src={fallback_thumb}
                              alt={item.title}
                            />
                          )}
                          {(item.offer || item.tag) && (
                            <span className="tg-listing-item-price-discount offer-btm shape-2">
                              {item.offer ?? item.tag}
                            </span>
                          )}
                        </Link>
                        <div className="tg-listing-item-wishlist">
                          <a
                            onClick={() => handleAddToWishlist(item)}
                            style={{ cursor: "pointer" }}
                          >
                            <svg
                              width="20"
                              height="18"
                              viewBox="0 0 20 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5167 16.3416C10.2334 16.4416 9.76675 16.4416 9.48341 16.3416C7.06675 15.5166 1.66675 12.075 1.66675 6.24165C1.66675 3.66665 3.74175 1.58331 6.30008 1.58331C7.81675 1.58331 9.15841 2.31665 10.0001 3.44998C10.8417 2.31665 12.1917 1.58331 13.7001 1.58331C16.2584 1.58331 18.3334 3.66665 18.3334 6.24165C18.3334 12.075 12.9334 15.5166 10.5167 16.3416Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                      <div className="tg-listing-card-content p-relative">
                        <h6 className="tg-listing-card-title mb-5 text-truncate d-block">
                          <span className="badge rounded bg-morado-custom">
                            MT{item.clv}
                          </span>
                          {item.title}
                        </h6>
                        <span className="tg-listing-card-duration-map d-inline-block mb-10">
                          <svg
                            width="13"
                            height="16"
                            viewBox="0 0 13 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.3329 6.7071C12.3329 11.2324 6.55512 15.1111 6.55512 15.1111C6.55512 15.1111 0.777344 11.2324 0.777344 6.7071C0.777344 5.16402 1.38607 3.68414 2.46962 2.59302C3.55316 1.5019 5.02276 0.888916 6.55512 0.888916C8.08748 0.888916 9.55708 1.5019 10.6406 2.59302C11.7242 3.68414 12.3329 5.16402 12.3329 6.7071Z"
                              stroke="currentColor"
                              strokeWidth="1.15556"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6.55512 8.64649C7.61878 8.64649 8.48105 7.7782 8.48105 6.7071C8.48105 5.636 7.61878 4.7677 6.55512 4.7677C5.49146 4.7677 4.6292 5.636 4.6292 6.7071C4.6292 7.7782 5.49146 8.64649 6.55512 8.64649Z"
                              stroke="currentColor"
                              strokeWidth="1.15556"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <span className="tg-listing-rating-percent">
                            {item.departuresCount} salidas
                          </span>
                        </span>

                        <div className="tg-listing-card-review mb-5">
                          <span className="tg-listing-rating-percent ms-2">
                            <i className="fa-regular fa-sun"></i> {item.time}
                          </span>
                        </div>

                        <div className="tg-listing-card-price d-flex align-items-end justify-content-between">
                          <div className="tg-listing-card-price-wrap price-bg d-flex align-items-center">
                            <span className="tg-listing-card-currency-amount me-5 d-flex flex-column">
                              <small className="w-100">Desde</small>
                              <span className="d-flex align-items-baseline">
                                <span>
                                  {formatPrice(item.price, item.currency)}
                                </span>
                                <span className="ms-1">USD</span>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Top10Carrousel;
