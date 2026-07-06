/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import UseProducts from "@/hooks/UseProducts";
import { Rating } from "react-simple-star-rating";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import ReactPaginate from "react-paginate";
import ShopSidebar from "./ShopSidebar"
import ShopTop from "./ShopTop"
import { addToCart } from "@/redux/features/cartSlice";

const ShopArea = () => {
  const dispatch = useDispatch();
  const { products, setProducts } = UseProducts();

  const itemsPerPage = 9;
  const [itemOffset, setItemOffset] = useState(0);
  const filteredProducts = products.filter((item) => item.page === "shop_5");
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(itemOffset, itemOffset + itemsPerPage);

  const startOffset = itemOffset + 1;
  const endOffset = Math.min(itemOffset + itemsPerPage, products.length);
  const totalItems = filteredProducts.length;

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

  const handleAddToCart = useCallback(
    (item: any) => {
      dispatch(addToCart(item));
    },
    [dispatch]
  );

  return (
    <div className="tg-shop-area pt-130 pb-80">
      <div className="container">
        <div className="row">
          <ShopSidebar setProducts={setProducts} />
          <div className="col-xl-9 col-lg-8">
            <div className="tg-shop-product-wrap mb-50">
              <ShopTop
                startOffset={startOffset}
                endOffset={Math.min(endOffset, totalItems)}
                totalItems={totalItems}
                setProducts={setProducts}
              />
              <div className="row">
                {currentItems.map((item) => (
                  <div key={item.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                    <div className="tg-shop-product-item mb-25">
                      <div className="tg-shop-product-thumb mb-15 fix p-relative">
                        <Link href={`/shop-details/${item.id}`}><Image className="w-100" src={item.thumb} alt="product" /></Link>
                        <div className="tg-shop-product-btn">
                          <button type="button" onClick={() => handleAddToWishlist(item)} style={{ cursor: "pointer" }} className="wishlist" aria-label="Add to wishlist">
                            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15.96 2.24C15.57 1.85 15.10 1.53 14.59 1.32C14.08 1.11 13.53 1 12.973 1C12.42 1 11.87 1.11 11.36 1.32C10.84 1.53 10.38 1.85 9.99 2.24L9.17 3.05L8.36 2.24C7.57 1.45 6.49 1 5.37 1C4.25 1 3.176 1.45 2.38 2.24C1.59 3.03 1.15 4.10 1.15 5.22C1.15 6.35 1.59 7.42 2.38 8.21L9.17 15L15.96 8.21C16.35 7.82 16.66 7.354 16.88 6.84C17.09 6.33 17.20 5.78 17.20 5.22C17.20 4.67 17.09 4.12 16.88 3.61C16.66 3.10 16.35 2.63 15.96 2.24Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <div className="tg-shop-product-hidden-btn">
                            <button type="button" onClick={() => handleAddToCart(item)} style={{ cursor: "pointer" }} aria-label="Add to cart">
                              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.80 4.2L3.20 1H12.80L15.20 4.2M0.80 4.2V15.4C0.80 15.82 0.97 16.23 1.27 16.53C1.57 16.83 1.98 17 2.40 17H13.60C14.02 17 14.43 16.83 14.73 16.53C15.03 16.23 15.20 15.82 15.20 15.4V4.2M0.80 4.2H15.20M11.20 7.4C11.20 8.25 10.86 9.06 10.26 9.66C9.66 10.26 8.85 10.6 8 10.6C7.15 10.6 6.34 10.26 5.74 9.66C5.14 9.06 4.80 8.25 4.80 7.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button type="button" aria-label="Quick view">
                              <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.222 1H14.11M14.11 1V4.89M14.11 1L0.89 14.22M14.11 11.11V15M14.11 15H10.222M14.11 15L9.44 10.33M0.89 1.78L4.78 5.67" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="tg-shop-product-content">
                        <h3 className="tg-shop-product-title"><Link href={`/shop-details/${item.id}`}>{item.title}</Link></h3>
                        <div className="tg-shop-product-ratings">
                          <Rating initialValue={item.review} size={16} readonly={true} />
                          <span>({item.total_review} Reviews)</span>
                        </div>
                        <span className="price">${item.price}.00</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-12">
                  <div className="tg-pagenation-wrap text-center pt-35 mb-30">
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
    </div>
  )
}

export default ShopArea
