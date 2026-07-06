type RecommendationTourCardSkeletonProps = {
  layout?: "grid" | "list";
};

const RecommendationTourCardSkeleton = ({
  layout = "grid",
}: RecommendationTourCardSkeletonProps) => {
  return (
    <article
      className={`recommendation-card recommendation-card--skeleton${
        layout === "list" ? " recommendation-card--list" : ""
      }`}
      aria-hidden="true"
    >
      <div className="recommendation-card__media">
        <div className="recommendation-card-skeleton__image" />

        <span className="recommendation-card-skeleton__action" />
        <span className="recommendation-card-skeleton__price-pill" />
        <span className="recommendation-card__media-curve" aria-hidden="true" />
      </div>

      <div className="recommendation-card__body">
        <div className="recommendation-card-skeleton__title" />
        <div className="recommendation-card-skeleton__title recommendation-card-skeleton__title--short" />

        <div className="recommendation-card-skeleton__rating">
          <span className="recommendation-card-skeleton__stars" />
          <span className="recommendation-card-skeleton__rating-text" />
        </div>

        <div className="recommendation-card-skeleton__meta">
          <span className="recommendation-card-skeleton__meta-item" />
          <span className="recommendation-card-skeleton__meta-item" />
          <span className="recommendation-card-skeleton__meta-item" />
          <span className="recommendation-card-skeleton__meta-item" />
        </div>
      </div>
    </article>
  );
};

export default RecommendationTourCardSkeleton;
