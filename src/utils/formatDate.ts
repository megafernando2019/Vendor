import { format } from "date-fns";
import { es } from "date-fns/locale";

export function parseDepartureDate(dateStr: string): Date {
  const cleanDate = dateStr.split("T")[0];
  const [y, m, d] = cleanDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Ej: Miércoles 30 de Septiembre de 2026 */
export function formatSpanishLongDate(date: string | Date): string {
  const parsed = typeof date === "string" ? parseDepartureDate(date) : date;
  const weekday = capitalizeWord(format(parsed, "EEEE", { locale: es }));
  const day = format(parsed, "d", { locale: es });
  const month = capitalizeWord(format(parsed, "MMMM", { locale: es }));
  const year = format(parsed, "yyyy", { locale: es });
  return `${weekday} ${day} de ${month} de ${year}`;
}
