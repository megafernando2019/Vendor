import { useEffect, useRef, useState } from "react";

export const PANEL_RESIZE_MS = 350;

export const useDelayedPanelItems = (isOpen: boolean) => {
  const [showItems, setShowItems] = useState(isOpen);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setShowItems(false);
      timeoutId = setTimeout(() => setShowItems(true), PANEL_RESIZE_MS);
    } else {
      setShowItems(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  return showItems;
};
