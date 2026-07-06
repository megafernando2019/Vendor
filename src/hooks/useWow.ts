"use client";

import { useEffect } from "react";
import { getWowInstance } from "@/utils/wow";

export default function useWow() {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    getWowInstance().then((instance) => {
      instance?.sync();
      timeoutId = setTimeout(() => instance?.sync(), 600);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
}
