import type { ReactNode } from "react";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

export interface StarRatingProps {
  rating: number;
}

export interface TabItem {
  key: string;
  label: string;
  children: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  /** ID del panel con scroll interno (para infinite scroll) */
  contentScrollId?: string;
  /** Clases extra o sustitutas para el panel de contenido */
  panelClassName?: string;
  /** horizontal: pestañas arriba; vertical: pestañas a la izquierda */
  layout?: "horizontal" | "vertical";
}

export interface NavItem {
  route: string;
  label: string;
}

export interface NavProps {
  items: NavItem[];
}

export type FAQQuestions = Record<string, string>;
export type FAQIconMap = Record<string, string>;

export interface FAQData {
  Iconos: FAQIconMap;
  [category: string]: FAQQuestions | FAQIconMap;
}

export interface FrequentlyAskedQuestionsProps {
  data?: FAQData;
}
