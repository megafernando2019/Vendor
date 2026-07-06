"use client"
import { preventNativeFormSubmit } from "@/utils/preventNativeFormSubmit"

const ShopDetailsForm = () => {

   return (
      <form onSubmit={preventNativeFormSubmit}>
         <div className="row">
            <div className="col-lg-6 mb-15">
               <input aria-label="Your Name" className="input" type="text" placeholder="Your Name" />
            </div>
            <div className="col-lg-6 mb-15">
               <input aria-label="E-mail Address" className="input" type="email" placeholder="E-mail Address" />
            </div>
            <div className="col-lg-12">
               <textarea aria-label="Write Message" className="textarea  mb-5" placeholder="Write Message"></textarea>
               <div className="review-checkbox d-flex align-items-center mb-25">
                  <input className="tg-checkbox" type="checkbox" id="australia" />
                  <label htmlFor="australia" className="tg-label">Save my name, email, and website in this browser for the next time I comment.</label>
               </div>
               <button type="submit" className="tg-btn tg-btn-switch-animation">Submit Review</button>
            </div>
         </div>
      </form>
   )
}

export default ShopDetailsForm
