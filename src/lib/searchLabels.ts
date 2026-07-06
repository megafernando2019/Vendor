import type { ItemSearch } from "@/redux/slices/searchSlice";
import { formatPassengersLabel } from "@/lib/searchValidation";

const DESTINATION_LABELS: Record<number, string> = {
  3: "Europa",
  5: "Canada",
  6: "Estados Unidos",
  7: "Medio Oriente",
  8: "México",
  9: "Sudamerica",
  10: "Centro América",
  11: "Asia",
  12: "Caribe",
};

function getDestinationLabel(destinationId: number): string {
  return DESTINATION_LABELS[destinationId] ?? "Destino";
}

export function formatSearchCriteriaSummary(item: ItemSearch): string {
  const parts = [
    getDestinationLabel(item.destination),
    formatPassengersLabel(item.passengers),
    `${item.startRange} — ${item.endRange}`,
  ];

  const keyword = item.search?.trim();
  if (keyword) {
    parts.push(`"${keyword}"`);
  }

  return parts.join(" · ");
}
