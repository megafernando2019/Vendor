/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import UseProducts from "@/hooks/UseProducts";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import type { Product } from "@/redux/features/productSlice";
import FeatureTop from "./FeatureTop"
import GoogleMapsEmbed from "@/components/common/GoogleMapsEmbed"
import FeatureFourListingCard from "./FeatureFourListingCard"
import ReactPaginate from "react-paginate";
import BookingForm from "./BookingForm"

const FeatureArea = () => {
   const dispatch = useDispatch();
   const { products, setProducts } = UseProducts();

   const itemsPerPage = 6;
   const [itemOffset, setItemOffset] = useState(0);
   const filteredProducts = products.filter((item) => item.page === "shop_4");
   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
   const currentItems = filteredProducts.slice(itemOffset, itemOffset + itemsPerPage);

   const handlePageClick = ({ selected }: { selected: number }) => {
      const newOffset = selected * itemsPerPage;
      setItemOffset(newOffset);
   };

   const handleAddToWishlist = useCallback(
      (item: Product) => {
         dispatch(addToWishlist(item));
      },
      [dispatch]
   );

   return (
      <div className="tg-listing-map-area fix">
         <div className="container-fluid p-0">
            <div className="row gx-0">
               <div className="col-lg-6">
                  <div className="tg-listing-map-list-wrap mb-15">
                     <div className="tg-listing-map-booking pl-40 pr-35">
                        <div className="col-12">
                           <div className="tg-booking-form-item pt-35 pb-25">
                              <BookingForm />
                           </div>
                        </div>
                     </div>
                     <div className="tg-listing-map-filter-wrap pl-40 pr-35">
                        <FeatureTop />
                        <div className="tg-listing-map-list-item">
                           <div className="row">
                              {currentItems.map((item) => (
                                 <FeatureFourListingCard
                                    key={item.id}
                                    item={item}
                                    onAddToWishlist={handleAddToWishlist}
                                 />
                              ))}
                              <div className="col-12">
                                 <div className="tg-pagenation-wrap text-center mt-35 mb-30">
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
               <div className="col-lg-6">
                  <div className="tg-map-full h-100">
                     <GoogleMapsEmbed title="Interactive map of tour listings" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default FeatureArea
