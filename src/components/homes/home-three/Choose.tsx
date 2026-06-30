import Image from "next/image"
import Choose4 from "@/svg/home-one/Choose4"
import Choose5 from "@/svg/home-one/Choose5"
import Button from "@/components/common/Button"

import choose_shape from "@/assets/img/chose/chose-shape-2.png"
import choose_shape2 from "@/assets/img/chose/chose-shape.png"
import choose_thumb from "@/assets/img/chose/chose.png"
import choose_thumb2 from "@/assets/img/chose/chose-2.jpg"
import iconAsesores from "@/assets/img/centro-aprendizaje/Asesores.png"
import iconPlataforma from "@/assets/img/centro-aprendizaje/Plataforma.png"
import iconProgramas from "@/assets/img/centro-aprendizaje/Programas.png"
import Link from "next/link"


const Choose = () => {
   return (
      <div className="tg-chose-area p-relative pt-135 pb-100">
         <Image className="tg-chose-shape p-absolute" src={choose_shape} alt="shape" />
         <div className="container">
            <div className="row">
               <div className="col-lg-7">
                  <div className="tg-chose-right mb-25">
                     <div className="row">
                        <div className="col-lg-3 col-md-6">
                           <div className="tg-chose-thumb">
                              <Image className="tg-chose-shape-2 mb-30 ml-15 d-none d-lg-block" src={choose_shape2} alt="shape" />
                              <Image className="w-100 wow fadeInRight" data-wow-delay=".4s" data-wow-duration=".9s" src={choose_thumb} alt="chose" />
                           </div>
                        </div>
                        <div className="col-lg-9 col-md-6">
                           <div className="tg-chose-thumb-inner p-relative">
                              <div className="tg-chose-thumb-2 wow fadeInRight" data-wow-delay=".5s" data-wow-duration=".9s">
                                 <Image className="w-100 tg-round-15" src={choose_thumb2} alt="chose" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-lg-5">
                  <div className="tg-chose-content mb-25">
                     <div className="tg-chose-section-title mb-30">
                        <h5 className="mb-15 wow fadeInUp text-hortencia text-purple text-morado-custom" data-wow-delay=".3s" data-wow-duration=".1s">Encuentra todo lo que quieras saber sobre Vendor</h5>                       
                        <h2 className="mb-15 text-capitalize wow fadeInUp text-dark" data-wow-delay=".4s" data-wow-duration=".9s">Centro de Aprendizaje</h2> 
                         <p className="text-capitalize wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">Accede a recursos especializados para dominar la plataforma, resolver dudas rápidamente y potenciar las ventas de tu agencia.</p>
                     </div>
                     <div className="tg-chose-list-wrap">
                        <div className="tg-chose-list d-flex mb-15 wow fadeInUp" data-wow-delay=".6s" data-wow-duration=".9s"  style={{ alignItems: 'center' }}>
                           <span className="tg-chose-list-icon mr-20"> 
                               <Image src={iconAsesores} width={80} height={80} alt="asesores"/>
                           </span>
                           <div className="tg-chose-list-content">
                              <h4 className="tg-chose-list-title mb-5">Asesores</h4>
                           </div>
                        </div>
                        <div className="tg-chose-list d-flex mb-25 wow fadeInUp" data-wow-delay=".7s" data-wow-duration=".9s"  style={{ alignItems: 'center' }}>
                           <span className="tg-chose-list-icon mr-20">                                                                                
                               <Image src={iconPlataforma} width={80} height={80} alt="asesores"/>
                           </span>
                           <div className="tg-chose-list-content">
                              <h4 className="tg-chose-list-title mb-5">Plataforma</h4>
                           </div>
                        </div>
                       <div className="tg-chose-list d-flex mb-25 wow fadeInUp" data-wow-delay=".7s" data-wow-duration=".9s"  style={{ alignItems: 'center' }}>
                           <span className="tg-chose-list-icon mr-20">
                               <Image src={iconProgramas} width={80} height={80} alt="asesores"/>
                           </span>
                           <div className="tg-chose-list-content">
                              <h4 className="tg-chose-list-title mb-5">Programas</h4>
                           </div>
                        </div>
                        <div className="tg-chose-btn wow fadeInUp" data-wow-delay=".8s" data-wow-duration=".9s">
                           <Link href="/faqs" className="tg-btn tg-btn-switch-animation">
                              <Button text="Comienza" />
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>


            </div>
         </div>
      </div>
   )
}

export default Choose
