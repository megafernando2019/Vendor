import pricing_data from "@/data/PricingData"
import Link from "next/link"

const PricingArea = () => {
   return (
      <div className="tg-pricing-area pb-100 pt-125">
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="tg-location-section-title text-center mb-40">
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".9s">Best Holiday Packages</h5>
                     <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">Popular Travel Destinations <br /> Available Worldwide</h2>
                  </div>
               </div>
               {pricing_data.map((item) => (
                  <div key={item.id} className="col-lg-4 col-md-6">
                     <div className="tg-pricing-wrap mb-30 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".9s">
                        <div className="tg-pricing-head">
                           <h4 className="tg-pricing-title mb-20">{item.title}</h4>
                           <p className="mb-25">{item.desc}</p>
                        </div>
                        <div className="tg-pricing-price mb-25">
                           <h2><span>$</span>{item.price}</h2>
                           <span className="dates">/month *</span>
                        </div>
                        <div className="tg-pricing-btn mb-40">
                           <Link className="tg-btn text-center w-100" href="/contact">Buy Now</Link>
                        </div>
                        <div className="tg-pricing-list">
                           <ul>
                              {item.list.map((feature) => (
                                 <li key={feature}>
                                    <span className="icon">
                                       <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M17 8.27V9C16.999 10.73 16.44 12.41 15.41 13.79C14.37 15.17 12.92 16.18 11.27 16.67C9.61 17.16 7.85 17.10 6.23 16.50C4.61 15.91 3.23 14.80 2.29 13.35C1.35 11.907 0.90 10.195 1.02 8.47C1.13 6.75 1.80 5.11 2.92 3.80C4.04 2.49 5.55 1.58 7.24 1.20C8.92 0.82 10.68 0.99 12.256 1.69M17 2.60L9 10.61L6.6 8.21" stroke="#560CE3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </span>
                                    <span>{feature}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default PricingArea
