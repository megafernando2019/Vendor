"use client"
import Image from "next/image"
import Link from "next/link"
import Comment from "./Comment";
import BlogForm from "@/components/forms/BlogForm";
import BlogSidebar from "../blog-sidebar";

import img_1 from "@/assets/img/blog/sidebar/standard-3.webp"
import img_2 from "@/assets/img/blog/details/video.webp"

interface DataType {
   title_1: string;
   title_2: string;
   desc_1: string;
   desc_2: string;
   desc_3: string;
   desc_4: string;
   desc_5: string;
   list: string[];
}

const blog_content: DataType = {
   title_1: "Exploring The Green Spaces Of Realar Residence Area Harmony with Nature",
   title_2: "Tips For Building Future",
   desc_1: "Welcome to Realar Residence, where sustainability meets comfort in every corner. In this blog post, we are explore the green innovations seamlessly integrated into the fabric.when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
   desc_2: "“ urabitur varius erros area rutrum consequat Mauris sollici area tudino electronic typesetting, remaining essentially dimentum luctus enim”",
   desc_3: "nown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also electronic typesetting remaining essentially unchanged. It was popularised in the with the release of Letraset sheets containingn an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centurie.",
   desc_4: "Seorem Ipsum is simply dummy t the printing and typese tting industry. Lorem Ipsum has been industr.",
   desc_5: "Seorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been industry tandard when an unknown printer took a galley.",
   list: ["Etiam porta sem malesuada euismod.", "porta sem area Product", "Service tiam porta sem malesuada"],
}

const { title_1, title_2, desc_1, desc_2, desc_3, desc_4, desc_5, list } = blog_content;

