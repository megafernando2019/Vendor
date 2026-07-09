"use client";

import type { RecommendationSectionConfig } from "@/utils/recommendations";

type RecommendationSectionNavProps = {
  sections: RecommendationSectionConfig[];
  activeSection: string;
  onSectionChange: (sectionKey: string) => void;
};

const RecommendationSectionNav = ({
  sections,
  activeSection,
  onSectionChange,
}: RecommendationSectionNavProps) => {
  if (sections.length === 0) {
    return (
      <p className="text-muted small mb-0">
        No hay categorías de recomendaciones disponibles.
      </p>
    );
  }

  return (
    <nav aria-label="Categorías de recomendaciones">
      <ul className="list-unstyled mb-0 recommendation-section-nav">
        {sections.map((section) => {
          const isActive = section.key === activeSection;

          return (
            <li key={section.key} className="recommendation-section-nav__item">
              <button
                type="button"
                className={`recommendation-section-nav__link${
                  isActive ? " recommendation-section-nav__link--active" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSectionChange(section.key)}
              >
                <span className="recommendation-section-nav__label">
                  {section.label}
                </span>
                <span className="recommendation-section-nav__count">
                  ({section.count})
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default RecommendationSectionNav;
