import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(dirty: string | undefined | null): string {
  if (dirty == null || dirty === "") return "";
  return DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
}
