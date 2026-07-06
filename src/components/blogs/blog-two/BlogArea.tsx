"use client"
import blog_data from "@/data/BlogData"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react";
import ReactPaginate from "react-paginate";
import BlogSidebar from "../blog-sidebar";
import Button from "@/components/common/Button";

const BlogArea = () => {

   const blog = blog_data.filter((items) => items.page === "inner_2");

   const itemsPerPage = 4;
   const [itemOffset, setItemOffset] = useState(0);
   const endOffset = itemOffset + itemsPerPage;
   const currentItems = blog.slice(itemOffset, endOffset);
   const pageCount = Math.ceil(blog.length / itemsPerPage);
   // click to request another page.
   const handlePageClick = (event: { selected: number }) => {
      const newOffset = (event.selected * itemsPerPage) % blog.length;
      setItemOffset(newOffset);
   };

   return (
      <div className="tg-blog-standard-area pt-130 pb-100">
         <div className="container">
            <div className="row">
               <div className="col-xl-9 col-lg-8">
                  <div className="tg-blog-standard-wrap tg-blog-lg-spacing mr-50">
                     {currentItems.map((item) => (
                        <div key={item.id} className="tg-blog-standard-item mb-40">
                           <div className="tg-blog-standard-thumb mb-15">
                              <Link href="/blog-details"><Image className="w-100" src={item.thumb} alt="blog" /></Link>
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
                                    {item.date}
                                 </span>
                                 <span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M8 3.73V8L10.84 9.42M15.11 8C15.11 11.93 11.93 15.11 8 15.11C4.07 15.11 0.89 11.93 0.89 8C0.89 4.07 4.07 0.89 8 0.89C11.93 0.89 15.11 4.07 15.11 8Z" stroke="#560CE3" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {item.time}
                                 </span>
                              </div>
                              <h2 className="tg-blog-standard-title">
                                 <Link href="/blog-details">{item.title}</Link>
                              </h2>
                              <p className="mb-20">{item.desc}</p>
                              <div className="tg-blog-sidebar-btn">
                                 <Link href="/blog-details" className="tg-btn tg-btn-switch-animation">
                                    <Button text="Read More" />
                                 </Link>
                              </div>
                           </div>
                        </div>
                     ))}
                     <div className="tg-pagenation-wrap text-center pt-60 mb-30">
                        <nav>
                           <ReactPaginate
                              breakLabel="..."
                              nextLabel={<i className="p-btn">Next Page</i>}
                              onPageChange={handlePageClick}
                              pageRangeDisplayed={3}
                              pageCount={pageCount}
                              previousLabel={<i className="p-btn">Previous Page</i>}
                              renderOnZeroPageCount={null}
                           />
                        </nav>
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

export default BlogArea
