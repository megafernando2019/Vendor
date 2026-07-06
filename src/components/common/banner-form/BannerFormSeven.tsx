import { useEffect, useRef, useState } from "react";
import Flatpickr from 'react-flatpickr';
import { preventNativeFormSubmit } from "@/utils/preventNativeFormSubmit";

interface DataType {
   id: number;
   title: string;
   count: number
}

const guest_data: DataType[] = [
   {
      id: 1,
      title: "Rooms",
      count: 0
   },
   {
      id: 2,
      title: "Adults",
      count: 0
   },
   {
      id: 3,
      title: "Children",
      count: 0
   },
];

const BannerFormSeven = () => {

   const [location, setLocation] = useState(false);
   const [checkInDate, setCheckInDate] = useState<Date | Date[]>(new Date());
   const [checkOutDate, setCheckOutDate] = useState<Date | Date[]>(new Date());
   const [guest, setGuest] = useState(false);
   const [guestCounts, setGuestCounts] = useState<DataType[]>(guest_data);

   const locationRef = useRef<HTMLDivElement>(null);
   const guestRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            locationRef.current &&
            !locationRef.current.contains(event.target as Node)
         ) {
            setLocation(false);
         }
         if (
            guestRef.current &&
            !guestRef.current.contains(event.target as Node)
         ) {
            setGuest(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const handleIncrement = (id: number) => {
      setGuestCounts(prev =>
         prev.map(item =>
            item.id === id ? { ...item, count: item.count + 1 } : item
         )
      );
   };

   const handleDecrement = (id: number) => {
      setGuestCounts(prev =>
         prev.map(item =>
            item.id === id && item.count > 0
               ? { ...item, count: item.count - 1 }
               : item
         )
      );
   };

   return (
      <form onSubmit={preventNativeFormSubmit}>
         <div className="tg-booking-form-input-group d-flex align-items-end justify-content-between">
            <div ref={locationRef} className="tg-booking-form-parent-inner tg-hero-quantity p-relative mr-15 mb-10">
               <span className="tg-booking-form-title mb-5">Destinations:</span>
               <button type="button" onClick={() => setLocation((prev) => !prev)} className={`tg-booking-add-input-field tg-booking-quantity-toggle ${location ? "active" : ""} `}>
                  <span className="tg-booking-title-value">Where are you going . . .</span>
                  <span className="location">
                     <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.33 6.71C12.33 11.23 6.56 15.11 6.56 15.11C6.56 15.11 0.78 11.23 0.78 6.71C0.78 5.16 1.39 3.68 2.47 2.59C3.55 1.50 5.02 0.89 6.56 0.89C8.09 0.89 9.56 1.50 10.64 2.59C11.72 3.68 12.33 5.16 12.33 6.71Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.56 8.65C7.62 8.65 8.48 7.78 8.48 6.71C8.48 5.636 7.62 4.77 6.56 4.77C5.49 4.77 4.63 5.636 4.63 6.71C4.63 7.78 5.49 8.65 6.56 8.65Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
               </button>
               <div className={`tg-booking-form-location-list tg-booking-quantity-active ${location ? "tg-list-open" : ""}`}>
                  <ul className="scrool-bar scrool-height pr-5">
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>Chicago</span>
                     </li>
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>Los Angeles</span>
                     </li>
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>London</span>
                     </li>
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>Paris</span>
                     </li>
                     <li>
                        <i className="fa-regular fa-location-dot"></i>
                        <span>Dubai</span>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="tg-booking-form-parent-inner mr-15 mb-15">
               <span className="tg-booking-form-title">Check in:</span>
               <div className="tg-booking-add-input-date p-relative">
                  <span>
                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.77 0.78V3.27M4.23 0.78V3.27M0.78 5.76H13.22M2.16 2.02H11.84C12.60 2.02 13.22 2.58 13.22 3.27V11.98C13.22 12.67 12.60 13.22 11.84 13.22H2.16C1.40 13.22 0.78 12.67 0.78 11.98V3.27C0.78 2.58 1.40 2.02 2.16 2.02Z" stroke="currentColor" strokeWidth="0.977778" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
                  <Flatpickr
                     value={checkInDate}
                     onChange={(selectedDates) => setCheckInDate(selectedDates)}
                     options={{
                        dateFormat: 'd/m/Y',
                        minDate: 'today',
                     }}
                     className="input"
                     placeholder="dd/mm/yyyy"
                     aria-label="Check in date"
                  />
                  <span className="angle-down">
                     <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.67 1L7 6.33L12.33 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
               </div>
            </div>
            <div className="tg-booking-form-parent-inner mr-15  mb-15">
               <span className="tg-booking-form-title">Check Out:</span>
               <div className="tg-booking-add-input-date p-relative">
                  <span>
                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.77 0.78V3.27M4.23 0.78V3.27M0.78 5.76H13.22M2.16 2.02H11.84C12.60 2.02 13.22 2.58 13.22 3.27V11.98C13.22 12.67 12.60 13.22 11.84 13.22H2.16C1.40 13.22 0.78 12.67 0.78 11.98V3.27C0.78 2.58 1.40 2.02 2.16 2.02Z" stroke="currentColor" strokeWidth="0.977778" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
                  <Flatpickr
                     value={checkOutDate}
                     onChange={(selectedDates) => setCheckOutDate(selectedDates)}
                     options={{
                        dateFormat: 'd/m/Y',
                        minDate: 'today',
                     }}
                     className="input"
                     placeholder="dd/mm/yyyy"
                     aria-label="Check out date"
                  />
                  <span className="angle-down">
                     <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.67 1L7 6.33L12.33 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
               </div>
            </div>
            <div ref={guestRef} className="tg-booking-form-parent-inner tg-hero-quantity p-relative mr-15 mb-15">
               <span className="tg-booking-form-title">Guest:</span>
               <button type="button" onClick={() => setGuest((prev) => !prev)} className={`tg-booking-add-input-field tg-booking-quantity-toggle ${guest ? "active" : ""}`}>
                  <span className="location">
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_53_98)">
                           <path d="M1.51 15.29C1.34 15.29 1.16 15.2 1.07 15.11C0.98 14.93 0.89 14.84 0.89 14.67C0.89 13.42 1.25 12.18 1.87 11.02C2.49 9.96 3.47 8.98 4.54 8.36C4.09 7.82 3.74 7.11 3.56 6.40C3.47 5.69 3.47 4.89 3.65 4.27C3.82 3.56 4.27 2.84 4.71 2.31C5.25 1.78 5.87 1.33 6.49 1.16C7.02 0.98 7.56 0.89 8.09 0.89C8.27 0.89 8.54 0.89 8.71 0.89C9.42 0.98 10.14 1.24 10.76 1.69C11.38 2.13 11.824 2.67 12.18 3.29C12.54 3.91 12.71 4.62 12.71 5.42C12.71 6.49 12.36 7.56 11.65 8.36C12.18 8.71 12.71 9.07 13.25 9.51C13.96 10.22 14.40 10.93 14.85 11.82C15.20 12.71 15.38 13.6 15.38 14.58C15.38 14.76 15.29 14.93 15.20 15.02C15.11 15.11 14.94 15.2 14.76 15.2C14.67 15.2 14.58 15.2 14.49 15.11C14.40 15.11 14.31 15.02 14.31 14.93C14.224 14.84 14.224 14.84 14.14 14.76C14.14 14.67 14.05 14.58 14.05 14.49C14.05 13.69 13.87 12.98 13.60 12.27C13.34 11.56 12.89 10.93 12.27 10.4C11.74 9.96 11.20 9.51 10.58 9.24C9.87 9.69 9.07 9.96 8.09 9.96C7.20 9.96 6.31 9.69 5.60 9.24C4.62 9.69 3.74 10.4 3.11 11.38C2.49 12.36 2.14 13.42 2.14 14.58C2.14 14.76 2.05 14.93 1.96 15.02C1.87 15.2 1.69 15.29 1.51 15.29ZM8.09 2.22C7.47 2.22 6.85 2.40 6.31 2.76C5.69 3.11 5.34 3.64 5.07 4.18C4.80 4.80 4.71 5.42 4.89 6.13C4.98 6.76 5.34 7.38 5.78 7.82C6.22 8.27 6.85 8.62 7.47 8.71C7.65 8.71 7.91 8.80 8.09 8.80C8.54 8.80 8.98 8.71 9.34 8.53C9.96 8.27 10.40 7.91 10.85 7.29C11.20 6.76 11.38 6.13 11.38 5.51C11.38 4.62 11.024 3.82 10.40 3.20C9.78 2.49 8.98 2.22 8.09 2.22Z" fill="currentColor" />
                        </g>
                        <defs>
                           <clipPath id="clip0_523_98">
                              <rect width="16" height="16" fill="currentColor" />
                           </clipPath>
                        </defs>
                     </svg>
                  </span>
                  <span className="tg-booking-title-value">+ Add Guests</span>
                  <span className="angle-down">
                     <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.67 1L7 6.33L12.33 1" stroke="#353844" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </span>
               </button>
               <div className={`tg-booking-form-location-list tg-quantity tg-booking-quantity-active ${guest ? "tg-list-open" : ""}`}>
                  <ul>
                     {guestCounts.map((item) => (
                        <li key={item.id}>
                           <span className="mr-20">{item.title}</span>
                           <div className="tg-booking-quantity-item">
                              <button type="button" onClick={() => handleIncrement(item.id)} className="increment" aria-label={`Increase ${item.title}`}>
                                 <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.22 7H13.38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7.30 13V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </button>
                              <input className="tg-quantity-input" type="text" defaultValue={item.count} aria-label={`${item.title} count`} readOnly />
                              <button type="button" onClick={() => handleDecrement(item.id)} className="decrement" aria-label={`Decrease ${item.title}`}>
                                 <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </button>
                           </div>
                        </li>
                     ))}
                  </ul>
                  <div className="tg-booking-form-search-btn mt-15 ">
                     <button className="bk-search-button bk-search-button-2 w-100" type="submit">Ok</button>
                  </div>
               </div>
            </div>
            <div className="tg-booking-form-search-btn mb-10">
               <button className="bk-search-button" type="submit">Search
                  <span className="ml-5">
                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_53_103)">
                           <path d="M13.22 13.22L10.52 10.52M12.20 6.49C12.20 9.64 9.64 12.20 6.49 12.20C3.33 12.20 0.78 9.64 0.78 6.49C0.78 3.33 3.33 0.78 6.49 0.78C9.64 0.78 12.20 3.33 12.20 6.49Z" stroke="currentColor" strokeWidth="1.575" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                           <clipPath id="clip0_53_103">
                              <rect width="14" height="14" fill="currentColor" />
                           </clipPath>
                        </defs>
                     </svg>
                  </span>
               </button>
            </div>
         </div>
      </form>
   )
}

export default BannerFormSeven
