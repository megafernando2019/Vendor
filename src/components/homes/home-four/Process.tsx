import Image, { StaticImageData } from "next/image";
import { JSX } from "react";
import Link from "next/link";
import Process7 from "@/svg/home-one/Process7";
import Process8 from "@/svg/home-one/Process8";
import Process9 from "@/svg/home-one/Process9";

import process_1 from "@/assets/img/chose/chose-2/thumb-1.webp"
import process_2 from "@/assets/img/chose/chose-2/thumb-2.webp"
import process_3 from "@/assets/img/chose/chose-2/thumb-3.webp"
import shape from "@/assets/img/chose/chose-2/shape.webp"

interface DataType {
   id: number;
   thumb?: StaticImageData;
   icon?: JSX.Element;
   title?: string;
   desc?: string;
}

const process_data: DataType[] = [
   {
      id: 1,
      thumb: process_1,
   },
   {
      id: 2,
      icon: (<><Process7 /></>),
      title: "Best Travel Agency",
      desc: "Are you tired offer theare typical tourist new destination"
   },
   {
      id: 3,
      thumb: process_2,
   },
   {
      id: 4,
      icon: (<><Process8 /></>),
      title: "Secure Journey With Us",
      desc: "Are you tired offer theare typical tourist new destination"
   },
   {
      id: 5,
      thumb: process_3,
   },
   {
      id: 6,
      icon: (<><Process9 /></>),
      title: "Top Class Places",
      desc: "Are you tired offer theare typical tourist new destination"
   },
];

const Process = () => {
   return (
      <div className="tg-chose-area p-relative z-index-9 pt-135 pb-35">
         <Image className="tg-chose-2-shape d-none d-lg-block" src={shape} alt="shape" />
         <div className="container">
            <div className="col-12">
               <div className="tg-chose-section-title text-center mb-30">
                  <h5 className="tg-section-subtitle wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".6s">Next Adventure Destination</h5>
                  <h2 className="mb-15 wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".7s">Why You Should Work With Us</h2>
                  <p className="text-capitalize wow fadeInUp" data-wow-delay=".6s" data-wow-duration=".8s">Are you tired of the typical tourist destinations and looking<br />
                     to step out of your comfort zonetravel</p>
               </div>
            </div>
            <div className="row">
               {process_data.map((item) => (
                  item.thumb ? (
                     <div key={item.id} className="col-lg-4 col-md-6 col-sm-6 mb-25">
                        <div className="tg-chose-2-thumb h-100 wow fadeInLeft" data-wow-delay=".4s" data-wow-duration=".6s">
                           <Image className="w-100 h-100" src={item.thumb} alt="chose" />
                        </div>
                     </div>
                  ) : (
                     <div key={item.id} className="col-lg-4 col-md-6 col-sm-6 mb-25">
                        <div className="tg-chose-2-content p-relative text-center z-index-1 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".6s">
                           <span className="tg-chose-2-box-shape">
                              <svg width="62" height="57" viewBox="0 0 62 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M83.01 6.07L59.90 44.62M83.01 6.07L44.47 29.19M83.01 6.07L48.83 40.26M59.90 44.62L83.01 83.158M59.90 44.62L62.248 48.72L79.30 44.62L62.38 40.38L59.90 44.62ZM59.90 44.62L50.71 44.62M83.01 83.158L44.47 60.04M83.01 83.158L48.83 48.97M44.47 60.04L5.93 83.158M44.47 60.04L48.57 62.391L44.47 79.44L40.24 62.52L44.47 60.04ZM44.47 60.04L44.47 50.85M5.93 83.158L29.05 44.62M5.93 83.158L40.11 48.97M29.05 44.62L5.93 6.07M29.05 44.62L26.57 40.38L9.65 44.62L26.57 48.85L29.05 44.62ZM29.05 44.62L38.23 44.62M5.93 6.07L44.47 29.19M5.93 6.07L40.11 40.26M44.47 29.19L40.24 26.71L44.47 9.79L48.70 26.71L44.47 29.19ZM44.47 29.19L44.47 38.38M48.83 40.26C51.22 42.65 51.24 46.56 48.83 48.97M48.83 40.26C46.44 37.86 42.51 37.86 40.11 40.26M48.83 48.97C46.44 51.37 42.53 51.388 40.11 48.97M40.11 48.97C37.72 46.58 37.70 42.671 40.11 40.26M8.92 67.99C-0.39 53.93 -0.27 35.43 8.92 21.24M67.85 80.17C53.79 89.482 35.29 89.35 21.10 80.17M80.02 21.24C89.339 35.3 89.21 53.80 80.02 67.99M21.10 9.06C35.157 -0.25 53.66 -0.12 67.85 9.06" stroke="#E8E4F0" strokeWidth="3.33289" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </span>
                           <div className="tg-chose-2-icon mb-20">
                              {item.icon}
                           </div>
                           <h4 className="tg-chose-2-title mb-15"><Link href="/contact">{item.title}</Link></h4>
                           <p>{item.desc}</p>
                        </div>
                     </div>
                  )
               ))}
            </div>
         </div>
      </div>
   )
}

export default Process
