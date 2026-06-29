"use client";

import { useState } from "react";
import NabvarFormItems from "./NabvarFormItems";
import SearchFormItems from "./SearchFormItems";
import { useDelayedPanelItems } from "@/hooks/useDelayedPanelItems";

const BookingFormsSticky = () => {
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const navbarShowItems = useDelayedPanelItems(navbarOpen);

  const toggleNavbar = () => {
    setNavbarOpen((prev) => {
      const next = !prev;
      if (next) setSearchOpen(false);
      return next;
    });
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setNavbarOpen(false);
      } else {
        setNavbarOpen(true);
      }
      return next;
    });
  };

  return (
    <div className="tg-booking-form-sticky-bar pb-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div
              className={`booking-forms-sticky-row d-flex justify-content-between${
                searchOpen ? " is-search-active" : ""
              }${navbarOpen ? " is-navbar-active" : ""}`}
            >
              <div
                className={`booking-forms-sticky-panel booking-forms-sticky-panel--navbar${navbarOpen ? " is-expanded" : " is-collapsed"}`}
              >
                <div className="tg-booking-form-wrap">
                  <div className="tg-booking-form-item">
                    <NabvarFormItems
                      searchOpen={navbarOpen}
                      showItems={navbarShowItems}
                      onToggle={toggleNavbar}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`booking-forms-sticky-panel booking-forms-sticky-panel--search${searchOpen ? " is-expanded" : " is-collapsed"}`}
              >
                <div className="tg-booking-form-wrap">
                  <div className="tg-booking-form-item">
                    <SearchFormItems
                      searchOpen={searchOpen}
                      onToggle={toggleSearch}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFormsSticky;

