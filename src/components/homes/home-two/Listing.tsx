/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image from "next/image"
import listing_data from "@/data/ListingData"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { addToWishlist } from "@/redux/features/wishlistSlice"

import shape_1 from "@/assets/img/listing/su/shape-3.webp"

const Listing = () => {

   const dispatch = useDispatch();
   // add to wishlist
   const handleAddToWishlist = (item: any) => {
      dispatch(addToWishlist(item));
   };

   return (
      <div className="tg-listing-area pt-120 pb-120 p-relative">
         <Image className="tg-listing-su-2-shape p-absolute d-none d-xxl-block" src={shape_1} alt="" />
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-lg-6 col-md-8">
                  <div className="tg-listing-section-title-wrap text-center mb-40">
                     <h5 className="tg-section-su-subtitle su-subtitle-2 mb-15 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">Explore the world</h5>
                     <h2 className="tg-section-su-title text-capitalize wow fadeInUp mb-15" data-wow-delay=".5s" data-wow-duration=".9s">Our Amazing Featured Tour  Package The World</h2>
                  </div>
               </div>
            </div>
            <div className="row">
               {listing_data.flatMap((item) => item.page !== "home_1" ? [] : [
                  <div key={item.id} className="col-xl-4 col-lg-4 col-md-6">
                     <div className="tg-listing-card-item tg-listing-su-card-item mb-25">
                        <div className="tg-listing-card-thumb fix mb-25 p-relative">
                           <Link href="/tour-details">
                              <Image className="tg-card-border w-100" src={item.thumb} alt="listing" />
                              {item.tag && <span className="tg-listing-item-price-discount">{item.tag}</span>}
                           </Link>
                           <div className="tg-listing-item-wishlist">
                              <button type="button" onClick={() => handleAddToWishlist(item)} style={{ cursor: "pointer" }} aria-label="Add to wishlist">
                                 <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.52 16.34C10.23 16.44 9.77 16.44 9.48 16.34C7.07 15.52 1.67 12.075 1.67 6.24C1.67 3.67 3.74 1.58 6.30 1.58C7.82 1.58 9.16 2.32 10 3.45C10.84 2.32 12.19 1.58 13.70 1.58C16.26 1.58 18.33 3.67 18.33 6.24C18.33 12.075 12.93 15.52 10.52 16.34Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </button>
                           </div>
                        </div>
                        <div className="tg-listing-card-content">
                           <div className="tg-listing-card-duration-tour d-flex align-items-center gap-3">
                              <span className="tg-listing-card-duration-map mb-5">
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_16_2737)">
                                       <path d="M8 3.73V8L10.84 9.42M15.11 8C15.11 11.93 11.93 15.11 8 15.11C4.07 15.11 0.89 11.93 0.89 8C0.89 4.07 4.07 0.89 8 0.89C11.93 0.89 15.11 4.07 15.11 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                       <clipPath id="clip0_16_2737">
                                          <rect width="16" height="16" fill="white" />
                                       </clipPath>
                                    </defs>
                                 </svg>
                                 {item.time}
                              </span>
                              <span className="tg-listing-card-duration-time mb-5">
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.62 14.04C1.40 14.04 1.20 13.94 1.09 13.83L1 13.68C0.95 13.58 0.89 13.48 0.89 13.32C0.89 12.22 1.20 11.08 1.78 9.99C2.32 9.07 3.14 8.22 4.04 7.65C3.69 7.18 3.41 6.60 3.27 6.01C3.21 5.56 3.15 4.72 3.34 4.02C3.54 3.24 4.04 2.55 4.32 2.21C4.71 1.82 5.32 1.32 5.99 1.13C6.48 0.97 6.98 0.89 7.47 0.89H8.02C8.72 0.98 9.38 1.24 9.94 1.64C10.48 2.03 10.90 2.49 11.25 3.11C11.582 3.69 11.75 4.36 11.75 5.09C11.75 6.05 11.45 6.96 10.89 7.66C11.31 7.94 11.73 8.24 12.16 8.59C12.88 9.31 13.29 10.03 13.63 10.69C13.96 11.53 14.12 12.35 14.12 13.23C14.12 13.44 14.01 13.64 13.902 13.75C13.80 13.86 13.60 13.96 13.38 13.96C13.30 13.96 13.182 13.96 13.07 13.88C12.95 13.84 12.85 13.75 12.83 13.64L12.66 13.47V13.40C12.61 13.31 12.58 13.24 12.58 13.16C12.58 12.54 12.462 11.95 12.20 11.24C11.97 10.64 11.59 10.11 11.06 9.65C10.60 9.28 10.18 8.92 9.69 8.69C9 9.10 8.28 9.31 7.47 9.31C6.69 9.31 5.90 9.09 5.24 8.70C4.39 9.10 3.68 9.72 3.19 10.49C2.63 11.37 2.35 12.29 2.35 13.24C2.35 13.45 2.24 13.65 2.13 13.76C2.07 13.92 1.86 14.04 1.62 14.04ZM6.94 7.84C7 7.84 7.11 7.86 7.22 7.88C7.31 7.90 7.39 7.92 7.46 7.92C7.84 7.92 8.20 7.84 8.49 7.70C9.03 7.47 9.40 7.16 9.77 6.65C10.05 6.21 10.21 5.71 10.21 5.17C10.21 4.44 9.93 3.78 9.40 3.24C8.91 2.69 8.28 2.43 7.47 2.43C6.93 2.43 6.42 2.58 5.98 2.87C5.43 3.19 5.14 3.68 4.94 4.07C4.70 4.62 4.66 5.14 4.79 5.69C4.86 6.19 5.14 6.71 5.54 7.11C5.93 7.50 6.45 7.78 6.94 7.84Z" fill="currentColor" />
                                 </svg>
                                 {item.guest}
                              </span>
                           </div>
                           <h4 className="tg-listing-card-title mb-10"><Link href="tour-details.html">{item.title}</Link></h4>
                           <div className="tg-listing-card-duration-tour mb-20">
                              <span className="tg-listing-card-duration-map">
                                 <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.33 6.71C12.33 11.23 6.56 15.11 6.56 15.11C6.56 15.11 0.78 11.23 0.78 6.71C0.78 5.16 1.39 3.68 2.47 2.59C3.55 1.50 5.02 0.89 6.56 0.89C8.09 0.89 9.56 1.50 10.64 2.59C11.72 3.68 12.33 5.16 12.33 6.71Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.56 8.65C7.62 8.65 8.48 7.78 8.48 6.71C8.48 5.636 7.62 4.77 6.56 4.77C5.49 4.77 4.63 5.636 4.63 6.71C4.63 7.78 5.49 8.65 6.56 8.65Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                                 {item.location}
                              </span>
                           </div>
                           <div className="tg-listing-card-price d-flex align-items-end justify-content-between">
                              <div>
                                 <span className="tg-listing-card-currency-amount d-flex align-items-center">
                                    <span className="currency-symbol mr-5">From</span>${item.price}
                                 </span>
                              </div>
                              <div>
                                 <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i> {item.review}</span>
                                 <span className="tg-listing-rating-percent">{item.total_review}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ])}
               <div className="col-12">
                  <div className="text-center mt-15">
                     <Link href="/tour-grid-1" className="tg-btn tg-btn-transparent tg-btn-su-transparent">See More Tours</Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Listing
