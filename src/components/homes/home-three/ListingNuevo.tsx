/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Isotope from "isotope-layout";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import {
  mapTop10Recommendations,
  type RecommendationCard,
  type RecommendationGroupTab,
} from "@/utils/recommendations";
import type { RecommendationItem } from "@/interfaces/disponibilidad";

import shape_1 from "@/assets/img/listing/about-shape.png";
import shape_2 from "@/assets/img/listing/about-shape-2.png";
import shape_3 from "@/assets/img/listing/about-shape-3.png";
import fallback_thumb from "@/assets/img/listing/listing-1.jpg";

const formatPrice = (amount: number, currency: string) => {
  const symbol = currency === "USD" || currency === "MXN" ? "$" : `${currency} `;
  return `${symbol}${amount.toLocaleString("es-MX")}`;
};

const ListingNuevo = () => {
  const isotope = useRef<Isotope | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filterKey, setFilterKey] = useState("*");
  const [selectedFilter, setSelectedFilter] = useState("*");
  const [groups, setGroups] = useState<RecommendationGroupTab[]>([]);
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
        const { cards: mappedCards, groups: mappedGroups } =
          mapTop10Recommendations(top10);

        setGroups(mappedGroups);
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
  }, []);

  useEffect(() => {
    if (loading || error || cards.length === 0 || typeof window === "undefined") {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    isotope.current?.destroy();
    isotope.current = new Isotope(container, {
      itemSelector: ".isotope-filter-item",
      layoutMode: "fitRows",
    });

    return () => {
      isotope.current?.destroy();
      isotope.current = null;
    };
  }, [cards, loading, error]);

  useEffect(() => {
    if (!isotope.current) return;

    if (filterKey === "*") {
      isotope.current.arrange({ filter: "*" });
    } else {
      isotope.current.arrange({ filter: `.${filterKey}` });
    }
  }, [filterKey, cards, loading, error]);

  const handleFilterKeyChange = (key: string) => () => {
    setFilterKey(key);
    setSelectedFilter(key);
  };

  const dispatch = useDispatch();

  const handleAddToWishlist = (item: RecommendationCard) => {
    dispatch(addToWishlist(item as any));
  };

  return (
    <div className="tg-listing-area tg-grey-bg pt-140 pb-110 p-relative z-index-9">
      <Image
        className="tg-listing-shape d-none d-lg-block"
        src={shape_1}
        alt=""
      />
      <Image
        className="tg-listing-shape-2 d-none d-xl-block"
        src={shape_2}
        alt=""
      />
      <Image
        className="tg-listing-shape-3 d-none d-lg-block"
        src={shape_3}
        alt=""
      />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tg-listing-section-title text-center mb-35">
              <h5
                className="tg-section-subtitle wow fadeInUp"
                data-wow-delay=".3s"
                data-wow-duration=".5s"
              >
                Popular Tours
              </h5>
              <h2
                className="mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".6s"
              >
                Something Amazing Waiting For you
              </h2>
            </div>
          </div>
          <div className="col-lg-12">
            <div
              className="tg-listing-menu-nav project__menu-nav mb-40 wow fadeInUp"
              data-wow-delay=".5s"
              data-wow-duration=".9s"
            >
              <button
                className={selectedFilter === "*" ? "active" : ""}
                onClick={handleFilterKeyChange("*")}
                data-filter="*"
              >
                <span className="borders"></span>
                <span className="icon">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.5 2.5L8.8 10.2M16.5 2.5L11.6 16.5L8.8 10.2M16.5 2.5L2.5 7.4L8.8 10.2"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>Todos</span>
              </button>
              {groups.map((group) => (
                <button
                  key={group.category}
                  className={
                    selectedFilter === group.category ? "active" : ""
                  }
                  onClick={handleFilterKeyChange(group.category)}
                >
                  <span className="borders"></span>
                  <span>{group.name}</span>
                </button>
              ))}
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
          <div
            ref={containerRef}
            className="row isotope-wrapper project-active-two"
          >
            {cards.map((item) => (
              <div
                key={item.id}
                className={`col-xxl-3 col-xl-4 col-lg-4 col-md-6 grid-item grid-sizer ${item.category} isotope-filter-item`}
              >
                <div className="tg-listing-card-item mb-30">
                  <div className="tg-listing-card-thumb fix mb-15 p-relative">
                    <Link href={`/tour-details?mt=${item.clv}`}>
                      {item.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="tg-card-border w-100"
                          src={item.thumb}
                          alt={item.title}
                          style={{ objectFit: "cover", aspectRatio: "16/9" }}
                        />
                      ) : (
                        <Image
                          className="tg-card-border w-100"
                          src={fallback_thumb}
                          alt={item.title}
                        />
                      )}
                      {item.tag && (
                        <span className="tg-listing-item-price-discount shape">
                          {item.tag}
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
                  <div className="tg-listing-card-content">
                    <h4 className="tg-listing-card-title text-truncate d-block">
                      <Link href={`/tour-details?mt=${item.clv}`}>
                        {item.title}
                      </Link>
                    </h4>
                    <div className="tg-listing-card-duration-tour">
                      <span className="tg-listing-card-duration-map mb-5">
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
                        {item.location}
                      </span>
                      <span className="tg-listing-card-duration-time">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.00175 3.73329V7.99996L10.8462 9.42218M15.1128 8.00003C15.1128 11.9274 11.9291 15.1111 8.00174 15.1111C4.07438 15.1111 0.890625 11.9274 0.890625 8.00003C0.890625 4.07267 4.07438 0.888916 8.00174 0.888916C11.9291 0.888916 15.1128 4.07267 15.1128 8.00003Z"
                            stroke="currentColor"
                            strokeWidth="1.06667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <div className="tg-listing-card-price d-flex align-items-end justify-content-between">
                    <div className="tg-listing-card-price-wrap price-bg d-flex align-items-center">
                      <span className="tg-listing-card-currency-amount mr-5">
                        {formatPrice(item.price, item.currency)}
                      </span>
                      
                    </div>
                    <div className="tg-listing-card-review space">
                      <span className="tg-listing-rating-percent">
                        {item.departuresCount} salidas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingNuevo;