const BlogDetailsArea = () => {
   return (
      <div className="tg-blog-grid-area pt-130 pb-80">
         <div className="container">
            <div className="row">
               <div className="col-xl-9 col-lg-8">
                  <div className="tg-blog-details-wrap tg-blog-lg-spacing mr-50 mb-50">
                     <div className="tg-blog-standard-item mb-35">
                        <div className="tg-blog-standard-thumb mb-15">
                           <Image className="w-100" src={img_1} alt="blog" />
                        </div>
                        <div className="tg-blog-standard-content">
                           <div className="tg-blog-standard-date mb-10">
                              <span>
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.51 15.29C1.33 15.29 1.16 15.2 1.07 15.11C0.98 14.93 0.89 14.84 0.89 14.67C0.89 13.42 1.24 12.18 1.87 11.02C2.49 9.96 3.47 8.98 4.53 8.36C4.09 7.82 3.73 7.11 3.56 6.40C3.47 5.69 3.47 4.89 3.64 4.27C3.82 3.56 4.27 2.84 4.71 2.31C5.24 1.78 5.87 1.33 6.49 1.16C7.02 0.98 7.56 0.89 8.09 0.89C8.27 0.89 8.53 0.89 8.71 0.89C9.42 0.98 10.13 1.24 10.76 1.69C11.38 2.13 11.822 2.67 12.18 3.29C12.53 3.91 12.71 4.62 12.71 5.42C12.71 6.49 12.36 7.56 11.64 8.36C12.18 8.71 12.71 9.07 13.24 9.51C13.96 10.22 14.40 10.93 14.84 11.82C15.20 12.71 15.38 13.6 15.38 14.58C15.38 14.76 15.29 14.93 15.20 15.02C15.11 15.11 14.93 15.2 14.76 15.2C14.67 15.2 14.58 15.2 14.49 15.11C14.40 15.11 14.31 15.02 14.31 14.93C14.222 14.84 14.222 14.84 14.13 14.76C14.13 14.67 14.04 14.58 14.04 14.49C14.04 13.69 13.87 12.98 13.60 12.27C13.33 11.56 12.89 10.93 12.27 10.4C11.73 9.96 11.20 9.51 10.58 9.24C9.87 9.69 9.07 9.96 8.09 9.96C7.20 9.96 6.31 9.69 5.60 9.24C4.62 9.69 3.73 10.4 3.11 11.38C2.49 12.36 2.13 13.42 2.13 14.58C2.13 14.76 2.04 14.93 1.96 15.02C1.87 15.2 1.69 15.29 1.51 15.29ZM8.09 2.22C7.47 2.22 6.84 2.40 6.31 2.76C5.69 3.11 5.33 3.64 5.07 4.18C4.80 4.80 4.71 5.42 4.89 6.13C4.98 6.76 5.33 7.38 5.78 7.82C6.22 8.27 6.84 8.62 7.47 8.71C7.64 8.71 7.91 8.80 8.09 8.80C8.53 8.80 8.98 8.71 9.33 8.53C9.96 8.27 10.40 7.91 10.84 7.29C11.20 6.76 11.38 6.13 11.38 5.51C11.38 4.62 11.022 3.82 10.40 3.20C9.78 2.49 8.98 2.22 8.09 2.22Z" fill="#560CE3" />
                                 </svg>
                                 by Admin
                              </span>
                              <span>
                                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.77 0.78V3.27M4.23 0.78V3.27M0.78 5.76H13.22M2.16 2.02H11.84C12.60 2.02 13.22 2.58 13.22 3.27V11.98C13.22 12.67 12.60 13.22 11.84 13.22H2.16C1.40 13.22 0.78 12.67 0.78 11.98V3.27C0.78 2.58 1.40 2.02 2.16 2.02Z" stroke="#560CE3" strokeWidth="0.977778" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                                 26th Sep, 2024
                              </span>
                              <span>
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 3.73V8L10.84 9.42M15.11 8C15.11 11.93 11.93 15.11 8 15.11C4.07 15.11 0.89 11.93 0.89 8C0.89 4.07 4.07 0.89 8 0.89C11.93 0.89 15.11 4.07 15.11 8Z" stroke="#560CE3" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                                 5 mins Read
                              </span>
                           </div>
                           <h2 className="tg-blog-standard-title">{title_1}</h2>
                           <p>{desc_1}</p>
                        </div>
                     </div>
                     <blockquote className="tg-blog-blockquote p-relative mb-25">
                        <p>{desc_2}</p>
                        <span className="tg-blog-blockquote-icon">
                           <svg width="38" height="32" viewBox="0 0 38 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M34.78 27.416C32.11 30.458 28.08 32 22.79 32L20.89 32L20.89 26.362L22.42 26.04C25.02 25.492 26.83 24.414 27.80 22.832C28.307 21.98 28.59 21 28.63 20L22.79 20C22.29 20 21.806 19.79 21.45 19.41C21.09 19.04 20.89 18.53 20.89 18L20.89 4C20.89 1.794 22.60 2.39e-06 24.69 2.58e-06L36.09 3.64e-06C36.59 3.68e-06 37.08 0.21 37.43 0.59C37.79 0.96 37.99 1.47 37.99 2L37.99 12L37.98 17.838C38 18.06 38.36 23.32 34.78 27.416ZM3.80 6.54e-07L15.20 1.71e-06C15.699 1.75e-06 16.18 0.21 16.54 0.59C16.89 0.96 17.09 1.47 17.09 2L17.09 12L17.09 17.838C17.106 18.06 17.47 23.32 13.88 27.416C11.22 30.458 7.19 32 1.90 32L-3.81e-06 32L-3.35e-06 26.362L1.53 26.04C4.13 25.492 5.94 24.414 6.91 22.832C7.41 21.98 7.70 21 7.74 20L1.90 20C1.40 20 0.91 19.79 0.56 19.41C0.20 19.04 -2.70e-06 18.53 -2.66e-06 18L-1.50e-06 4C-1.32e-06 1.794 1.70 4.60e-07 3.80 6.54e-07Z" fill="#560CE3" />
                           </svg>
                        </span>
                     </blockquote>
                     <p className="tg-blog-para lh-28 mb-40">{desc_3}</p>
                     <div className="tg-blog-video-list mb-25">
                        <div className="row">
                           <div className="col-xl-5 col-lg-12 col-md-5">
                              <div className="tg-blog-details-video p-relative mb-30">
                                 <Image className="w-100" src={img_2} alt="video" />
                                 <div className="tg-tour-details-video-inner text-center">
                                    <Link className="tg-video-play popup-video tg-pulse-border" href="https://www.youtube.com/watch?v=sY2bdbsy3rg">
                                       <span className="p-relative z-index-11">
                                          <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M17.36 8.34C19.04 9.31 19.04 11.74 17.36 12.71L4.14 20.34C2.46 21.31 0.36 20.10 0.36 18.16L0.36 2.89C0.36 0.95 2.46 -0.26 4.14 0.71L17.36 8.34Z" fill="currentColor" />
                                          </svg>
                                       </span>
                                    </Link>
                                 </div>
                              </div>
                           </div>
                           <div className="col-xl-7 col-lg-12 col-md-7">
                              <div className="tg-blog-details-video-content ml-15 mb-30">
                                 <h3>{title_2}</h3>
                                 <p className="tg-blog-para lh-28 mb-20">{desc_4}</p>
                                 <div className="tg-blog-details-video-list">
                                    <ul>
                                       {list.map((item) => (
                                          <li key={item}>
                                             <span><i className="fa-sharp fa-solid fa-check"></i></span>
                                             <p>{item}</p>
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                                 <p className="tg-blog-para lh-28">{desc_5}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="tg-blog-details-tag mb-40 d-flex flex-wrap justify-content-between align-items-center">
                        <div className="tg-blog-sidebar-tag-list d-flex flex-wrap align-items-center">
                           <h5 className="tg-blog-sidebar-title mr-10">Tags:</h5>
                           <ul>
                              <li><Link href="#">Bath Cleaning</Link></li>
                              <li><Link href="#">Cleaning</Link></li>
                           </ul>
                        </div>
                        <div className="tg-blog-details-social mb-10">
                           <span>Share:</span>
                           <Link href="#"><i className="fa-brands fa-facebook-f"></i></Link>
                           <Link href="#"><i className="fa-brands fa-twitter"></i></Link>
                           <Link href="#"><i className="fa-brands fa-instagram"></i></Link>
                           <Link href="#"><i className="fa-brands fa-pinterest-p"></i></Link>
                           <Link href="#"><i className="fa-brands fa-youtube"></i></Link>
                        </div>
                     </div>
                     <Comment />
                     <div className="tg-tour-about-review-form tg-blog-details-review-form">
                        <h4 className="tg-tour-about-title mb-10">Post a comment</h4>
                        <p>Your email address will not be published. Required fields are marked *</p>
                        <BlogForm />
                     </div>
                  </div>
               </div>
               <div className="col-xl-3 col-lg-4">
                  <BlogSidebar />
               </div>
            </div>
         </div>
      </div>
   )
}

export default BlogDetailsArea
