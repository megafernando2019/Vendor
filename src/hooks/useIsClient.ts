import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** True on the client, false during SSR — avoids a mount effect + extra render. */
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
