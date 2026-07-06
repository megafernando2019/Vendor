"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import Image, { StaticImageData } from "next/image"
import { useState } from 'react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import thumb_1 from "@/assets/img/tour-details/details-2/slider-big-1.webp"
import thumb_2 from "@/assets/img/blog/sidebar/standard.webp"
import thumb_3 from "@/assets/img/blog/sidebar/standard-2.webp"
import thumb_4 from "@/assets/img/blog/sidebar/standard-3.webp"
import thumb_5 from "@/assets/img/blog/sidebar/standard-4.webp"
import thumb_6 from "@/assets/img/tour-details/details-2/slider-big-6.webp"

import thumb_s1 from "@/assets/img/tour-details/details-2/slider-1.webp"
import thumb_s2 from "@/assets/img/tour-details/details-2/slider-2.webp"
import thumb_s3 from "@/assets/img/tour-details/details-2/slider-3.webp"
import thumb_s4 from "@/assets/img/tour-details/details-2/slider-4.webp"
import thumb_s5 from "@/assets/img/tour-details/details-2/slider-5.webp"

const slider_b: StaticImageData[] = [thumb_1, thumb_2, thumb_3, thumb_4, thumb_5, thumb_6];
const slider_s: { id: string; img: StaticImageData }[] = [
   { id: "slider-s1", img: thumb_s1 },
   { id: "slider-s2", img: thumb_s2 },
   { id: "slider-s3", img: thumb_s3 },
   { id: "slider-s4", img: thumb_s4 },
   { id: "slider-s5", img: thumb_s5 },
   { id: "slider-s6", img: thumb_s1 },
];


const AboutSlider = () => {

   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

   return (
      <div className="tg-tour-details-gallery-slider-wrap mb-40">
         <Swiper
            loop={true}
            navigation={{
               nextEl: '.tg-tour-details-gallery-next',
               prevEl: '.tg-tour-details-gallery-prev',
            }}
            slidesPerView={1}
            centeredSlides={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="swiper-container tg-tour-details-gallery-active mb-20"
         >

            {slider_b.map((item) => (
               <SwiperSlide key={String(item.src)} className="swiper-slide">
                  <div className="tg-tour-details-gallery-thumb">
                     <Image className="w-100" src={item} alt="" />
                  </div>
               </SwiperSlide>
            ))}
            <div className="tg-tour-details-gallery-navigation">
               <button type="button" className="tg-tour-details-gallery-prev" aria-label="Previous image">
                  <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M20.04 7.45H1.86M1.86 7.45L8.23 1.09M1.86 7.45L8.23 13.82" stroke="currentColor" strokeWidth="1.81818" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
               <button type="button" className="tg-tour-details-gallery-next" aria-label="Next image">
                  <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M0.96 7.45H19.14M19.14 7.45L12.77 1.09M19.14 7.45L12.77 13.82" stroke="currentColor" strokeWidth="1.81818" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
            </div>
         </Swiper>
         <div className="row justify-content-center">
            <div className="col-lg-12">
               <Swiper
                  onSwiper={setThumbsSwiper}
                  slidesPerView={5}
                  spaceBetween={20}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Thumbs]}
                  className="swiper-container tg-tour-details-gallery-thumb-active p-relative"
                  breakpoints={{
                     768: { spaceBetween: 20 },
                     576: { spaceBetween: 10 },
                     0: { spaceBetween: 10 },
                  }}
               >
                  {slider_s.map(({ id, img }) => (
                     <SwiperSlide key={id} className="swiper-slide">
                        <div className="tg-tour-details-gallery-thumb">
                           <Image className="w-100" src={img} alt="" />
                        </div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>
         </div>
      </div>
   )
}

export default AboutSlider
