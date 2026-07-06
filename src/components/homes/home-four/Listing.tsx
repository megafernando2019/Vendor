/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import listing_data from "@/data/ListingData"
import Image from "next/image"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { addToWishlist } from "@/redux/features/wishlistSlice"

import shape_1 from "@/assets/img/listing/listing-2/shape-1.webp"
import shape_2 from "@/assets/img/listing/listing-2/shape-2.webp"
import shape_3 from "@/assets/img/listing/listing-2/shape-3.webp"
import shape_4 from "@/assets/img/listing/listing-2/shape.webp"
import Button from "@/components/common/Button"

const Listing = () => {

   const dispatch = useDispatch();
   // add to wishlist
   const handleAddToWishlist = (item: any) => {
      dispatch(addToWishlist(item));
   };

   return (
      <div className="tg-listing-area tg-grey-bg pt-140 pb-130 p-relative z-index-9">
         <Image className="tg-listing-2-shape d-none d-sm-block" src={shape_1} alt="" />
         <Image className="tg-listing-2-shape-2 d-none d-xl-block" src={shape_2} alt="" />
         <Image className="tg-listing-2-shape-3 d-none d-sm-block" src={shape_3} alt="" />
         <div className="container">
            <div className="row">
               <div className="col-12">
                  <div className="tg-listing-section-title text-center mb-35">
                     <h5 className="tg-section-subtitle wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".6s">Most Popular Tour Packages </h5>
                     <h2 className="mb-15 wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".7s">Something Amazing Waiting For you</h2>
                     <p className="text-capitalize wow fadeInUp" data-wow-delay=".6s" data-wow-duration=".8s">Are you tired of the typical tourist destinations and looking<br />
                        to step out of your comfort zonetravel</p>
                  </div>
               </div>
            </div>
            <div className="row">
               {listing_data.flatMap((item) => item.page !== "home_3" ? [] : [
                  <div key={item.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".6s">
                     <div className="tg-listing-card-item tg-listing-2-card-item mb-25">
                        <div className="tg-listing-card-thumb tg-listing-2-card-thumb fix p-relative">
                           <Link href="/tour-details">
                              <Image className="tg-card-border w-100" src={item.thumb} alt="listing" />
                              {item.featured &&
                                 <span className="tg-listing-item-price-discount shape-3">
                                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M6.60 1L0.60 8.2H6L5.40 13L11.40 5.8H6L6.60 1Z" stroke="white" strokeWidth="0.857143" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {item.featured}
                                 </span>}
                              {item.tag && <span className="tg-listing-item-price-discount shape-2">{item.tag}</span>}
                           </Link>
                           <div className="tg-listing-2-mask">
                              <Image className="w-100" src={shape_4} alt="" />
                           </div>
                           <div className="tg-listing-item-wishlist">
                              <button type="button" onClick={() => handleAddToWishlist(item)} style={{ cursor: "pointer" }} aria-label="Add to wishlist">
                                 <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.52 16.34C10.23 16.44 9.77 16.44 9.48 16.34C7.07 15.52 1.67 12.075 1.67 6.24C1.67 3.67 3.74 1.58 6.30 1.58C7.82 1.58 9.16 2.32 10 3.45C10.84 2.32 12.19 1.58 13.70 1.58C16.26 1.58 18.33 3.67 18.33 6.24C18.33 12.075 12.93 15.52 10.52 16.34Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                              </button>
                           </div>
                        </div>
                        <div className="tg-listing-card-content p-relative">
                           <div className="tg-listing-2-price-wrap text-center">
                              <div className="tg-listing-2-price">
                                 {item.delete_price && <del>${item.delete_price}</del>}
                                 <span className="new">${item.price}</span>
                                 <span className="shift">/night</span>
                              </div>
                           </div>
                           <h4 className="tg-listing-card-title"><Link href="tour-details.html">{item.title}</Link></h4>
                           <div className="tg-listing-card-review mb-5">
                              <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                              <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                              <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                              <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                              <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                              <span className="tg-listing-rating-percent">({item.review} Reviews)</span>
                           </div>
                           <div className="tg-listing-card-duration-tour">
                              <span className="tg-listing-card-duration-map mb-5">
                                 <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.33 6.71C12.33 11.23 6.56 15.11 6.56 15.11C6.56 15.11 0.78 11.23 0.78 6.71C0.78 5.16 1.39 3.68 2.47 2.59C3.55 1.50 5.02 0.89 6.56 0.89C8.09 0.89 9.56 1.50 10.64 2.59C11.72 3.68 12.33 5.16 12.33 6.71Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.56 8.65C7.62 8.65 8.48 7.78 8.48 6.71C8.48 5.636 7.62 4.77 6.56 4.77C5.49 4.77 4.63 5.636 4.63 6.71C4.63 7.78 5.49 8.65 6.56 8.65Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                                 {item.location}
                              </span>
                              <span className="tg-listing-card-duration-time">
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 3.73V8L10.85 9.42M15.11 8C15.11 11.93 11.93 15.11 8 15.11C4.07 15.11 0.89 11.93 0.89 8C0.89 4.07 4.07 0.89 8 0.89C11.93 0.89 15.11 4.07 15.11 8Z" stroke="currentColor" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                                 {item.time}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               ])}
               <div className="col-12 wow fadeInUp" data-wow-delay=".7s" data-wow-duration=".6s">
                  <div className="tg-listing-2-btn text-center pt-25">
                     <Link href="/tour-grid-2" className="tg-btn tg-btn-switch-animation">
                        <Button text="See All Listings" />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Listing
