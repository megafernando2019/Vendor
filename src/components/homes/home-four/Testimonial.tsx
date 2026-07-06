"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from "next/image";
import { testi_data } from '@/data/TestimonialData';

import shape_1 from "@/assets/img/testimonial/tower.webp"
import shape_2 from "@/assets/img/testimonial/shape.webp"

const setting = {
   spaceBetween: 25,
   loop: true,
   speed: 500,
   autoplay: {
      delay: 4000,
   },
   pagination: {
      el: ".tg-testimonial-2-pagination",
   },
   navigation: false,
   breakpoints: {
      '1200': {
         slidesPerView: 3,
      },
      '992': {
         slidesPerView: 2,
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

interface StyleType {
   style: boolean;
}

const Testimonial = ({ style }: StyleType) => {
   return (
      <div className={`tg-testimonial-area tg-grey-bg pt-130 pb-110 p-relative z-index-1 ${style ? "" : "mt-35"}`}>
         <Image className="tg-testimonial-2-shape p-absolute" src={shape_1} alt="" />
         <Image className="tg-testimonial-2-shape-1 p-absolute d-none d-lg-block" src={shape_2} alt="" />
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="tg-location-section-title text-center mb-30">
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">Clients Feedback About Us</h5>
                     <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">See Those Lovely Words From Clients</h2>
                     <p className="text-capitalize wow fadeInUp" data-wow-delay=".6s" data-wow-duration=".9s">Are you tired of the typical tourist destinations and looking<br />
                        to step out of your comfort zonetravel</p>
                  </div>
               </div>
               <Swiper {...setting} modules={[Autoplay, Pagination]} wrapperClass="mb-40" className="swiper-container tg-testimonial-slider p-relative fix">
                  {testi_data.flatMap((item) => item.page !== "home_2" ? [] : [
                     <SwiperSlide key={item.id} className="swiper-slide">
                        <div className="tg-testimonial-item mb-30">
                           <div className="tg-testimonial-avatar-top d-flex align-items-start justify-content-between">
                              <div className="tg-testimonial-avatar-inner d-flex align-items-center mr-20 mb-20">
                                 <div className="tg-testimonial-avatar-thumb mr-15">
                                    <Image className="rounded-circale" src={item.avatar} alt="avatar" />
                                 </div>
                                 <div className="tg-testimonial-avatar-content">
                                    <h5>{item.name}</h5>
                                    <span>{item.designation}</span>
                                 </div>
                              </div>
                              <div className="tg-testimonial-avatar-qoute">
                                 <span>
                                    <svg width="44" height="34" viewBox="0 0 44 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M1.23 33.5V28.42L2.54 28.16L2.54 28.16C5.54 27.56 7.73 26.35 8.91 24.48L8.91 24.48L8.91 24.479C9.51 23.51 9.85 22.41 9.90 21.27L9.92 20.75H9.40H2.86C2.43 20.75 2.02 20.58 1.71 20.274C1.41 19.97 1.23 19.556 1.23 19.125V4.25C1.23 2.18 2.92 0.5 4.98 0.5H17.73C18.17 0.5 18.58 0.67 18.88 0.98C19.19 1.28 19.36 1.69 19.36 2.125V19.125V19.17L19.364 19.20C19.36 19.21 19.37 19.22 19.37 19.23C19.37 19.27 19.37 19.33 19.37 19.41C19.38 19.57 19.38 19.795 19.37 20.08C19.35 20.66 19.275 21.48 19.08 22.419C18.696 24.31 17.83 26.70 15.90 28.79L1.23 33.5ZM1.23 33.5H2.86C8.68 33.5 13.04 31.89 15.90 28.79L1.23 33.5ZM24.62 33.5V28.42L25.93 28.16L25.93 28.16C28.93 27.56 31.119 26.35 32.30 24.48L32.30 24.48L32.30 24.479C32.90 23.51 33.24 22.41 33.29 21.27L33.31 20.75H32.79H26.25C25.82 20.75 25.40 20.58 25.10 20.274C24.80 19.97 24.62 19.556 24.62 19.125V4.25C24.62 2.18 26.31 0.5 28.37 0.5H41.12C41.56 0.5 41.97 0.67 42.27 0.98C42.578 1.28 42.75 1.69 42.75 2.125V19.125V19.17L42.75 19.20C42.75 19.21 42.76 19.22 42.76 19.23C42.76 19.27 42.76 19.33 42.76 19.41C42.77 19.57 42.77 19.79 42.76 20.084C42.74 20.66 42.66 21.48 42.47 22.419C42.08 24.31 41.21 26.70 39.29 28.79C36.43 31.89 32.07 33.5 26.25 33.5H24.62ZM19.36 19.18C19.36 19.176 19.36 19.18 19.36 19.18C19.36 19.18 19.36 19.18 19.36 19.18Z" stroke="#D1D1D1" />
                                    </svg>
                                 </span>
                              </div>
                           </div>
                           <p className="tg-testimonial-avatar-para mb-10">{item.desc}</p>
                           <div className="tg-testimonial-ratings">
                              <span><i className="fa-sharp fa-solid fa-star"></i></span>
                              <span><i className="fa-sharp fa-solid fa-star"></i></span>
                              <span><i className="fa-sharp fa-solid fa-star"></i></span>
                              <span><i className="fa-sharp fa-solid fa-star"></i></span>
                              <span><i className="fa-sharp fa-solid fa-star"></i></span>
                           </div>
                        </div>
                     </SwiperSlide>
                  ])}
                  <div className="tg-testimonial-2-pagination swiper-pagination mt-40"></div>
               </Swiper>
            </div>
         </div>
      </div>
   )
}

export default Testimonial
