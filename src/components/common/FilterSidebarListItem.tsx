"use client";

import type { ReactNode } from "react";

interface FilterSidebarListItemProps {
  onSelect: () => void;
  children: ReactNode;
  variant?: "filter" | "category";
}

export function FilterSidebarListItem({
  onSelect,
  children,
  variant = "filter",
}: FilterSidebarListItemProps) {
  const buttonClass =
    variant === "category"
      ? "tg-filter-list-item-btn tg-blog-categories-list-item-btn"
      : "tg-filter-list-item-btn";

  return (
    <li>
      <button type="button" className={buttonClass} onClick={onSelect}>
        {children}
      </button>
    </li>
  );
}
