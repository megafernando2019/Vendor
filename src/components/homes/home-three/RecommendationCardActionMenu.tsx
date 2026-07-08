"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current?.contains(target)) {
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

  const openMenu = () => {
    onBeforeMenuToggle?.(true);
    updateMenuOpen(true);
  };

  return (
    <div
      ref={dropdownRef}
      className={`recommendation-card__action-dropdown${
        menuOpen ? " recommendation-card__action-dropdown--open" : ""
      }`}
    >
      {menuOpen ? (
        <ul
          className="dropdown-menu dropdown-menu-end recommendation-card__action-menu recommendation-card__action-menu--icons recommendation-card__action-menu--inline show"
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
              className="recommendation-card__action-icon-btn"
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
              className="recommendation-card__action-icon-btn"
              aria-label="Compartir"
              onClick={handleShare}
            >
              <ShareIcon />
            </button>
          </li>
        </ul>
      ) : (
        <button
          type="button"
          className="recommendation-card__action"
          aria-label="Más opciones"
          aria-expanded={false}
          aria-haspopup="menu"
          onClick={openMenu}
        >
          <ActionMenuIcon />
        </button>
      )}
    </div>
  );
};

export default RecommendationCardActionMenu;
