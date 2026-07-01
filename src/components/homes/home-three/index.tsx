"use client";

import BookingFormsSticky from "../../common/banner-form/BookingFormsSticky";

import Banner from "./Banner";

import Choose from "./Choose";

import Testimonial from "./Testimonial";

import dynamic from "next/dynamic";

import FooterThree from "@/layouts/footers/FooterThree";

import WowSection from "@/components/common/WowSection";

import useWow from "@/hooks/useWow";



const RecommendationCarrousel = dynamic(

  () => import("./RecommendationCarrousel"),

  { ssr: false }

);



const HomeThree = () => {

  useWow();



  return (

    <>

      <main>

        <WowSection animation="fadeIn" duration="1s" delay="0s">

          <Banner />

        </WowSection>



        <div className="tg-booking-sticky-scope">

          <WowSection animation="fadeInDown" delay=".2s" duration=".9s">

            <BookingFormsSticky />

          </WowSection>



          <WowSection animation="fadeInUp" delay=".3s" duration=".9s">

            <div className="tg-listing-area pt-100 pb-20 tg-grey-bg">

              <div className="container">

                <h2 className="text-secondary text-center d-flex align-items-center justify-content-center p-10">

                  Hazlo fácil. Hazlo rápido. Hazlo a tu manera

                </h2>

              </div>

            </div>

          </WowSection>



          <RecommendationCarrousel

            sectionKey="top_10"

            subtitle="Los tours más populares y mejor valorados"

            title="TOP 10"

            backgroundImage="/assets/img/Top-10/Top-10.png"

          />



          <RecommendationCarrousel

            sectionKey="cruceros"

            subtitle="Viajes con crucero incluido"

            title="CRUCEROS"

            backgroundImage="/assets/img/cruceros/Cruceros.png"

          />



          <WowSection animation="fadeInLeft" delay=".2s" duration=".9s">

            <Choose />

          </WowSection>



          <RecommendationCarrousel

            sectionKey="ofertas"

            subtitle="Promociones y precios especiales"

            title="OFERTAS"

            backgroundImage="/assets/img/ofertas/Ofertas.png"

            includeBg={false}

            headerClassName=""

            titleColumnClassName="col-lg-12 py-20"

          />



          <WowSection animation="fadeInUp" delay=".2s" duration=".9s">

            <Testimonial />

          </WowSection>

        </div>

      </main>



      <WowSection animation="fadeInUp" delay=".2s" duration=".9s">

        <FooterThree />

      </WowSection>

    </>

  );

};



export default HomeThree;

