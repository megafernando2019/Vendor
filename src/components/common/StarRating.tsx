import React from "react";
import type { StarRatingProps } from "@/interfaces/ui";

const FILLED_COLOR = "#facc15";
const EMPTY_COLOR = "#d1d5db";

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  className = "",
  starClassName = "fs-4",
}) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const starClasses = ["star-rating__star", starClassName]
      .filter(Boolean)
      .join(" ");

    if (rating >= i) {
      stars.push(
        <span
          key={i}
          className={`${starClasses} star-rating__star--full`}
          style={{ color: FILLED_COLOR }}
          aria-hidden="true"
        >
          ★
        </span>,
      );
      continue;
    }

    if (rating >= i - 0.5) {
      stars.push(
        <span
          key={i}
          className={`${starClasses} star-rating__star--half`}
          style={
            {
              "--star-filled": FILLED_COLOR,
              "--star-empty": EMPTY_COLOR,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          ★
        </span>,
      );
      continue;
    }

    stars.push(
      <span
        key={i}
        className={`${starClasses} star-rating__star--empty`}
        style={{ color: EMPTY_COLOR }}
        aria-hidden="true"
      >
        ★
      </span>,
    );
  }

  return (
    <div
      className={`star-rating d-inline-flex align-items-center ${className}`.trim()}
      role="img"
      aria-label={`Calificación: ${rating} de 5`}
    >
      {stars}
    </div>
  );
};

export default StarRating;
