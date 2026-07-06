import Ads from "./Ads"
import Category from "./Category"
import RecentPost from "./RecentPost"
import Tags from "./Tags"
import { preventNativeFormSubmit } from "@/utils/preventNativeFormSubmit"

const BlogSidebar = () => {
   return (
      <div className="tg-blog-sidebar top-sticky mb-30">
         <div className="tg-blog-sidebar-search tg-blog-sidebar-box mb-40">
            <h5 className="tg-blog-sidebar-title mb-15">Search</h5>
            <div className="tg-blog-sidebar-form">
               <form onSubmit={preventNativeFormSubmit}>
                  <input type="search" placeholder="Type here . . ." aria-label="Search blog posts" />
                  <button type="submit" aria-label="Search">
                     <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_497_1336)">
                           <path d="M17 17L13.52 13.52M15.681 8.34C15.681 12.39 12.39 15.681 8.34 15.681C4.29 15.681 1 12.39 1 8.34C1 4.29 4.29 1 8.34 1C12.39 1 15.681 4.29 15.681 8.34Z" stroke="#560CE3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                           <clipPath id="clip0_497_1336">
                              <rect width="18" height="18" fill="white" />
                           </clipPath>
                        </defs>
                     </svg>
                  </button>
               </form>
            </div>
         </div>
         <Category />
         <RecentPost />
         <Ads />
         <Tags />
      </div>
   )
}

export default BlogSidebar
