type RecommendationTourCardSkeletonProps = {
  layout?: "grid" | "list";
};

const RecommendationTourCardSkeleton = ({
  layout = "grid",
}: RecommendationTourCardSkeletonProps) => {
  const isListLayout = layout === "list";

  if (isListLayout) {
    return (
      <article
        className="card recommendation-card recommendation-card--list recommendation-card--skeleton border-0 h-100"
        aria-hidden="true"
      >
        <div className="row g-0 flex-grow-1 align-items-stretch">
          <div className="col-12 col-lg-3 recommendation-card__list-col recommendation-card__list-col--media">
            <div className="recommendation-card__list-media-stack d-flex flex-column">
              <div className="recommendation-card__list-media-wrap position-relative flex-grow-1">
                <div className="recommendation-card__media recommendation-card__media--list">
                  <div className="recommendation-card-skeleton__image" />
                  <span className="recommendation-card-skeleton__action" />
                </div>
              </div>

              <div className="recommendation-card__list-price d-flex justify-content-center p-3">
                <span className="recommendation-card-skeleton__price-pill recommendation-card-skeleton__price-pill--inline" />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 recommendation-card__list-col recommendation-card__list-col--meta">
            <div className="card-body recommendation-card__body recommendation-card__body--list h-100 d-flex flex-column p-3 p-md-4">
              <div className="recommendation-card-skeleton__title" />
              <div className="recommendation-card-skeleton__title recommendation-card-skeleton__title--short mb-3" />

              <div className="recommendation-card-skeleton__rating mb-3">
                <span className="recommendation-card-skeleton__stars" />
                <span className="recommendation-card-skeleton__rating-text" />
              </div>

              <div className="recommendation-card-skeleton__meta mt-auto">
                <span className="recommendation-card-skeleton__meta-item" />
                <span className="recommendation-card-skeleton__meta-item" />
                <span className="recommendation-card-skeleton__meta-item" />
                <span className="recommendation-card-skeleton__meta-item" />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5 recommendation-card__list-col recommendation-card__list-col--departures">
            <div className="card-body recommendation-card__body recommendation-card__body--list h-100 d-flex flex-column p-3 p-md-4">
              <div className="recommendation-card-skeleton__title recommendation-card-skeleton__title--short mb-3" />
              <div className="recommendation-card-skeleton__departures-table" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="recommendation-card recommendation-card--skeleton"
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
