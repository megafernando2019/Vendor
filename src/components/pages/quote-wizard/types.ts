export type WizardStep = "fecha" | "habitaciones" | "asistencia" | "opcionales";

export const WIZARD_STEPS: {
  id: WizardStep;
  label: string;
  icon: string;
}[] = [
  { id: "fecha", label: "Fecha", icon: "fa-calendar-alt" },
  { id: "habitaciones", label: "Habitaciones", icon: "fa-bed" },
  { id: "asistencia", label: "Asistencia", icon: "fa-shield-alt" },
  { id: "opcionales", label: "Opcionales", icon: "fa-bus" },
];

export const DETAIL_BUTTONS = [
  "ITINERARIO",
  "INCLUYE",
  "NO INCLUYE",
  "VISAS",
] as const;

export type DetailButton = (typeof DETAIL_BUTTONS)[number];

export type QuoteWizardDetailKey =
  | "itinerary"
  | "include"
  | "not_include"
  | "visas";

export const DETAIL_BUTTON_CONFIG: Record<
  DetailButton,
  { title: string; key: QuoteWizardDetailKey }
> = {
  ITINERARIO: { title: "Itinerario", key: "itinerary" },
  INCLUYE: { title: "Incluye", key: "include" },
  "NO INCLUYE": { title: "No incluye", key: "not_include" },
  VISAS: { title: "Visas", key: "visas" },
};
