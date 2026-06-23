/** Convierte URLs http a https para evitar contenido mixto (sin cambiar lógica de negocio). */
export function toHttpsAssetUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/^http:\/\//i, "https://");
}
