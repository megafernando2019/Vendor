import React from "react";
import type { StarRatingProps } from "@/src/interfaces/ui";

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <span key={i} className="fs-4" style={{ color: "#facc15" }}>
          ★
        </span>
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <span
          key={i}
          className="fs-4 position-relative d-inline-block"
          style={{ color: "#facc15" }}
        >
          <span style={{ color: "#d1d5db" }}>★</span>
          <span
            className="position-absolute top-2 start-0 overflow-hidden"
            style={{ width: "50%", color: "#facc15" }}
          >
            ★
          </span>
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="fs-4" style={{ color: "#d1d5db" }}>
          ★
        </span>
      );
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-start gap-2">
      <div className="d-flex">{stars}</div>
    </div>
  );
};

export default StarRating;