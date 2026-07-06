"use client";
import { JSX, useState } from "react";
import BannerFormTwo from "./BannerFormTwo";

interface TabData {
   title: string;
   icon: JSX.Element;
}

const tab_title: TabData[] = [
   {
      icon: (<> <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M16.5 2.5L8.8 10.2M16.5 2.5L11.6 16.5L8.8 10.2M16.5 2.5L2.5 7.4L8.8 10.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg></>),
      title: "Tour",
   },
   {
      icon: (<><svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M1.5 17.5H14.3M11.9 7.1H9.5M12.7 10.3H9.5M12.7 13.5H9.5M3.1 17.5V2.46C3.1 1.84 3.48 1.5 4.06 1.5C5.40 1.5 6.07 1.5 6.63 1.588C8.13 1.83 9.52 2.53 10.59 3.61C11.67 4.68 12.37 6.07 12.61 7.57C12.7 8.13 12.7 8.80 12.7 10.14V17.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg></>),
      title: "Hotel",
   },
   {
      icon: (<><svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M6.90 4.07L6.90 3.06C6.90 2.38 7.17 1.73 7.65 1.25C8.13 0.77 8.78 0.5 9.46 0.5C10.874 0.5 12.017 1.64 12.017 3.05V4.07C14.08 4.68 15.85 6.02 17.009 7.83C18.17 9.64 18.64 11.81 18.33 13.94H0.59C0.28 11.81 0.75 9.64 1.91 7.83C3.07 6.02 4.84 4.69 6.90 4.07H6.90ZM1.14 15.22H17.78C17.95 15.22 18.11 15.29 18.23 15.41C18.35 15.53 18.42 15.69 18.42 15.86C18.42 16.03 18.35 16.19 18.23 16.31C18.11 16.43 17.95 16.5 17.78 16.5H1.14C0.97 16.5 0.81 16.43 0.69 16.31C0.57 16.19 0.50 16.03 0.50 15.86C0.50 15.69 0.57 15.53 0.69 15.41C0.81 15.29 0.97 15.22 1.14 15.22ZM1.78 12.66H17.14C17.14 11.65 16.94 10.65 16.56 9.72C16.17 8.79 15.60 7.94 14.89 7.23C14.18 6.52 13.33 5.95 12.40 5.56C11.47 5.18 10.47 4.98 9.46 4.98C8.45 4.98 7.45 5.18 6.52 5.56C5.59 5.95 4.74 6.52 4.03 7.23C3.32 7.94 2.75 8.79 2.37 9.72C1.98 10.65 1.78 11.65 1.78 12.66ZM10.737 3.7V3.05C10.737 2.72 10.60 2.39 10.364 2.15C10.13 1.91 9.80 1.78 9.46 1.78C9.12 1.78 8.80 1.91 8.56 2.15C8.32 2.39 8.18 2.72 8.18 3.06V3.7H10.737Z" fill="currentColor" />
      </svg></>),
      title: "Restaurant",
   },
   {
      icon: (<><svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M6.5 17.5V9.5H11.5V17.5M1.5 7.1L9 1.5L16.5 7.1V15.9C16.5 16.32 16.32 16.73 16.01 17.03C15.70 17.33 15.28 17.5 14.83 17.5H3.17C2.72 17.5 2.30 17.33 1.99 17.03C1.68 16.73 1.5 16.32 1.5 15.9V7.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg></>),
      title: "Rental",
   },
   {
      icon: (<><svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M16.5 1.5L10.02 8.625L6.61 4.875L1.5 10.5M16.5 1.5H12.41M16.5 1.5L16.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg></>),
      title: "Activity",
   },
   {
      icon: (<> <svg width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M4.21 0.5C3.46 0.5 2.76 0.87 2.35 1.48L0.78 3.77C0.60 4.04 0.50 4.35 0.50 4.68V8.32C0.50 8.56 0.58 8.80 0.73 9C0.89 9.19 1.10 9.33 1.34 9.39L2.80 9.75C2.91 10.24 3.18 10.69 3.58 11C3.98 11.32 4.48 11.50 5 11.5C6.04 11.5 6.91 10.80 7.16 9.85H12.40C12.65 10.80 13.52 11.5 14.56 11.5C15.60 11.5 16.47 10.80 16.72 9.85H17.375C17.99 9.85 18.5 9.35 18.5 8.75V6.74C18.50 6.25 18.33 5.77 18.02 5.39C17.71 5 17.28 4.73 16.80 4.61L13.75 3.85L11.56 1.29C11.35 1.04 11.08 0.84 10.79 0.71C10.49 0.57 10.163 0.50 9.83 0.5H4.21ZM4.21 1.6H6.69V3.8H2.12L3.28 2.10V2.08C3.38 1.93 3.52 1.81 3.68 1.73C3.84 1.64 4.03 1.60 4.21 1.6ZM7.81 1.6H9.83C10.17 1.6 10.48 1.74 10.70 2L12.24 3.8H7.81V1.6ZM1.63 4.9H13.37L16.53 5.67C16.774 5.73 16.99 5.87 17.14 6.06C17.30 6.26 17.38 6.49 17.375 6.74V8.75H16.72C16.47 7.80 15.60 7.1 14.56 7.1C13.52 7.1 12.65 7.80 12.40 8.75H7.16C6.91 7.80 6.04 7.1 5 7.1C4 7.1 3.17 7.74 2.87 8.63L1.63 8.321V4.9ZM5 8.2C5.63 8.2 6.13 8.69 6.13 9.3C6.13 9.91 5.63 10.4 5 10.4C4.37 10.4 3.88 9.91 3.88 9.3C3.88 8.69 4.37 8.2 5 8.2ZM14.56 8.2C15.19 8.2 15.69 8.69 15.69 9.3C15.69 9.91 15.19 10.4 14.56 10.4C13.93 10.4 13.44 9.91 13.44 9.3C13.44 8.69 13.93 8.2 14.56 8.2Z" fill="currentColor" />
      </svg></>),
      title: "Car Rental",
   },
];

const form_data: number[] = [1, 2, 3, 4, 5, 6];

const BannerFormFour = () => {

   const [activeTab, setActiveTab] = useState(0);

   // Handle tab click event
   const handleTabClick = (index: number) => {
      setActiveTab(index);
   };

   return (
      <div className="tg-booking-form-area tg-booking-4-form-area tg-grey-bg pb-65">
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="tg-booking-form-wrap tg-booking-form-space">
                     <div className="tg-booking-form-tabs">
                        <div className="nav nav-tab justify-content-center" id="nav-tab" role="tablist">
                           {tab_title.map((tab, index) => (
                              <button type="button" key={tab.title} className={`nav-link ${activeTab === index ? "active" : ""}`} onClick={() => handleTabClick(index)} id="nav-platform-tab">
                                 <span className="borders"></span>
                                 <span className="icon">{tab.icon}</span>
                                 <span>{tab.title}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="tab-content" id="nav-tabContent">
                        {form_data.map((item, index) => (
                           <div key={item} className={`tab-pane fade ${activeTab === index ? 'show active' : ''}`} id="nav-platform">
                              <div className="tg-booking-form-item">
                                 <BannerFormTwo />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default BannerFormFour
