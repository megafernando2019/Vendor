import Image from "next/image";
import Button from "@/components/common/Button";
import Choose5 from "@/svg/home-one/Choose5";
import Choose4 from "@/svg/home-one/Choose4";

import img_1 from "@/assets/img/chose/chose-3/bridge.png";
import img_2 from "@/assets/img/chose/chose-3/map.png";
import img_3 from "@/assets/img/chose/chose-3/circle-text.png";
import img_4 from "@/assets/img/chose/chose-3/star.png";
import img_5 from "@/assets/img/chose/chose-3/thumb-2.jpg";
import img_6 from "@/assets/img/chose/chose-3/thumb-1.jpg";

const Choose = () => {
  return (
    <div className="tg-chose-area p-relative z-index-1  tg-grey-bg pt-115 pb-90">
      <Image className="tg-chose-3-shape p-absolute" src={img_1} alt="shape" />
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="tg-chose-3-left p-relative mb-35">
              <Image className="tg-chose-3-map" src={img_2} alt="map" />
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-6">
                  <div className="tg-chose-3-thumb">
                    <div className="p-relative mt-45 ml-45">
                      <Image
                        width={70}
                        height={70}
                        className="tg-chose-3-star"
                        src="/assets/logos/isologo300ppx.png"
                        alt="shape"
                      />
                    </div>
                    <Image className="main-thumb mt-50" src={img_5} alt="" />
                  </div>
                </div>
                <div className="col-lg-8 col-md-6 col-sm-6">
                  <div className="tg-chose-3-thumb-inner p-relative">
                    <div className="tg-chose-3-thumb-2">
                      <Image className="w-100 tg-round-15" src={img_6} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="tg-chose-content mb-25">
              <div className="tg-chose-section-title mb-30">
                <h5
                  className="tg-section-subtitle mb-15 wow fadeInUp"
                  data-wow-delay=".3s"
                  data-wow-duration=".1s"
                >
                  Encuentra todo lo que necesitas saber sobre Vendor
                </h5>
                <h2
                  className="mb-15 text-capitalize wow fadeInUp"
                  data-wow-delay=".4s"
                  data-wow-duration=".9s"
                >
                  Centro de Aprendizaje
                </h2>
                <p
                  className="text-capitalize wow fadeInUp"
                  data-wow-delay=".5s"
                  data-wow-duration=".9s"
                >
                  Accede a recursos especializados para dominar la plataforma,
                  resolver dudas rápidamente y potenciar las ventas de tu
                  agencia..
                </p>
              </div>
              <div className="tg-chose-list-wrap">
                <div
                  className="tg-chose-list d-flex mb-15 wow fadeInUp align-items-center"
                  data-wow-delay=".6s"
                  data-wow-duration=".9s"
                >
                  <span className="tg-chose-list-icon mr-20 text-orange-custom">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 14v-3a8 8 0 1 1 16 0v3" />
                      <path d="M18 19c0 1.657 -2.686 3 -6 3" />
                      <path d="M4 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3" />
                      <path d="M15 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3" />
                    </svg>
                  </span>
                  <div className="tg-chose-list-content">
                    <h4 className="tg-chose-list-title mb-5">Asesores</h4>
                  </div>
                </div>
                <div
                  className="tg-chose-list d-flex vertica-align-middle mb-10 wow fadeInUp"
                  data-wow-delay=".7s"
                  data-wow-duration=".9s"
                >
                  <span className="tg-chose-list-icon mr-20 text-orange-custom">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 4a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-12" />
                      <path d="M3 13h18" />
                      <path d="M8 21h8" />
                      <path d="M10 17l-.5 4" />
                      <path d="M14 17l.5 4" />
                    </svg>
                  </span>
                  <div className="tg-chose-list-content">
                    <h4 className="tg-chose-list-title mb-5">Plataforma</h4>
                  </div>
                </div>
                <div
                  className="tg-chose-list d-flex mb-40 wow fadeInUp"
                  data-wow-delay=".7s"
                  data-wow-duration=".9s"
                >
                  <span className="tg-chose-list-icon mr-20 text-orange-custom">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 21l18 0" />
                      <path d="M4 21v-11l2.5 -4.5l5.5 -2.5l5.5 2.5l2.5 4.5v11" />
                      <path d="M10 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M9 21v-5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v5" />
                    </svg>
                  </span>
                  <div className="tg-chose-list-content">
                    <h4 className="tg-chose-list-title mb-5">Programas</h4>
                  </div>
                </div>
                <div
                  className="tg-chose-btn wow fadeInUp"
                  data-wow-delay=".8s"
                  data-wow-duration=".9s"
                >
                  <a
                    href="contact.html"
                    className="tg-btn tg-btn-switch-animation"
                  >
                    <Button text="Comenzar" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
