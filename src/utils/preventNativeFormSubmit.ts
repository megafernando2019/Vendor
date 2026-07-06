import type { FormEvent } from "react";

/** Blocks native form navigation for client-only forms (named handler, not inline). */
export function preventNativeFormSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}
