"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { RecommendationCard } from "@/utils/recommendations";
import StarRating from "@/components/common/StarRating";
import fallback_thumb from "@/assets/img/listing/listing-1.jpg";

const formatPrice = (amount: number, currency: string) => {
  const symbol =
    currency === "USD" || currency === "MXN" ? "$" : `${currency} `;
  return `${symbol}${amount.toLocaleString("es-MX")}`;
};

const ActionMenuIcon = () => (
  <svg
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
      strokeWidth="2"
      d="M5 9h14M5 15h14"
    />
  </svg>
);

const FavoriteIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M6 4a2 2 0 012-2h8a2 2 0 012 2v18l-8-4.5L6 22V4z"
    />
  </svg>
);

const ShareIcon = () => (
<svg className="text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M4.248 19C3.22 15.77 5.275 8.232 12.466 8.232V6.079a1.025 1.025 0 0 1 1.644-.862l5.479 4.307a1.108 1.108 0 0 1 0 1.723l-5.48 4.307a1.026 1.026 0 0 1-1.643-.861v-2.154C5.275 13.616 4.248 19 4.248 19Z"/>
</svg>

);

type RecommendationTourCardProps = {
  item: RecommendationCard;
  rating?: number;
  ratingLabel?: string;
  onAddToWishlist: (item: RecommendationCard) => void;
  onActionMenuOpenChange?: (open: boolean) => void;
};

const RecommendationTourCard = ({
  item,
  rating = 5,
  ratingLabel = "calificaciones",
  onAddToWishlist,
  onActionMenuOpenChange,
}: RecommendationTourCardProps) => {
  const titleLinkRef = useRef<HTMLAnchorElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const portalMenuRef = useRef<HTMLUListElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const updateMenuPosition = useCallback(() => {
    const button = actionButtonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    updateMenuPosition();

    const handleScrollOrResize = () => updateMenuPosition();

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [menuOpen, updateMenuPosition]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        actionButtonRef.current?.contains(target) ||
        portalMenuRef.current?.contains(target)
      ) {
        return;
      }

      setMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    onActionMenuOpenChange?.(menuOpen);

    return () => {
      if (menuOpen) {
        onActionMenuOpenChange?.(false);
      }
    };
  }, [menuOpen, onActionMenuOpenChange]);

  const handleFavorite = () => {
    setMenuOpen(false);
    onAddToWishlist(item);
  };

  const handleAddToList = () => {
    setMenuOpen(false);
    onAddToWishlist(item);
  };

  const handleShare = async () => {
    setMenuOpen(false);

    const url = `${window.location.origin}/tour-details?mt=${item.clv}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
    } catch {
      // Usuario canceló o el navegador bloqueó la acción.
    }
  };

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
    <article className="recommendation-card">
      <div className="recommendation-card__media">
        <Link
          href={`/tour-details?mt=${item.clv}`}
          className="recommendation-card__image-link"
        >
          {item.thumb ? (
            <img
              className="recommendation-card__image"
              src={item.thumb}
              alt={item.title}
            />
          ) : (
            <Image
              className="recommendation-card__image"
              src={fallback_thumb}
              alt={item.title}
            />
          )}
        </Link>

        {(item.offer || item.tag) && (
          <span className="recommendation-card__badge">
            {item.offer ?? item.tag}
          </span>
        )}

        <div className="recommendation-card__action-dropdown">
          <button
            ref={actionButtonRef}
            type="button"
            className="recommendation-card__action"
            aria-label="Más opciones"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => {
              setMenuOpen((prev) => {
                const next = !prev;
                if (next) {
                  requestAnimationFrame(updateMenuPosition);
                }
                return next;
              });
            }}
          >
            <ActionMenuIcon />
          </button>
        </div>

        {menuOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <ul
              ref={portalMenuRef}
              className="dropdown-menu dropdown-menu-end recommendation-card__action-menu recommendation-card__action-menu--portal recommendation-card__action-menu--icons show"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
              }}
              role="menu"
            >
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="recommendation-card__action-icon-btn"
                  aria-label="Favorito"
                  onClick={handleFavorite}
                >
                  <FavoriteIcon />
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="mt-1 recommendation-card__action-icon-btn"
                  aria-label="Agregar a lista"
                  onClick={handleAddToList}
                >
                  <BookmarkIcon />
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="mt-1 recommendation-card__action-icon-btn"
                  aria-label="Compartir"
                  onClick={handleShare}
                >
                  <ShareIcon />
                </button>
              </li>
            </ul>,
            document.body,
          )}

        <div className="recommendation-card__price-pill">
          <span className="recommendation-card__price-label">Desde</span>
          <strong className="recommendation-card__price-value">
            {formatPrice(item.price, item.currency)} {item.currency}
          </strong>
        </div>

        <span className="recommendation-card__media-curve" aria-hidden="true" />
      </div>

      <div className="recommendation-card__body">
        <h3 className="recommendation-card__title">
          <Link
            ref={titleLinkRef}
            href={`/tour-details?mt=${item.clv}`}
            className="recommendation-card__title-link"
          >
            {item.title}
          </Link>
        </h3>

        <div className="recommendation-card__rating">
          <StarRating
            rating={rating}
            className="recommendation-card__stars"
            starClassName="recommendation-card__star"
          />
          <span className="recommendation-card__rating-text">( {rating+' '+ratingLabel})</span>
        </div>

        <div className="recommendation-card__meta">
          <div className="recommendation-card__meta-col">
            <span className="recommendation-card__mt">MT{item.clv}</span>
            <span className="recommendation-card__info">
              <i
                className="fa-solid fa-plane recommendation-card__info-icon"
                aria-hidden="true"
              />
              {item.departuresCount} salidas
            </span>
          </div>
          <div className="recommendation-card__meta-col recommendation-card__meta-col--right">
            <span className="recommendation-card__info">
<svg className="text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
</svg>

              {item.days} días
            </span>
            <span className="recommendation-card__info">
              <i
                className="fa-regular fa-moon recommendation-card__info-icon"
                aria-hidden="true"
              />
              {item.nights} noches
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecommendationTourCard;
