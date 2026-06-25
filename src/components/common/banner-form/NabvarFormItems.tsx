"use client";
import Link from "next/link";
import menu_data from "@/data/MenuData";

interface FormItemsProps {
  searchOpen: boolean;
  onToggle: () => void;
}

const navLinks = menu_data.map((item) => ({
  label: item.title,
  href: item.link !== "#" ? item.link : (item.sub_menus?.[0]?.link ?? "#"),
}));

const NabvarFormItems = ({ searchOpen, onToggle }: FormItemsProps) => {
  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onToggle();
  };

  return (
    <nav
      className="banner-form-two banner-form-two-navbar"
      aria-label="Menú principal"
    >
      <div
        className={`tg-booking-form-input-group d-flex align-items-center banner-form-two-navbar-group${searchOpen ? "" : " banner-form-two-collapsed"}`}
      >
        <div className="tg-booking-form-search-btn flex-shrink-0">
          <button
            className="btn btn-dark rounded-circle p-2"
            type="button"
            onClick={handleToggleClick}
            aria-label={searchOpen ? "Ocultar menú" : "Mostrar menú"}
            aria-expanded={searchOpen}
          >
            <span>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                ariaHidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                  strokeWidth="2"
                  d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                />
              </svg>
            </span>
          </button>
        </div>

        <ul
          className="banner-form-two-navbar-menu banner-form-two-expandable list-unstyled mb-0"
          aria-hidden={!searchOpen}
        >
          {navLinks.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="tg-booking-add-input-field banner-form-two-navbar-link"
                tabIndex={searchOpen ? undefined : -1}
              >
                <span className="tg-booking-title-value">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NabvarFormItems;
