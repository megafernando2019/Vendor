/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import UseProducts from "@/hooks/UseProducts";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import FeatureTop from "./FeatureTop"
import FeatureSidebar from "./FeatureSidebar";
import ReactPaginate from "react-paginate";

const FeatureArea = () => {
   const dispatch = useDispatch();
   const { products, setProducts } = UseProducts();
   const [isListView, setIsListView] = useState(false);

   const itemsPerPage = 9;
   const [itemOffset, setItemOffset] = useState(0);
   const filteredProducts = products.filter((item) => item.page === "shop_2");
   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
   const currentItems = filteredProducts.slice(itemOffset, itemOffset + itemsPerPage);

   const startOffset = itemOffset + 1;
   const endOffset = Math.min(itemOffset + itemsPerPage, products.length);
   const totalItems = products.length;

   const handlePageClick = ({ selected }: { selected: number }) => {
      const newOffset = selected * itemsPerPage;
      setItemOffset(newOffset);
   };

   const handleAddToWishlist = useCallback(
      (item: any) => {
         dispatch(addToWishlist(item));
      },
      [dispatch]
   );

   const handleListViewClick = () => {
      setIsListView(true);
   };
   const handleGridViewClick = () => {
      setIsListView(false);
   };

   return (
      <div className="tg-listing-grid-area mb-85">
         <div className="container">
            <div className="row">
               <FeatureSidebar setProducts={setProducts} />
               <div className="col-xl-9 col-lg-8">
                  <div className="tg-listing-item-box-wrap ml-10">
                     <FeatureTop
                        startOffset={startOffset}
                        endOffset={Math.min(endOffset, totalItems)}
                        totalItems={totalItems}
                        setProducts={setProducts}
                        isListView={isListView}
                        handleListViewClick={handleListViewClick}
                        handleGridViewClick={handleGridViewClick}
                     />
                     <div className="tg-listing-grid-item">
                        <div className={`row list-card ${isListView ? 'list-card-open' : ''}`}>
                           {currentItems.map((item) => (
                              <div key={item.id} className="col-xxl-4 col-xl-6 col-lg-6 col-md-6 tg-grid-full">
                                 <div className="tg-listing-card-item mb-30">
                                    <div className="tg-listing-card-thumb fix mb-15 p-relative">
                                       <Link href="/tour-details">
                                          <Image className="tg-card-border w-100" src={item.thumb} alt="listing" />
                                          {item.tag && <span className="tg-listing-item-price-discount shape">{item.tag}</span>}
                                          {item.featured && <span className="tg-listing-item-price-discount shape-3">
                                             <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.60 1L0.60 8.2H6L5.40 13L11.40 5.8H6L6.60 1Z" stroke="white" strokeWidth="0.857143" strokeLinecap="round" strokeLinejoin="round" />
                                             </svg>
                                             {item.featured}
                                          </span>}
                                          {item.offer && <span className="tg-listing-item-price-discount offer-btm shape-2">{item.offer}</span>}
                                       </Link>
                                       <div className="tg-listing-item-wishlist">
                                          <button type="button" onClick={() => handleAddToWishlist(item)} style={{ cursor: "pointer" }} aria-label="Add to wishlist">
                                             <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.52 16.34C10.23 16.44 9.77 16.44 9.48 16.34C7.07 15.52 1.67 12.075 1.67 6.24C1.67 3.67 3.74 1.58 6.30 1.58C7.82 1.58 9.16 2.32 10 3.45C10.84 2.32 12.19 1.58 13.70 1.58C16.26 1.58 18.33 3.67 18.33 6.24C18.33 12.075 12.93 15.52 10.52 16.34Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                             </svg>
                                          </button>
                                       </div>
                                    </div>
                                    <div className="tg-listing-main-content">
                                       <div className="tg-listing-card-content">
                                          <h4 className="tg-listing-card-title"><Link href="/tour-details">{item.title}</Link></h4>
                                          <div className="tg-listing-card-duration-tour">
                                             <span className="tg-listing-card-duration-map mb-5">
                                                <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                   <path d="M12.33 6.71C12.33 11.23 6.56 15.11 6.56 15.11C6.56 15.11 0.78 11.23 0.78 6.71C0.78 5.16 1.39 3.68 2.47 2.59C3.55 1.50 5.02 0.89 6.56 0.89C8.09 0.89 9.56 1.50 10.64 2.59C11.72 3.68 12.33 5.16 12.33 6.71Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                                   <path d="M6.56 8.65C7.62 8.65 8.48 7.78 8.48 6.71C8.48 5.636 7.62 4.77 6.56 4.77C5.49 4.77 4.63 5.636 4.63 6.71C4.63 7.78 5.49 8.65 6.56 8.65Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {item.location}
                                             </span>
                                             <span className="tg-listing-card-duration-time">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                   <path d="M8 3.73V8L10.85 9.42M15.11 8C15.11 11.93 11.93 15.11 8 15.11C4.07 15.11 0.89 11.93 0.89 8C0.89 4.07 4.07 0.89 8 0.89C11.93 0.89 15.11 4.07 15.11 8Z" stroke="currentColor" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {item.duration}
                                             </span>
                                          </div>
                                       </div>
                                       <div className="tg-listing-card-price d-flex align-items-end justify-content-between">
                                          <div className="tg-listing-card-price-wrap price-bg d-flex align-items-center">
                                             <span className="tg-listing-card-currency-amount mr-5">
                                                {item.delete_price && <del className="tg-listing-card-currency-old">${item.delete_price}</del>}
                                                <span className="currency-symbol">$</span>{item.price}
                                             </span>
                                             <span className="tg-listing-card-activity-person">/Person</span>
                                          </div>
                                          <div className="tg-listing-card-review space">
                                             <span className="tg-listing-rating-icon"><i className="fa-sharp fa-solid fa-star"></i></span>
                                             <span className="tg-listing-rating-percent">({item.total_review} Reviews)</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                        <div className="tg-pagenation-wrap text-center mt-50 mb-30">
                           <nav>
                              <ReactPaginate
                                 breakLabel="..."
                                 nextLabel={<i className="p-btn">Next Page</i>}
                                 onPageChange={handlePageClick}
                                 pageRangeDisplayed={3}
                                 pageCount={totalPages}
                                 previousLabel={<i className="p-btn">Previous Page</i>}
                                 renderOnZeroPageCount={null}
                              />
                           </nav>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default FeatureArea
