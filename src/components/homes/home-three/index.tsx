"use client";
import BookingFormsSticky from "../../common/banner-form/BookingFormsSticky";
import Banner from "./Banner";
import Choose from "./Choose";
import Testimonial from "./Testimonial";
import dynamic from "next/dynamic";
import FooterThree from "@/layouts/footers/FooterThree";
const Top10Carrousel = dynamic(() => import("./Top10Carrousel"), {
  ssr: false,
});
const OfertasCarrousel = dynamic(() => import("./OfertasCarrousel"), {
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
          <BookingFormsSticky />
          <div className="tg-listing-area pt-100 pb-20 tg-grey-bg">
            <div className="container">
              <h2 className="text-secondary text-center d-flex align-items-center justify-content-center p-10">
                Hazlo fácil. Hazlo rápido. Hazlo a tu manera
              </h2>
            </div>
          </div>
          <Top10Carrousel />
          <CrucerosCarrousel />
          <Choose/>
          <OfertasCarrousel/>
          <Testimonial/>
        </div>
      </main>
      <FooterThree />
    </>
  );
};

export default HomeThree;
