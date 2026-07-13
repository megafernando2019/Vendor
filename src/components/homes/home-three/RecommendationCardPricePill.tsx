"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RecommendationCard } from "@/utils/recommendations";
import {
  formatBreakdownAmount,
  formatPrice,
} from "./recommendationCardMediaShared";

type RecommendationCardPricePillProps = {
  item: RecommendationCard;
  dismissSignal?: number;
  variant?: "overlay" | "inline";
};

const RecommendationCardPricePill = ({
  item,
  dismissSignal = 0,
  variant = "overlay",
}: RecommendationCardPricePillProps) => {
  const pricePillRef = useRef<HTMLDivElement>(null);
  const priceTooltipRef = useRef<HTMLDivElement>(null);
  const hidePriceTooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const scrollListenerCleanupRef = useRef<(() => void) | null>(null);
  const tooltipOpenedAtDismissSignalRef = useRef(dismissSignal);
  const [tooltipRequested, setTooltipRequested] = useState(false);
  const priceTooltipOpen =
    tooltipRequested &&
    tooltipOpenedAtDismissSignalRef.current === dismissSignal;
  const isSoldOut = item.filteredDepartures.length === 0;
  const [priceTooltipPosition, setPriceTooltipPosition] = useState({
    top: 0,
    left: 0,
  });

  const updatePriceTooltipPosition = useCallback(() => {
    const pill = pricePillRef.current;
    if (!pill) return;

    const rect = pill.getBoundingClientRect();
    setPriceTooltipPosition({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const detachScrollListeners = useCallback(() => {
    scrollListenerCleanupRef.current?.();
    scrollListenerCleanupRef.current = null;
  }, []);

  const attachScrollListeners = useCallback(() => {
    detachScrollListeners();

    const handleScrollOrResize = () => updatePriceTooltipPosition();

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    scrollListenerCleanupRef.current = () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [detachScrollListeners, updatePriceTooltipPosition]);

  const openPriceTooltip = useCallback(() => {
    if (isSoldOut) return;

    if (hidePriceTooltipTimeoutRef.current) {
      clearTimeout(hidePriceTooltipTimeoutRef.current);
      hidePriceTooltipTimeoutRef.current = null;
    }

    requestAnimationFrame(updatePriceTooltipPosition);
    tooltipOpenedAtDismissSignalRef.current = dismissSignal;
    setTooltipRequested(true);
    attachScrollListeners();
  }, [attachScrollListeners, dismissSignal, isSoldOut, updatePriceTooltipPosition]);

  const closePriceTooltip = useCallback(() => {
    if (hidePriceTooltipTimeoutRef.current) {
      clearTimeout(hidePriceTooltipTimeoutRef.current);
    }

    hidePriceTooltipTimeoutRef.current = setTimeout(() => {
      setTooltipRequested(false);
      detachScrollListeners();
      hidePriceTooltipTimeoutRef.current = null;
    }, 80);
  }, [detachScrollListeners]);

  useEffect(() => {
    return () => {
      if (hidePriceTooltipTimeoutRef.current) {
        clearTimeout(hidePriceTooltipTimeoutRef.current);
      }
      detachScrollListeners();
    };
  }, [detachScrollListeners]);

  return (
    <>
      <div
        ref={pricePillRef}
        className={`recommendation-card__price-pill${
          variant === "inline" ? " recommendation-card__price-pill--inline" : ""
        }${isSoldOut ? " recommendation-card__price-pill--sold-out" : ""}`}
        onMouseEnter={isSoldOut ? undefined : openPriceTooltip}
        onMouseLeave={isSoldOut ? undefined : closePriceTooltip}
      >
        {!isSoldOut && (
          <span className="recommendation-card__price-label">Desde</span>
        )}
        <strong className="recommendation-card__price-value">
          {isSoldOut
            ? "Sold Out"
            : `${formatPrice(item.price, item.currency)} ${item.currency}`}
        </strong>
      </div>

      {!isSoldOut &&
        priceTooltipOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={priceTooltipRef}
            className="recommendation-card__price-tooltip show"
            style={{
              top: priceTooltipPosition.top,
              left: priceTooltipPosition.left,
            }}
            role="tooltip"
            onMouseEnter={openPriceTooltip}
            onMouseLeave={closePriceTooltip}
          >
            <p className="recommendation-card__price-tooltip-title">
              Desde: {formatPrice(item.price, item.currency)} {item.currency}
            </p>
            <dl className="recommendation-card__price-tooltip-list">
              <div className="recommendation-card__price-tooltip-row">
                <dt>Precio base:</dt>
                <dd>
                  {formatBreakdownAmount(item.dblAdtBase, item.currency)}
                </dd>
              </div>
              <div className="recommendation-card__price-tooltip-row">
                <dt>Impuestos:</dt>
                <dd>{formatBreakdownAmount(item.dblAdtTax, item.currency)}</dd>
              </div>
              <div className="recommendation-card__price-tooltip-row">
                <dt>Suplemento:</dt>
                <dd>
                  {formatBreakdownAmount(item.dblAdtSupplements, item.currency)}
                </dd>
              </div>
            </dl>
          </div>,
          document.body,
        )}
    </>
  );
};

export default RecommendationCardPricePill;
