"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { RecommendationCard } from "@/utils/recommendations";
import { createProgramList } from "@/utils/programLists";
import {
  ActionMenuIcon,
  BookmarkIcon,
  ShareIcon,
  CompareIcon
} from "./recommendationCardMediaShared";
import RecommendationShareModal from "./RecommendationShareModal";
import RecommendationAddToListModal from "./RecommendationAddToListModal";
import RecommendationCreateListModal from "./RecommendationCreateListModal";
import RecommendationCompareModal from "./RecommendationCompareModal";

type RecommendationCardActionMenuProps = {
  item: RecommendationCard;
  compareOptions?: RecommendationCard[];
  onAddToWishlist: (item: RecommendationCard) => void;
  onActionMenuOpenChange?: (open: boolean) => void;
  onMenuOpenChange?: (open: boolean) => void;
  onBeforeMenuToggle?: (nextOpen: boolean) => void;
};

const RecommendationCardActionMenu = ({
  item,
  compareOptions,
  onAddToWishlist,
  onActionMenuOpenChange,
  onMenuOpenChange,
  onBeforeMenuToggle,
}: RecommendationCardActionMenuProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [addToListModalOpen, setAddToListModalOpen] = useState(false);
  const [createListModalOpen, setCreateListModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

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
        if (
          addToListModalOpen ||
          createListModalOpen ||
          compareModalOpen ||
          shareModalOpen
        ) {
          return;
        }
        updateMenuOpenRef.current(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [
    addToListModalOpen,
    compareModalOpen,
    createListModalOpen,
    menuOpen,
    shareModalOpen,
  ]);

  const handleCompare = () => {
    updateMenuOpen(false);
    setCompareModalOpen(true);
  };

  const handleAddToList = () => {
    updateMenuOpen(false);
    setAddToListModalOpen(true);
  };

  const handleAddToFavorites = () => {
    setAddToListModalOpen(false);
    onAddToWishlist(item);
  };

  const handleCreateList = () => {
    setAddToListModalOpen(false);
    setCreateListModalOpen(true);
  };

  const handleSaveNewList = async (name: string) => {
    const res = await fetch("/api/list/createListAgency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    let data: { success?: boolean; message?: string } | null = null;
    try {
      data = (await res.json()) as { success?: boolean; message?: string };
    } catch {
      data = null;
    }

    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "No se pudo crear la lista.");
    }

    const programId = item.id ?? item.clv;
    createProgramList(name, programId);
    setCreateListModalOpen(false);
    toast.success(`Lista "${name}" creada y programa agregado.`, {
      position: "top-right",
    });
  };

  const handleShare = () => {
    updateMenuOpen(false);
    setShareModalOpen(true);
  };

  const openMenu = () => {
    onBeforeMenuToggle?.(true);
    updateMenuOpen(true);
  };

  return (
    <>
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
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className="recommendation-card__action-icon-btn"
                aria-label="Comparar"
                onClick={handleCompare}
              >
                <CompareIcon />
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

      {addToListModalOpen ? (
        <RecommendationAddToListModal
          item={item}
          onClose={() => setAddToListModalOpen(false)}
          onAddToFavorites={handleAddToFavorites}
          onCreateList={handleCreateList}
        />
      ) : null}

      {shareModalOpen ? (
        <RecommendationShareModal
          item={item}
          onClose={() => setShareModalOpen(false)}
        />
      ) : null}

      {createListModalOpen ? (
        <RecommendationCreateListModal
          onClose={() => setCreateListModalOpen(false)}
          onSave={handleSaveNewList}
        />
      ) : null}

      {compareModalOpen ? (
        <RecommendationCompareModal
          item={item}
          compareOptions={compareOptions}
          onClose={() => setCompareModalOpen(false)}
        />
      ) : null}
    </>
  );
};

export default RecommendationCardActionMenu;
