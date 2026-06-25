"use client";
import { JSX, useState } from "react";
import SearchFormItems from "./SearchFormItems";

const form_data: number[] = [1, 2, 3, 4, 5, 6];

const SearchFormStiky = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchOpen, setSearchOpen] = useState(true);
  const toggleSearchOpen = () => setSearchOpen((prev) => !prev);

  return (
      <div className="tg-booking-form-sticky-bar pb-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                style={{
                  width: searchOpen ? "100%" : "79px",
                  transition: "width 0.2s ease-in-out",
                }}
                className="tg-booking-form-wrap shadow"
              >
                <div className="tab-content" id="nav-tabContent">
                  {form_data.map((item, index) => (
                    <div
                      key={item}
                      className={`tab-pane fade ${activeTab === index ? "show active" : ""}`}
                      id="nav-platform"
                    >
                      <div className="tg-booking-form-item">
                        <SearchFormItems
                          searchOpen={searchOpen}
                          onToggle={toggleSearchOpen}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default SearchFormStiky;
