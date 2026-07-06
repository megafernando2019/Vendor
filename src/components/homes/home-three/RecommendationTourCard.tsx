"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import type { RecommendationCard } from "@/utils/recommendations";
import StarRating from "@/components/common/StarRating";
import RecommendationCardMedia from "@/components/homes/home-three/RecommendationCardMedia";

type RecommendationTourCardProps = {
  item: RecommendationCard;
  rating?: number;
  ratingLabel?: string;
  onAddToWishlist: (item: RecommendationCard) => void;
  onActionMenuOpenChange?: (open: boolean) => void;
  linkMode?: "tour-details" | "quote-wizard" | "search-disponibilidad";
  onSearchNavigate?: (clv: string) => void;
  searchNavigateDisabled?: boolean;
  layout?: "grid" | "list";
};

const RecommendationTourCard = ({
  item,
  rating = 5,
  ratingLabel = "calificaciones",
  onAddToWishlist,
  onActionMenuOpenChange,
  linkMode = "tour-details",
  onSearchNavigate,
  searchNavigateDisabled = false,
  layout = "grid",
}: RecommendationTourCardProps) => {
  const titleLinkRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const detailHref =
    linkMode === "quote-wizard"
      ? `/quote-wizard/${item.clv}`
      : `/tour-details?mt=${item.clv}`;

  const usesSearchFlow = linkMode === "search-disponibilidad";

  const handleSearchNavigate = useCallback(() => {
    if (searchNavigateDisabled || !onSearchNavigate) return;
    onSearchNavigate(item.clv);
  }, [item.clv, onSearchNavigate, searchNavigateDisabled]);

  useEffect(() => {
    let tooltip: { dispose: () => void } | null = null;

    const initTooltip = async () => {
      const { Tooltip } = await import("bootstrap");
      const element = titleLinkRef.current;
      if (!element) return;

      tooltip = new Tooltip(element, {
        placement: "top",
        trigger: "hover focus",
        container: "body",
        title: item.title,
      });
    };

    void initTooltip();

    return () => {
      tooltip?.dispose();
    };
  }, [item.title]);

  return (
    <article
      className={`recommendation-card${
        layout === "list" ? " recommendation-card--list" : ""
      }`}
    >
      <RecommendationCardMedia
        item={item}
        onAddToWishlist={onAddToWishlist}
        onActionMenuOpenChange={onActionMenuOpenChange}
        detailHref={detailHref}
        onCardNavigate={usesSearchFlow ? handleSearchNavigate : undefined}
        cardNavigateDisabled={searchNavigateDisabled}
      />

      <div className="recommendation-card__body">
        <h3 className="recommendation-card__title">
          {usesSearchFlow ? (
            <button
              ref={titleLinkRef as React.RefObject<HTMLButtonElement>}
              type="button"
              onClick={handleSearchNavigate}
              disabled={searchNavigateDisabled}
              className="recommendation-card__title-link border-0 bg-transparent p-0 text-start"
            >
              {item.title}
            </button>
          ) : (
            <Link
              ref={titleLinkRef as React.RefObject<HTMLAnchorElement>}
              href={detailHref}
              className="recommendation-card__title-link"
            >
              {item.title}
            </Link>
          )}
        </h3>

        <div className="recommendation-card__rating">
          <StarRating
            rating={rating}
            className="recommendation-card__stars"
            starClassName="recommendation-card__star"
          />
          <span className="recommendation-card__rating-text">
            ( {rating + " " + ratingLabel})
          </span>
        </div>

        <table className="recommendation-card__meta-table">
          <tbody>
            <tr>
              <td>
                <span className="recommendation-card__mt">MT{item.clv}</span>
              </td>
              <td>
                <span className="recommendation-card__info">
                  <svg
                    className="recommendation-card__info-icon-svg"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                    />
                  </svg>
                  {item.days} días
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="recommendation-card__info">
                  <i
                    className="fa-solid fa-plane recommendation-card__info-icon"
                    aria-hidden="true"
                  />
                  {item.departuresCount} salidas
                </span>
              </td>
              <td>
                <span className="recommendation-card__info">
                  <i
                    className="fa-regular fa-moon recommendation-card__info-icon"
                    aria-hidden="true"
                  />
                  {item.nights} noches
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default RecommendationTourCard;
