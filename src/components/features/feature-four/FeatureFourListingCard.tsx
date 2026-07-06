import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/redux/features/productSlice";

type FeatureFourListingCardProps = {
  item: Product;
  onAddToWishlist: (item: Product) => void;
};

const FeatureFourListingCard = ({
  item,
  onAddToWishlist,
}: FeatureFourListingCardProps) => (
  <div className="col-12">
    <div className="tg-listing-card-item tg-listing-4-card-item mb-25">
      <div className="tg-listing-card-thumb tg-listing-2-card-thumb mb-15 fix p-relative">
        <Link href="/tour-details-2">
          <Image className="tg-card-border w-100" src={item.thumb} alt="listing" />
          {item.tag && (
            <span className="tg-listing-item-price-discount shape">{item.tag}</span>
          )}
          {item.featured && (
            <span className="tg-listing-item-price-discount shape-3">
              <svg
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.60 1L0.60 8.2H6L5.40 13L11.40 5.8H6L6.60 1Z"
                  stroke="white"
                  strokeWidth="0.857143"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item.featured}
            </span>
          )}
          {item.offer && (
            <span className="tg-listing-item-price-discount offer-btm shape-2">
              {item.offer}
            </span>
          )}
        </Link>
      </div>
      <FeatureFourListingCardBody item={item} onAddToWishlist={onAddToWishlist} />
    </div>
  </div>
);

type FeatureFourListingCardBodyProps = {
  item: Product;
  onAddToWishlist: (item: Product) => void;
};

const FeatureFourListingCardBody = ({
  item,
  onAddToWishlist,
}: FeatureFourListingCardBodyProps) => (
  <div className="tg-listing-card-content mb-15 p-relative">
    <div className="d-flex justify-content-between">
      <div className="mr-30">
        <h4 className="tg-listing-card-title mb-5">
          <Link href="/tour-details-2">{item.title}</Link>
        </h4>
        <FeatureFourListingCardMeta item={item} />
        <div className="tg-listing-card-review mb-10">
          <span className="tg-listing-rating-icon">
            <i className="fa-sharp fa-solid fa-star"></i>
          </span>
          <span className="tg-listing-rating-icon">
            <i className="fa-sharp fa-solid fa-star"></i>
          </span>
          <span className="tg-listing-rating-icon">
            <i className="fa-sharp fa-solid fa-star"></i>
          </span>
          <span className="tg-listing-rating-icon">
            <i className="fa-sharp fa-solid fa-star"></i>
          </span>
          <span className="tg-listing-rating-icon">
            <i className="fa-sharp fa-solid fa-star"></i>
          </span>
          <span className="tg-listing-rating-percent">
            ({item.total_review} Reviews)
          </span>
        </div>
      </div>
      <div className="tg-listing-item-wishlist">
        <button
          type="button"
          onClick={() => onAddToWishlist(item)}
          style={{ cursor: "pointer" }}
          aria-label="Add to wishlist"
        >
          <svg
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.52 16.34C10.23 16.44 9.77 16.44 9.48 16.34C7.07 15.52 1.67 12.075 1.67 6.24C1.67 3.67 3.74 1.58 6.30 1.58C7.82 1.58 9.16 2.32 10 3.45C10.84 2.32 12.19 1.58 13.70 1.58C16.26 1.58 18.33 3.67 18.33 6.24C18.33 12.075 12.93 15.52 10.52 16.34Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
    <span className="tg-listing-map-list-border mb-15"></span>
    <p className="tg-listing-map-list-para mb-25">{item.desc}</p>
    <div className="tg-listing-avai d-flex align-items-center justify-content-between">
      <div className="tg-listing-2-price">
        {item.delete_price && <del>${item.delete_price}</del>}
        <span className="new">${item.price}</span>
        <span className="shift">/night</span>
      </div>
      <Link className="tg-listing-avai-btn" href="/tour-details-2">
        Check Availability
      </Link>
    </div>
  </div>
);

