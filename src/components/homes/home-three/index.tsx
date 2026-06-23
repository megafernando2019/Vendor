"use client";
import BannerFormThree from "@/components/common/banner-form/BannerFormThree";
import Banner from "./Banner";
import Blog from "./Blog";
import Choose from "./Choose";
import CtaThree from "./Cta";
import CtaTwo from "./CtaTwo";
import Location from "./Location";
import Testimonial from "./Testimonial";
import dynamic from "next/dynamic";
import HeaderThree from "@/layouts/headers/HeaderThree";
import FooterThree from "@/layouts/footers/FooterThree";
import Cta from "../home-one/Cta";
const ListingNuevo = dynamic(() => import("./ListingNuevo"), { ssr: false });
const Top10Carrousel = dynamic(() => import("./Top10Carrousel"), {
  ssr: false,
});
const CrucerosCarrousel = dynamic(() => import("./CrucerosCarrousel"), {
  ssr: false,
});
const HomeThree = () => {
  return (
    <>
      <main>
        <Banner />
        <div className="tg-booking-sticky-scope">
          <BannerFormThree />
          <Top10Carrousel />
          <CrucerosCarrousel />
          <ListingNuevo />
          <Choose />
          <CtaThree />
          <Location />
          <CtaTwo />
          <Testimonial />
          <Blog />
          <Cta />
        </div>
      </main>
      <FooterThree />
    </>
  );
};

export default HomeThree;
