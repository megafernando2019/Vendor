"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/common/Button'
import listing_data from '@/data/ListingData'

import shape from '@/assets/img/banner/banner-2/shape.webp'

const setting = {
   spaceBetween: 24,
   loop: true,
   speed: 500,
   autoplay: {
      delay: 4000,
   },
   pagination: {
      el: ".swiper-pagination",
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
         slidesPerView: 1,
      },
      '0': {
         slidesPerView: 1,
      },
   },
};

const Listing = () => {
   return (
      <div className="tg-listing-area pt-90 pb-115 p-relative z-index-9">
         <Image className="tg-listing-3-shape tg-listing-4-shape d-none d-xl-block" src={shape} alt="" />
         <div className="container">
            <div className="row align-items-end">
               <div className="col-lg-9">
                  <div className="tg-location-section-title mb-40">
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">Most Popular Tour Packages </h5>
                     <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">Our Popular Tours</h2>
                  </div>
               </div>
               <div className="col-lg-3">
                  <div className="tg-location-3-btn text-end wow fadeInUp mb-40" data-wow-delay=".6s" data-wow-duration=".9s">
                     <Link href="/tour-grid-1" className="tg-btn tg-btn-gray tg-btn-switch-animation">
                        <Button text='See All Deal' />
                     </Link>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="col-12">
                  <Swiper {...setting} modules={[Autoplay, Pagination]} wrapperClass="mb-35" className="swiper-container tg-listing-slider p-relative fix">
                     {listing_data.filter((items) => items.page === "home_5").slice(0, 5).map((item) => (
                        <SwiperSlide key={item.id} className="swiper-slide">
                           <div className="tg-listing-card-item tg-listing-4-card-item mb-25">
                              <div className="tg-listing-card-thumb tg-listing-2-card-thumb mb-15 fix p-relative">
                                 <Link href="#">
                                    <Image className="tg-card-border w-100" src={item.thumb} alt="listing" />
                                    {item.tag && <span className="tg-listing-item-price-discount shape">{item.tag}</span>}
                                 </Link>
                                 <div className="tg-listing-2-price">
                                    <span className="new">${item.price}</span>
                                    <span className="shift">/night</span>
                                 </div>
                              </div>
                              <div className="tg-listing-card-content p-relative">
                                 <h4 className="tg-listing-card-title mb-5"><Link href="#">{item.title}</Link></h4>
                                 <span className="tg-listing-card-duration-map d-inline-block">
                                    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M12.33 6.71C12.33 11.23 6.56 15.11 6.56 15.11C6.56 15.11 0.78 11.23 0.78 6.71C0.78 5.16 1.39 3.68 2.47 2.59C3.55 1.50 5.02 0.89 6.56 0.89C8.09 0.89 9.56 1.50 10.64 2.59C11.72 3.68 12.33 5.16 12.33 6.71Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                       <path d="M6.56 8.65C7.62 8.65 8.48 7.78 8.48 6.71C8.48 5.636 7.62 4.77 6.56 4.77C5.49 4.77 4.63 5.636 4.63 6.71C4.63 7.78 5.49 8.65 6.56 8.65Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {item.location}
                                 </span>
                                 <div className="tg-listing-card-review mb-10">
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                    <span className="tg-listing-rating-percent">({item.total_review} Reviews)</span>
                                 </div>
                                 <div className="tg-listing-avai d-flex align-items-center justify-content-between">
                                    <Link className="tg-listing-avai-btn" href="#">Check Availability</Link>
                                    <div className="tg-listing-item-wishlist">
                                       <Link href="#">
                                          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M10.52 16.34C10.23 16.44 9.77 16.44 9.48 16.34C7.07 15.52 1.67 12.075 1.67 6.24C1.67 3.67 3.74 1.58 6.30 1.58C7.82 1.58 9.16 2.32 10 3.45C10.84 2.32 12.19 1.58 13.70 1.58C16.26 1.58 18.33 3.67 18.33 6.24C18.33 12.075 12.93 15.52 10.52 16.34Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                       </Link>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </SwiperSlide>
                     ))}
                     <div className="tg-listing-4-pagination swiper-pagination"></div>
                  </Swiper>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Listing