const FeatureFourListingCardMeta = ({ item }: { item: Product }) => (
  <div className="destination">
    <span className="tg-listing-card-duration-map d-inline-block">
      <svg
        width="13"
        height="16"
        viewBox="0 0 13 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.33 6.71C12.33 11.23 6.56 15.11 6.56 15.11C6.56 15.11 0.78 11.23 0.78 6.71C0.78 5.16 1.39 3.68 2.47 2.59C3.55 1.50 5.02 0.89 6.56 0.89C8.09 0.89 9.56 1.50 10.64 2.59C11.72 3.68 12.33 5.16 12.33 6.71Z"
          stroke="currentColor"
          strokeWidth="1.15556"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.56 8.65C7.62 8.65 8.48 7.78 8.48 6.71C8.48 5.636 7.62 4.77 6.56 4.77C5.49 4.77 4.63 5.636 4.63 6.71C4.63 7.78 5.49 8.65 6.56 8.65Z"
          stroke="currentColor"
          strokeWidth="1.15556"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {item.location}
    </span>
    <span className="tg-listing-card-duration-map d-inline-block">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.51 15.29C1.33 15.29 1.16 15.2 1.07 15.11C0.98 14.93 0.89 14.84 0.89 14.67C0.89 13.42 1.24 12.18 1.87 11.02C2.49 9.96 3.47 8.98 4.53 8.36C4.09 7.82 3.73 7.11 3.56 6.4C3.47 5.69 3.47 4.89 3.64 4.27C3.82 3.56 4.27 2.84 4.71 2.31C5.24 1.78 5.87 1.33 6.49 1.16C7.02 0.98 7.56 0.89 8.09 0.89C8.27 0.89 8.53 0.89 8.71 0.89C9.42 0.98 10.13 1.24 10.76 1.69C11.38 2.13 11.822 2.67 12.18 3.29C12.53 3.91 12.71 4.62 12.71 5.42C12.71 6.49 12.36 7.56 11.64 8.36C12.18 8.71 12.71 9.07 13.24 9.51C13.96 10.22 14.40 10.93 14.84 11.82C15.20 12.71 15.38 13.6 15.38 14.58C15.38 14.76 15.29 14.93 15.20 15.02C15.11 15.11 14.93 15.2 14.76 15.2C14.67 15.2 14.58 15.2 14.49 15.11C14.40 15.11 14.31 15.02 14.31 14.93C14.222 14.84 14.222 14.84 14.13 14.76C14.13 14.67 14.04 14.58 14.04 14.49C14.04 13.69 13.87 12.98 13.60 12.27C13.33 11.56 12.89 10.93 12.27 10.4C11.73 9.96 11.20 9.51 10.58 9.24C9.87 9.69 9.07 9.96 8.09 9.96C7.20 9.96 6.31 9.69 5.60 9.24C4.62 9.69 3.73 10.4 3.11 11.38C2.49 12.36 2.13 13.42 2.13 14.58C2.13 14.76 2.04 14.93 1.96 15.02C1.87 15.2 1.69 15.29 1.51 15.29ZM8.09 2.22C7.47 2.22 6.84 2.4 6.31 2.76C5.69 3.11 5.33 3.64 5.07 4.18C4.80 4.8 4.71 5.42 4.89 6.13C4.98 6.76 5.33 7.38 5.78 7.82C6.22 8.27 6.84 8.62 7.47 8.71C7.64 8.71 7.91 8.8 8.09 8.8C8.53 8.8 8.98 8.71 9.33 8.53C9.96 8.27 10.40 7.91 10.84 7.29C11.20 6.76 11.38 6.13 11.38 5.51C11.38 4.62 11.022 3.82 10.40 3.2C9.78 2.49 8.98 2.22 8.09 2.22Z"
          fill="#353844"
        />
      </svg>
      {item.guest}
    </span>
    <span className="tg-listing-card-duration-map d-inline-block">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 3.73V8L10.84 9.42M15.11 8C15.11 11.93 11.93 15.11 8 15.11C4.07 15.11 0.89 11.93 0.89 8C0.89 4.07 4.07 0.89 8 0.89C11.93 0.89 15.11 4.07 15.11 8Z"
          stroke="#353844"
          strokeWidth="1.06667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {item.duration}
    </span>
  </div>
);

export default FeatureFourListingCard;
