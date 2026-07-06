
"use client"
import { preventNativeFormSubmit } from "@/utils/preventNativeFormSubmit"

const BlogForm = () => {

   return (
      <form onSubmit={preventNativeFormSubmit}>
         <div className="row gx-15">
            <div className="col-lg-12">
               <textarea className="textarea  mb-5" placeholder="Comment" aria-label="Comment"></textarea>
            </div>
            <div className="col-lg-4 mb-15">
               <input className="input" type="text" placeholder="Name" aria-label="Name" />
            </div>
            <div className="col-lg-4 mb-15">
               <input className="input" type="email" placeholder="Email" aria-label="Email" />
            </div>
            <div className="col-lg-4 mb-15">
               <input className="input" type="text" placeholder="Website" aria-label="Website" />
            </div>
            <div className="col-lg-12">
               <div className="review-checkbox d-flex align-items-center mb-25">
                  <input className="tg-checkbox" type="checkbox" id="australia" />
                  <label htmlFor="australia" className="tg-label">Save my name, email, and website in this browser for the next time I comment.</label>
               </div>
               <button type="submit" className="tg-btn tg-btn-switch-animation">
                  <span className="d-flex align-items-center justify-content-center">
                     <span className="btn-text">Submit Post</span>
                     <span className="btn-icon ml-5">
                        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M1 8H19.95M19.95 8L12.98 1.03M19.95 8L12.98 14.97" stroke="white" strokeWidth="1.77778" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </span>
                     <span className="btn-icon ml-5">
                        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M1 8H19.95M19.95 8L12.98 1.03M19.95 8L12.98 14.97" stroke="white" strokeWidth="1.77778" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </span>
                  </span>
               </button>
            </div>
         </div>
      </form>
   )
}

export default BlogForm
