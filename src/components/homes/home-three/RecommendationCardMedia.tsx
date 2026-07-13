"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RecommendationCard } from "@/utils/recommendations";
import TourThumbImage from "@/components/common/TourThumbImage";
import fallback_thumb from "@/assets/img/listing/listing-1.webp";
import RecommendationCardActionMenu from "./RecommendationCardActionMenu";
import RecommendationCardPricePill from "./RecommendationCardPricePill";

type RecommendationCardMediaProps = {
  item: RecommendationCard;
  compareOptions?: RecommendationCard[];
  layout?: "grid" | "list";
  onAddToWishlist: (item: RecommendationCard) => void;
  onActionMenuOpenChange?: (open: boolean) => void;
  detailHref?: string;
  onCardNavigate?: () => void;
  cardNavigateDisabled?: boolean;
};

function splitOverlayTitle(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return { lead: "", main: title.trim() };
  }

  return {
    lead: words.slice(0, -1).join(" "),
    main: words[words.length - 1] ?? "",
  };
}

const RecommendationCardMedia = ({
  item,
  compareOptions,
  layout = "grid",
  onAddToWishlist,
  onActionMenuOpenChange,
  detailHref = `/tour-details?mt=${item.clv}`,
  onCardNavigate,
  cardNavigateDisabled = false,
}: RecommendationCardMediaProps) => {
  const [priceTooltipDismissSignal, setPriceTooltipDismissSignal] = useState(0);
  const promotionBadges = item.promotions ?? [];
  const isListLayout = layout === "list";
  const overlayTitle = splitOverlayTitle(item.title);

  const imageContent = item.thumb ? (
    <TourThumbImage
      className="recommendation-card__image"
      src={item.thumb}
      alt={item.title}
      height={210}
    />
  ) : (
    <Image
      className="recommendation-card__image"
      src={fallback_thumb}
      alt={item.title}
    />
  );

  return (
    <div
      className={`recommendation-card__media${
        isListLayout ? " recommendation-card__media--list h-100" : ""
      }`}
    >
      {onCardNavigate ? (
        <button
          type="button"
          onClick={onCardNavigate}
          disabled={cardNavigateDisabled}
          className="recommendation-card__image-link bg-image hover-zoom border-0 p-0 w-100 h-100"
          aria-label={`Buscar disponibilidad de ${item.title}`}
        >
          {imageContent}
        </button>
      ) : (
        <Link
          href={detailHref}
          className={`recommendation-card__image-link bg-image hover-zoom${
            isListLayout ? " h-100" : ""
          }`}
        >
          {imageContent}
        </Link>
      )}

      {isListLayout && overlayTitle.main ? (
        <div className="recommendation-card__media-title" aria-hidden="true">
          {overlayTitle.lead ? (
            <span className="recommendation-card__media-title-lead">
              {overlayTitle.lead}
            </span>
          ) : null}
          <span className="recommendation-card__media-title-main">
            {overlayTitle.main}
          </span>
        </div>
      ) : null}

      {(promotionBadges.length > 0 || item.promotions) && (
        <div className="recommendation-card__badges" aria-label="Promociones">
          {promotionBadges.map((promotion) => (
            <span
              key={promotion.uuid || promotion.name}
              className="recommendation-card__badge"
            >
              {promotion.name}
            </span>
          ))}
        </div>
      )}

      <RecommendationCardActionMenu
        item={item}
        compareOptions={compareOptions}
        onAddToWishlist={onAddToWishlist}
        onActionMenuOpenChange={onActionMenuOpenChange}
        onBeforeMenuToggle={(nextOpen) => {
          if (nextOpen) {
            setPriceTooltipDismissSignal((value) => value + 1);
          }
        }}
      />

      <RecommendationCardPricePill
        item={item}
        dismissSignal={priceTooltipDismissSignal}
      />

      {!isListLayout ? (
        <span className="recommendation-card__media-curve" aria-hidden="true" />
      ) : null}
    </div>
  );
};

export default RecommendationCardMedia;
