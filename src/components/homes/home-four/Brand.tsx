"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image, { StaticImageData } from "next/image"
import Link from "next/link"

import logo_1 from "@/assets/img/brand/logo-1.webp"
import logo_2 from "@/assets/img/brand/logo-2.webp"
import logo_3 from "@/assets/img/brand/logo-3.webp"
import logo_4 from "@/assets/img/brand/logo-4.webp"
import logo_5 from "@/assets/img/brand/logo-5.webp"

import shape_1 from "@/assets/img/brand/shape.webp"
import shape_2 from "@/assets/img/brand/shape-2.webp"

const brand_logo: { id: string; logo: StaticImageData }[] = [
   { id: "brand-1", logo: logo_1 },
   { id: "brand-2", logo: logo_2 },
   { id: "brand-3", logo: logo_3 },
   { id: "brand-4", logo: logo_4 },
   { id: "brand-5", logo: logo_5 },
   { id: "brand-6", logo: logo_3 },
   { id: "brand-7", logo: logo_4 },
   { id: "brand-8", logo: logo_5 },
];

const setting = {
   loop: true,
   freeMode: true,
   slidesPerView: 'auto' as const,
   spaceBetween: 25,
   centeredSlides: true,
   allowTouchMove: false,
   speed: 4000,
   autoplay: {
      delay: 1,
      disableOnInteraction: true,
   },
};

const Brand = () => {
   return (
      <div className="tg-brand-area tg-grey-bg pb-80 p-relative z-index-1">
         <Image className="tg-brand-shape" src={shape_1} alt="" />
         <Image className="tg-brand-shape-2" src={shape_2} alt="" />
         <div className="container">
            <div className="row">
               <div className="tg-brand-wrap">
                  <Swiper {...setting} modules={[Autoplay]} className="swiper-container tg-brand-slide fix">
                     {brand_logo.map(({ id, logo }) => (
                        <SwiperSlide key={id} className="swiper-slide">
                           <div className="tg-brand-items">
                              <Link href="#"><Image src={logo} alt="logo" /></Link>
                           </div>
                        </SwiperSlide>
                     ))}
                  </Swiper>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Brand
