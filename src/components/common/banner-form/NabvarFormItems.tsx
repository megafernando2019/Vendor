"use client";
import Link from "next/link";
import menu_data from "@/data/MenuData";
import { getNavMenuIcon } from "./navMenuIcons";

interface FormItemsProps {
  searchOpen: boolean;
  showItems?: boolean;
  onToggle: () => void;
}

const navLinks = menu_data.map((item) => ({
  id: item.id,
  label: item.title,
  href: item.link !== "#" ? item.link : (item.sub_menus?.[0]?.link ?? "#"),
}));

const NabvarFormItems = ({
  searchOpen,
  showItems = searchOpen,
  onToggle,
}: FormItemsProps) => {
  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onToggle();
  };

  const menuVisible = searchOpen && showItems;

  return (
    <nav
      className="banner-form-two banner-form-two-navbar"
      aria-label="Menú principal"
    >
      <div
        className={`tg-booking-form-input-group align-items-center banner-form-two-navbar-group${searchOpen ? "" : " banner-form-two-collapsed"}`}
      >
        <div className="tg-booking-form-search-btn flex-shrink-0">
          <button
            className="btn btn-dark rounded-circle banner-form-two-icon-btn"
            type="button"
            onClick={handleToggleClick}
            aria-label={searchOpen ? "Ocultar menú" : "Mostrar menú"}
            aria-expanded={searchOpen}
          >
            <svg
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
                d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
              />
            </svg>
          </button>
          <ul
            className={`banner-form-two-navbar-menu banner-form-two-expandable list-unstyled mb-0${menuVisible ? " banner-form-two-expandable--visible" : ""}`}
            aria-hidden={!menuVisible}
          >
            {navLinks.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="tg-booking-add-input-field banner-form-two-navbar-link"
                  title={item.label}
                  aria-label={item.label}
                  tabIndex={menuVisible ? undefined : -1}
                >
                  <span className="banner-form-two-navbar-link-icon">
                    {getNavMenuIcon(item.id)}
                  </span>
                  <span className="tg-booking-title-value banner-form-two-navbar-link-text">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NabvarFormItems;
