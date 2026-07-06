/** Accept only same-origin relative paths to prevent open redirects. */
export function getSafeCallbackUrl(url: string | null | undefined): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) {
    return "/";
  }
  return url;
}
