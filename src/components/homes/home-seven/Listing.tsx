/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import listing_data from "@/data/ListingData"
import Image from "next/image"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { addToWishlist } from "@/redux/features/wishlistSlice"

const setting = {
   spaceBetween: 24,
   loop: true,
   speed: 500,
   autoplay: {
      delay: 4000,
   },
   navigation: {
      nextEl: '.tg-listing-5-slide-next',
      prevEl: '.tg-listing-5-slide-prev',
   },
   breakpoints: {
      '1200': {
         slidesPerView: 4,
      },
      '992': {
         slidesPerView: 3,
      },
      '768': {
         slidesPerView: 2,
      },
      '576': {
         slidesPerView: 2,
      },
      '0': {
         slidesPerView: 1,
      },
   },
};

const Listing = () => {

   const dispatch = useDispatch();
   // add to wishlist
   const handleAddToWishlist = (item: any) => {
      dispatch(addToWishlist(item));
   };

   return (
      <div className="tg-listing-area pt-135 pb-105 tg-grey-bg">
         <div className="container">
            <div className="row align-items-end">
               <div className="col-lg-9">
                  <div className="tg-location-section-title mb-40">
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">Our Best Restaurant</h5>
                     <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">Popular Restaurants in Town</h2>
                  </div>
               </div>
               <div className="col-lg-3">
                  <div className="tg-listing-5-slider-navigation text-end mb-50 wow fadeInUp" data-wow-delay=".4s" data-wow-duration="1s">
                     <button type="button" className="tg-listing-5-slide-prev" aria-label="Previous slide"><i className="fa-solid fa-arrow-left-long"></i></button>
                     <button type="button" className="tg-listing-5-slide-next" aria-label="Next slide"><i className="fa-solid fa-arrow-right-long"></i></button>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="col-12">
                  <Swiper {...setting} modules={[Autoplay, Navigation]} className="swiper-container tg-listing-slider-2 p-relative fix">
                     {listing_data.flatMap((item) => item.page !== "home_7" ? [] : [
                        <SwiperSlide key={item.id} className="swiper-slide">
                           <div className="tg-listing-card-item tg-listing-5-card-item mb-25">
                              <div className="tg-listing-card-thumb tg-listing-2-card-thumb mb-15 fix p-relative">
                                 <Link href="/tour-details">
                                    <Image className="tg-card-border w-100" src={item.thumb} alt="listing" />
                                    {item.tag && <span className="tg-listing-item-price-discount shape">{item.tag}</span>}
                                    {item.featured && <span className="tg-listing-item-price-discount offer-btm shape-3">
                                       <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M6.60 1L0.60 8.2H6L5.40 13L11.40 5.8H6L6.60 1Z" stroke="white" strokeWidth="0.857143" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                       {item.featured}
                                    </span>}
                                    {item.recommended && <span className="tg-listing-item-price-discount offer-btm-2 shape-4">{item.recommended}</span>}
                                 </Link>
                                 <div className="tg-listing-item-wishlist">
                                    <button type="button" onClick={() => handleAddToWishlist(item)} style={{ cursor: "pointer" }} aria-label="Add to wishlist">
                                       <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M10.52 16.34C10.23 16.44 9.77 16.44 9.48 16.34C7.07 15.52 1.67 12.075 1.67 6.24C1.67 3.67 3.74 1.58 6.30 1.58C7.82 1.58 9.16 2.32 10 3.45C10.84 2.32 12.19 1.58 13.70 1.58C16.26 1.58 18.33 3.67 18.33 6.24C18.33 12.075 12.93 15.52 10.52 16.34Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </button>
                                 </div>
                                 <div className="tg-listing-2-price">
                                    <span>
                                       <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M13.91 9.57C14.39 9.57 14.77 9.19 14.77 8.71C14.77 8.24 14.39 7.86 13.91 7.86M13.91 9.57H13.03C12.08 9.57 12.26 10.43 11.31 10.43C10.37 10.43 10.55 9.57 9.60 9.57C8.65 9.57 8.83 10.43 7.89 10.43C6.94 10.43 7.12 9.57 6.17 9.57C5.22 9.57 5.404 10.43 4.46 10.43C3.51 10.43 3.66 9.57 2.71 9.57H1.86M13.91 9.57C13.91 11.47 12.35 13 10.46 13H5.31C4.28 13 3.35 12.544 2.71 11.82C2.18 11.22 1.86 10.43 1.86 9.57M1.86 9.57C1.38 9.57 1 9.19 1 8.71C1 8.24 1.38 7.86 1.86 7.86M1.86 7.86H13.91M1.86 7.86C1.38 7.86 1 7.47 1 7C1 6.53 1.38 6.14 1.86 6.14M13.91 7.86C14.39 7.86 14.77 7.47 14.77 7C14.77 6.53 14.39 6.14 13.91 6.14M1.86 6.14H13.91M1.86 6.14C1.86 4.86 2.17 3.85 2.71 3.09C3.77 1.59 5.70 1 7.89 1C11.20 1 13.91 2.36 13.91 6.14" stroke="#560CE3" strokeWidth="0.8" strokeMiterlimit="13.3333" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </span>
                                    <span className="text">{item.country}</span>
                                 </div>
                              </div>
                              <div className="tg-listing-card-content p-relative">
                                 <h4 className="tg-listing-card-title mb-5"><Link href="/tour-details">{item.title}</Link></h4>
                                 <div className="tg-listing-card-review mb-5">
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-percent">({item.total_review} Reviews)</span>
                                 </div>
                                 <span className="tg-listing-card-duration-map d-inline-block mb-10">
                                    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M12.33 6.71C12.33 11.23 6.56 15.11 6.56 15.11C6.56 15.11 0.78 11.23 0.78 6.71C0.78 5.16 1.39 3.68 2.47 2.59C3.55 1.50 5.02 0.89 6.56 0.89C8.09 0.89 9.56 1.50 10.64 2.59C11.72 3.68 12.33 5.16 12.33 6.71Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                       <path d="M6.56 8.65C7.62 8.65 8.48 7.78 8.48 6.71C8.48 5.636 7.62 4.77 6.56 4.77C5.49 4.77 4.63 5.636 4.63 6.71C4.63 7.78 5.49 8.65 6.56 8.65Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {item.location}
                                 </span>
                                 <div className="tg-listing-avai d-flex align-items-center justify-content-between">
                                    <Link className="tg-listing-avai-btn" href="/tour-details">View Details</Link>
                                    <div className="tg-listing-card-price d-flex align-items-center">
                                       <span className="form mr-5">From</span>
                                       <span className="price">${item.price}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </SwiperSlide>
                     ])}
                  </Swiper>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Listing
