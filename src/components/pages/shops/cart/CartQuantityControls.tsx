type CartQuantityControlsProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

function preventFormDefault(e: React.FormEvent) {
  e.preventDefault();
}

const CartQuantityControls = ({
  quantity,
  onDecrease,
  onIncrease,
}: CartQuantityControlsProps) => (
  <div className="tg-product-details-quantity">
    <div className="tg-booking-quantity-item">
      <button
        type="button"
        onClick={onDecrease}
        className="decrement"
        aria-label="Decrease quantity"
      >
        <svg
          width="14"
          height="2"
          viewBox="0 0 14 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <input
        className="tg-quantity-input"
        type="text"
        onChange={preventFormDefault}
        value={quantity}
        readOnly
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={onIncrease}
        className="increment"
        aria-label="Increase quantity"
      >
        <svg
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.22 7H13.38"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.30 13V1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
);

export default CartQuantityControls;
