import type { RecommendationCard } from "@/utils/recommendations";

export type CompareProgramContext = {
  program: RecommendationCard;
  similar: RecommendationCard | null;
  selectionOptions: RecommendationCard[];
  defaultSelection: RecommendationCard | null;
};

export function buildCompareProgramContext(
  current: RecommendationCard,
  options: RecommendationCard[] = [],
): CompareProgramContext {
  const pool =
    options.length > 0
      ? options
      : [current];

  const others = pool.filter((entry) => entry.clv !== current.clv);
  const similar =
    others.find((entry) => entry.category === current.category) ??
    others[0] ??
    null;
  const selectionOptions = others.length > 0 ? others : [current];
  const defaultSelection =
    selectionOptions.find((entry) => entry.clv !== similar?.clv) ??
    selectionOptions[0] ??
    null;

  return {
    program: current,
    similar,
    selectionOptions,
    defaultSelection,
  };
}

export function formatCompareProgramLabel(item: RecommendationCard) {
  return `MT${item.clv} - ${item.title}`;
}
