"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RecommendationCard } from "@/utils/recommendations";
import {
  ActionMenuIcon,
  BookmarkIcon,
  FavoriteIcon,
  ShareIcon,
} from "./recommendationCardMediaShared";

type RecommendationCardActionMenuProps = {
  item: RecommendationCard;
  onAddToWishlist: (item: RecommendationCard) => void;
  onActionMenuOpenChange?: (open: boolean) => void;
  onMenuOpenChange?: (open: boolean) => void;
  onBeforeMenuToggle?: (nextOpen: boolean) => void;
};

const RecommendationCardActionMenu = ({
  item,
  onAddToWishlist,
  onActionMenuOpenChange,
  onMenuOpenChange,
  onBeforeMenuToggle,
}: RecommendationCardActionMenuProps) => {
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

  const updateMenuOpen = useCallback(
    (next: boolean) => {
      setMenuOpen(next);
      onActionMenuOpenChange?.(next);
      onMenuOpenChange?.(next);
    },
    [onActionMenuOpenChange, onMenuOpenChange],
  );
  const updateMenuOpenRef = useRef(updateMenuOpen);
  updateMenuOpenRef.current = updateMenuOpen;

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

      updateMenuOpenRef.current(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        updateMenuOpenRef.current(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleFavorite = () => {
    updateMenuOpen(false);
    onAddToWishlist(item);
  };

  const handleAddToList = () => {
    updateMenuOpen(false);
    onAddToWishlist(item);
  };

  const handleShare = async () => {
    updateMenuOpen(false);

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

  return (
    <>
      <div className="recommendation-card__action-dropdown">
        <button
          ref={actionButtonRef}
          type="button"
          className="recommendation-card__action"
          aria-label="Más opciones"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => {
            const next = !menuOpen;
            onBeforeMenuToggle?.(next);
            updateMenuOpen(next);
            if (next) {
              requestAnimationFrame(updateMenuPosition);
            }
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
    </>
  );
};

export default RecommendationCardActionMenu;
