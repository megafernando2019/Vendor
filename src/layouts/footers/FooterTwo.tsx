"use client"
import Image from "next/image"
import Link from "next/link"
import { preventNativeFormSubmit } from "@/utils/preventNativeFormSubmit"

import logo from "@/assets/img/logo/logo-white.webp"

const FooterTwo = () => {
   return (
      <footer>
         <div className="tg-footer-area tg-footer-su-wrapper tg-footer-su-2-wrapper pt-130 include-bg" style={{ backgroundImage: `url(/assets/img/footer/footer-3.webp)` }}>
            <div className="container">
               <div className="tg-footer-top mb-45">
                  <div className="row">
                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                        <div className="tg-footer-widget mb-40">
                           <div className="tg-footer-logo mb-20">
                              <Link href="/"><Image src={logo} alt="" /></Link>
                           </div>
                           <p className="mb-20">Pharetra maecenas felisey vestibulum
                              convallis mollis nullam congue sittle
                              rivers of Finland Quebec.</p>
                           <div className="tg-footer-form mb-30">
                              <form onSubmit={preventNativeFormSubmit}>
                                 <input aria-label="Enter your mail" type="email" placeholder="Enter your mail" />
                                 <button className="tg-footer-form-btn" type="submit" aria-label="Subscribe">
                                    <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M1.53 8.47H20.47M20.47 8.47L13.5 1.5M20.47 8.47L13.5 15.45" stroke="white" strokeWidth="1.77778" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                 </button>
                              </form>
                           </div>
                           <div className="tg-footer-social">
                              <Link href="#"><i className="fa-brands fa-facebook-f"></i></Link>
                              <Link href="#"><i className="fa-brands fa-twitter"></i></Link>
                              <Link href="#"><i className="fa-brands fa-instagram"></i></Link>
                              <Link href="#"><i className="fa-brands fa-pinterest-p"></i></Link>
                              <Link href="#"><i className="fa-brands fa-youtube"></i></Link>
                           </div>
                        </div>
                     </div>
                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                        <div className="tg-footer-widget tg-footer-link ml-80 mb-40">
                           <h3 className="tg-footer-widget-title mb-25">Quick Links</h3>
                           <ul>
                              <li><Link href="/">Home</Link></li>
                              <li><Link href="/about">About Us</Link></li>
                              <li><Link href="#">Services</Link></li>
                              <li><Link href="#">Tour Guide</Link></li>
                              <li><Link href="/contact"> Contact Us</Link></li>
                           </ul>
                        </div>
                     </div>
                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                        <div className="tg-footer-widget tg-footer-link mb-40">
                           <h3 className="tg-footer-widget-title mb-25">Utility Pages</h3>
                           <ul>
                              <li><Link href="#">Style Guide</Link></li>
                              <li><Link href="#">Password Protected</Link></li>
                              <li><Link href="#">404 Error</Link></li>
                              <li><Link href="#">Changelog</Link></li>
                              <li><Link href="#">License</Link></li>
                           </ul>
                        </div>
                     </div>
                     <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                        <div className="tg-footer-widget tg-footer-info mb-40">
                           <h3 className="tg-footer-widget-title mb-25">Information</h3>
                           <ul>
                              <li>
                                 <Link className="d-flex" href="https://www.google.com/maps/@41.6758525,-86.2531698,18.17z">
                                    <span className="mr-15">
                                       <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M19 10.06C19 16.85 10.33 22.67 10.33 22.67C10.33 22.67 1.67 16.85 1.67 10.06C1.67 7.75 2.58 5.53 4.21 3.89C5.83 2.25 8.04 1.33 10.33 1.33C12.63 1.33 14.84 2.25 16.46 3.89C18.09 5.53 19 7.75 19 10.06Z" stroke="white" strokeWidth="1.73333" strokeLinecap="round" strokeLinejoin="round" />
                                          <path d="M10.33 12.97C11.93 12.97 13.22 11.67 13.22 10.06C13.22 8.45 11.93 7.15 10.33 7.15C8.74 7.15 7.45 8.45 7.45 10.06C7.45 11.67 8.74 12.97 10.33 12.97Z" stroke="white" strokeWidth="1.73333" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </span>
                                    58 Street Commercial Road<br /> Fratton, Australia
                                 </Link>
                              </li>
                              <li>
                                 <Link className="d-flex" href="tel:+1238889999">
                                    <span className="mr-15">
                                       <i className="fa-sharp text-white fa-solid fa-phone"></i>
                                    </span>
                                    +123 888 9999
                                 </Link>
                              </li>
                              <li className="d-flex">
                                 <span className="mr-15">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M12 5.60V12L16.27 14.13M22.67 12C22.67 17.89 17.89 22.67 12 22.67C6.11 22.67 1.33 17.89 1.33 12C1.33 6.11 6.11 1.33 12 1.33C17.89 1.33 22.67 6.11 22.67 12Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                 </span>
                                 <p className="mb-0">
                                    Mon – Sat: 8 am – 5 pm,<br />
                                    Sunday: <span className="text-white d-inline-block">CLOSED</span>
                                 </p>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="tg-footer-copyright text-center">
               <span>
                  Copyright <Link href="#">©Tourex</Link> |  All Right Reserved
               </span>
            </div>
         </div>
      </footer>
   )
}

export default FooterTwo
