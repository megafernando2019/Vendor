"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import type { RecommendationCard } from "@/utils/recommendations";
import StarRating from "@/components/common/StarRating";
import RecommendationCardMedia from "@/components/homes/home-three/RecommendationCardMedia";
import RecommendationCardPricePill from "@/components/homes/home-three/RecommendationCardPricePill";
import RecommendationTourCardMeta from "@/components/homes/home-three/RecommendationTourCardMeta";
import RecommendationTourCardDeparturesTable from "@/components/homes/home-three/RecommendationTourCardDeparturesTable";

type RecommendationTourCardProps = {
  item: RecommendationCard;
  compareOptions?: RecommendationCard[];
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
  compareOptions,
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
  const isListLayout = layout === "list";

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
      const title = item.title?.trim();
      if (!element || !title) return;

      tooltip = new Tooltip(element, {
        placement: "top",
        trigger: "hover focus",
        container: "body",
        title,
      });
    };

    void initTooltip();

    return () => {
      tooltip?.dispose();
    };
  }, [item.title]);

  const titleNode = usesSearchFlow ? (
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
  );

  const ratingNode = (
    <div
      className={`recommendation-card__rating${
        isListLayout ? " recommendation-card__rating--list" : ""
      }`}
    >
      <StarRating
        rating={rating}
        className="recommendation-card__stars"
        starClassName="recommendation-card__star"
      />
      <span className="recommendation-card__rating-text">
        ({rating} {ratingLabel})
      </span>
    </div>
  );

  if (isListLayout) {
    return (
      <article className="card recommendation-card recommendation-card--list border-0 h-100">
        <div className="row g-0 flex-grow-1 align-items-stretch">
          <div className="col-12 col-lg-3 recommendation-card__list-col recommendation-card__list-col--media">
            <div className="recommendation-card__list-media-stack d-flex flex-column h-100">
              <div className="recommendation-card__list-media-wrap position-relative flex-grow-1">
                <RecommendationCardMedia
                  item={item}
                  compareOptions={compareOptions}
                  layout="list"
                  onAddToWishlist={onAddToWishlist}
                  onActionMenuOpenChange={onActionMenuOpenChange}
                  detailHref={detailHref}
                  onCardNavigate={
                    usesSearchFlow ? handleSearchNavigate : undefined
                  }
                  cardNavigateDisabled={searchNavigateDisabled}
                />
              </div>

              <div className="recommendation-card__list-price d-flex justify-content-center p-3">
                <RecommendationCardPricePill item={item} variant="inline" />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 recommendation-card__list-col recommendation-card__list-col--meta">
            <div className="card-body recommendation-card__body recommendation-card__body--list h-100 d-flex flex-column p-3 p-md-4">
              <h3 className="recommendation-card__title recommendation-card__title--list mb-2">
                {titleNode}
              </h3>

              {ratingNode}

              <RecommendationTourCardMeta item={item} layout="list" />
            </div>
          </div>

          <div className="col-12 col-lg-5 recommendation-card__list-col recommendation-card__list-col--departures">
            <div className="card-body recommendation-card__body recommendation-card__body--list h-100 d-flex flex-column p-3 p-md-4">
              <h4 className="recommendation-card__departures-title h6 mb-3">
                Salidas disponibles
              </h4>

              <RecommendationTourCardDeparturesTable
                departures={item.filteredDepartures}
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="recommendation-card">
      <RecommendationCardMedia
        item={item}
        compareOptions={compareOptions}
        layout="grid"
        onAddToWishlist={onAddToWishlist}
        onActionMenuOpenChange={onActionMenuOpenChange}
        detailHref={detailHref}
        onCardNavigate={usesSearchFlow ? handleSearchNavigate : undefined}
        cardNavigateDisabled={searchNavigateDisabled}
      />

      <div className="recommendation-card__body">
        <h3 className="recommendation-card__title">{titleNode}</h3>

        {ratingNode}

        <RecommendationTourCardMeta item={item} layout="grid" />
      </div>
    </article>
  );
};

export default RecommendationTourCard;
