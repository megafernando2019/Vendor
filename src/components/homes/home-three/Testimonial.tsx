"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import {
  testi_data,
  testi_data_plataform,
  testi_data_programs,
} from "@/data/TestimonialData";
import { Tabs } from "../../common/Tabs";
import StarRating from "../../common/StarRating";

const AVATAR_SIZE = 56;

const setting = {
  spaceBetween: 25,
  loop: true,
  speed: 500,
  autoplay: {
    delay: 4000,
  },
  pagination: false,
  navigation: false,
  breakpoints: {
    "1400": {
      slidesPerView: 3,
    },
    "992": {
      slidesPerView: 2,
    },
    "0": {
      slidesPerView: 1,
    },
  },
};

interface TestimonialItem {
  id: number;
  avatar: StaticImageData;
  name: string;
  designation: string;
  rating: number;
  desc: string;
}

const QuoteIcon = () => (
  <span>
    <svg
      width="44"
      height="34"
      viewBox="0 0 44 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.23 33.5V28.42L2.54 28.16L2.54 28.16C5.54 27.56 7.73 26.35 8.91 24.48L8.91 24.48L8.91 24.479C9.51 23.51 9.85 22.41 9.90 21.27L9.92 20.75H9.40H2.86C2.43 20.75 2.02 20.58 1.71 20.274C1.41 19.97 1.23 19.556 1.23 19.125V4.25C1.23 2.18 2.92 0.5 4.98 0.5H17.73C18.17 0.5 18.58 0.67 18.88 0.98C19.19 1.28 19.36 1.69 19.36 2.125V19.125V19.17L19.364 19.20C19.36 19.21 19.37 19.22 19.37 19.23C19.37 19.27 19.37 19.33 19.37 19.41C19.38 19.57 19.38 19.795 19.37 20.08C19.35 20.66 19.275 21.48 19.08 22.419C18.696 24.31 17.83 26.70 15.90 28.79L1.23 33.5ZM1.23 33.5H2.86C8.68 33.5 13.04 31.89 15.90 28.79L1.23 33.5ZM24.62 33.5V28.42L25.93 28.16L25.93 28.16C28.93 27.56 31.119 26.35 32.30 24.48L32.30 24.48L32.30 24.479C32.90 23.51 33.24 22.41 33.29 21.27L33.31 20.75H32.79H26.25C25.82 20.75 25.40 20.58 25.10 20.274C24.80 19.97 24.62 19.556 24.62 19.125V4.25C24.62 2.18 26.31 0.5 28.37 0.5H41.12C41.56 0.5 41.97 0.67 42.27 0.98C42.578 1.28 42.75 1.69 42.75 2.125V19.125V19.17L42.75 19.20C42.75 19.21 42.76 19.22 42.76 19.23C42.76 19.27 42.76 19.33 42.76 19.41C42.77 19.57 42.77 19.79 42.76 20.084C42.74 20.66 42.66 21.48 42.47 22.419C42.08 24.31 41.21 26.70 39.29 28.79C36.43 31.89 32.07 33.5 26.25 33.5H24.62ZM19.36 19.18C19.36 19.176 19.36 19.18 19.36 19.18C19.36 19.18 19.36 19.18 19.36 19.18Z"
        stroke="#D1D1D1"
      />
    </svg>
  </span>
);

const TestimonialSlide = ({ item }: { item: TestimonialItem }) => (
  <div className="tg-testimonial-item mb-30">
    <div className="tg-testimonial-avatar-top d-flex align-items-start justify-content-between">
      <div className="tg-testimonial-avatar-inner d-flex align-items-center mr-20 mb-20">
        <div className="tg-testimonial-avatar-thumb mr-15">
          <Image
            src={item.avatar}
            alt={item.name}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
          />
        </div>
        <div className="tg-testimonial-avatar-content">
          <h5>{item.name}</h5>
          <span>{item.designation}</span>
        </div>
      </div>
      <div className="tg-testimonial-avatar-qoute">
        <QuoteIcon />
      </div>
    </div>
    <p className="tg-testimonial-avatar-para mb-10">{item.desc}</p>
    <div className="tg-testimonial-ratings">
      <StarRating rating={item.rating} />
    </div>
  </div>
);

const TestimonialSlider = ({ items }: { items: TestimonialItem[] }) => (
  <Swiper
    {...setting}
    modules={[Autoplay]}
    className="swiper-container tg-testimonial-slider tg-testimonial-section__slider fix"
  >
    {items.map((item) => (
      <SwiperSlide key={item.id} className="swiper-slide">
        <TestimonialSlide item={item} />
      </SwiperSlide>
    ))}
  </Swiper>
);

const tabItems = [
  {
    key: "asesores",
    label: "Asesores",
    children: <TestimonialSlider items={testi_data} />,
  },
  {
    key: "plataforma",
    label: "Plataforma",
    children: <TestimonialSlider items={testi_data_plataform} />,
  },
  {
    key: "programas",
    label: "Programas",
    children: <TestimonialSlider items={testi_data_programs} />,
  },
];

const Testimonial = () => {
  return (
    <div
      className="tg-testimonial-section tg-listing-area pt-105 pb-100 bg-testimonial"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-9">
            <div className="tg-location-section-title text-center mb-30">
              <h2
                className="mb-15 text-capitalize wow fadeInUp text-purple text-morado-custom"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Nuestros Clientes
              </h2>
              <h5
                className="mb-15 wow fadeInUp text-hortencia"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Encuentra lo que otras agencias opinan y convencete
              </h5>
            </div>
          </div>
          <div className="col-12 p-50 mt-50">
            <Tabs
              panelClassName="app-tabs__panel app-tabs__panel--testimonial"
              defaultActiveKey="asesores"
              items={tabItems}
              layout="horizontal"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
