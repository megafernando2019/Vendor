"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { refreshWow } from "@/utils/wow";

const RESYNC_DELAYS_MS = [300, 800, 1500];

export default function useWow() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const runSync = async (recreate = false) => {
      if (cancelled) return;
      await refreshWow({ recreate });
    };

    void runSync(true);

    for (const delay of RESYNC_DELAYS_MS) {
      timeouts.push(
        setTimeout(() => {
          void runSync(false);
        }, delay),
      );
    }

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [pathname]);
}
