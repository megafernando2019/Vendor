"use client";

import { useMemo } from "react";
import type { PromotionFiltersProps } from "@/interfaces/disponibilidad-components";

export default function PromotionFilters({
  options,
  selected,
  onChange,
}: PromotionFiltersProps) {
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  if (options.length === 0) {
    return null;
  }

  const togglePromotion = (key: string) => {
    if (selectedSet.has(key)) {
      onChange(selected.filter((value) => value !== key));
      return;
    }

    onChange([...selected, key]);
  };

  return (
    <div className="promotion-filters w-100">
      <span className="tg-filter-border d-block mt-4 mb-4" aria-hidden="true" />

      <h5 className="promotion-filters__title mb-3">Promociones</h5>

      <ul className="list-unstyled d-flex flex-column gap-2 mb-0 promotion-filters__list">
        {options.map((option) => {
          const inputId = `promotion-filter-${option.key}`;
          const isChecked = selectedSet.has(option.key);

          return (
            <li key={option.key}>
              <label
                htmlFor={inputId}
                className="promotion-filters__item d-flex align-items-start gap-2 mb-0"
              >
                <input
                  id={inputId}
                  type="checkbox"
                  className="tg-checkbox mt-1"
                  checked={isChecked}
                  onChange={() => togglePromotion(option.key)}
                />
                <span className="promotion-filters__label">
                  <span className="d-block">{option.name}</span>
                  <span className="promotion-filters__count text-muted small">
                    {option.count} tour{option.count === 1 ? "" : "s"}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
