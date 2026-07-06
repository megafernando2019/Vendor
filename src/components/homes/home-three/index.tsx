"use client";

import BookingFormsSticky from "../../common/banner-form/BookingFormsSticky";

import Banner from "./Banner";

import Choose from "./Choose";

import Testimonial from "./Testimonial";

import dynamic from "next/dynamic";

import FooterThree from "@/components/common/FooterThree";

import WowSection from "@/components/common/WowSection";

import useWow from "@/hooks/useWow";

import Image from "next/image";

import Link from "next/link";

const RecommendationCarrousel = dynamic(
  () => import("./RecommendationCarrousel"),

  { ssr: false },
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
          <BookingFormsSticky />

          <WowSection animation="fadeInUp" delay=".3s" duration=".9s">
            <div className="tg-listing-area pt-100 pb-20 tg-grey-bg">
              <div className="container">
                <h2 className="text-secondary text-center d-flex align-items-center justify-content-center p-10">
                  Hazlo fácil. Hazlo rápido. Hazlo a tu manera
                </h2>
              </div>
            </div>
          </WowSection>

          <WowSection animation="fadeInUp" delay=".2s" duration=".9s">
            <RecommendationCarrousel
              sectionKey="top_10"
              subtitle="Los tours más populares y mejor valorados"
              title="TOP 10"
              backgroundImage="bg-top10"
            />
          </WowSection>

          <WowSection animation="fadeInUp" delay=".2s" duration=".9s">
            <RecommendationCarrousel
              sectionKey="cruceros"
              subtitle="Viajes con crucero incluido"
              title="CRUCEROS"
              backgroundImage="bg-cruceros"
            />
          </WowSection>

          <WowSection animation="fadeInLeft" delay=".2s" duration=".9s">
            <Choose />
          </WowSection>
          <WowSection className="bg-cards-blog" animation="fadeInLeft" delay=".2s" duration=".9s">
            <div className="container">
              <div className="row d-flex justify-content-between">
                <div className="col-md-4 rounded">
                  <Link href="/blog-details">
                    <Image
                      src="/assets/img/blog/pages/promociones-exclusivas.png"
                      alt="promociones exclusivas"
                      className="img-fluid roundedclerar"
                      width={350}
                      height={350}
                    />
                  </Link>
                </div>
                <div className="col-md-4 rounded">
                  <Link href="/blog-grid">
                    <Image
                      src="/assets/img/blog/pages/protege-a-tus-pasajeros.png"
                      alt="protege a tus pasajeros"
                      className="img-fluid rounded"
                      width={350}
                      height={350}
                    />
                  </Link>
                </div>
                <div className="col-md-4 rounded">
                  <Link href="block-standard">
                    <Image
                      src="/assets/img/blog/pages/viajando-x-mis-xv.png"
                      alt="viajando por mis xv"
                      className="img-fluid rounded"
                      width={350}
                      height={350}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </WowSection>

          <RecommendationCarrousel
            sectionKey="ofertas"
            subtitle="Promociones y precios especiales"
            title="OFERTAS"
            backgroundImage="bg-ofertas"
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
