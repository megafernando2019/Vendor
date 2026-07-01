"use client";

import { useEffect, type DependencyList } from "react";
import { getWowInstance, syncWow } from "@/utils/wow";

export default function useWow(deps: DependencyList = []) {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    getWowInstance().then((instance) => {
      instance?.sync();
      timeoutId = setTimeout(() => instance?.sync(), 600);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, deps);
}

export { syncWow };
