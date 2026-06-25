"use client";
import { useState } from "react";
import NabvarFormItems from "./NabvarFormItems";
import SearchFormItems from "./SearchFormItems";

const COLLAPSED_SIZE = "56px";
const EXPANDED_WIDTH = `calc(100% - ${COLLAPSED_SIZE} - 16px)`;

const BookingFormsSticky = () => {
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

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
      if (next) setNavbarOpen(false);
      return next;
    });
  };

  return (
    <>
      <div className="tg-booking-form-sticky-bar pb-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="booking-forms-sticky-row">
                <div
                  className={`booking-forms-sticky-panel booking-forms-sticky-panel--navbar${navbarOpen ? "" : " is-collapsed"}`}
                  style={{
                    width: navbarOpen ? EXPANDED_WIDTH : COLLAPSED_SIZE,
                  }}
                >
                  <div className="tg-booking-form-wrap">
                    <div className="tg-booking-form-item">
                      <NabvarFormItems
                        searchOpen={navbarOpen}
                        onToggle={toggleNavbar}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`booking-forms-sticky-panel booking-forms-sticky-panel--search${searchOpen ? "" : " is-collapsed"}`}
                  style={{
                    width: searchOpen ? EXPANDED_WIDTH : COLLAPSED_SIZE,
                  }}
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
      <h2 className="text-secondary mt-20 text-center pb-105">
        Hazlo fácil. Hazlo rápido. Hazlo a tu manera
      </h2>
    </>
  );
};

export default BookingFormsSticky;
