import type { RecommendationCard } from "@/utils/recommendations";

const DaysIcon = () => (
  <svg
    className="recommendation-card__info-icon-svg"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
    />
  </svg>
);

const PlaneIcon = () => (
  <svg
    className="recommendation-card__info-icon-svg"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2-7h-4l-2 2h-3l2-4l-2-4h3l2 2h4l-2-7h3l4 7"
    />
  </svg>
);

type RecommendationTourCardMetaProps = {
  item: RecommendationCard;
  layout?: "grid" | "list";
};

const RecommendationTourCardMeta = ({
  item,
  layout = "grid",
}: RecommendationTourCardMetaProps) => {
  const metaTable = (
    <table className="recommendation-card__meta-table">
      <tbody>
        <tr>
          <td>
            <span className="recommendation-card__mt">MT{item.clv}</span>
          </td>
          <td>
            <span className="recommendation-card__info">
              <DaysIcon />
              {item.days} días
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span className="recommendation-card__info">
              <PlaneIcon />
              {item.departuresCount} salidas
            </span>
          </td>
          <td>
            <span className="recommendation-card__info">
              <i className="fa-regular fa-moon" aria-hidden="true" />
              {item.nights} noches
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );

  if (layout === "list") {
    return (
      <div className="recommendation-card__meta-table-wrap">{metaTable}</div>
    );
  }

  return metaTable;
};

export default RecommendationTourCardMeta;
