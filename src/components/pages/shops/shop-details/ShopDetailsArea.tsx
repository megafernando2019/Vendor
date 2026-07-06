/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import img_1 from "@/assets/img/shop/details/dt-large.webp"
import img_2 from "@/assets/img/shop/details/dt-large-2.webp"
import img_3 from "@/assets/img/shop/details/dt-large-3.webp"
import img_4 from "@/assets/img/shop/details/dt-large-4.webp"

import imgs_1 from "@/assets/img/shop/details/dt-small.webp"
import imgs_2 from "@/assets/img/shop/details/dt-small-2.webp"
import imgs_3 from "@/assets/img/shop/details/dt-small-3.webp"
import imgs_4 from "@/assets/img/shop/details/dt-small-4.webp"
import { addToCart, decrease_quantity } from "@/redux/features/cartSlice";
import { addToWishlist } from "@/redux/features/wishlistSlice";

function preventFormDefault(e: React.FormEvent) {
   e.preventDefault();
}

const navb_data: StaticImageData[] = [img_1, img_2, img_3, img_4];
const navs_data: StaticImageData[] = [imgs_1, imgs_2, imgs_3, imgs_4];

const ShopDetailsArea = ({ single_product }: any) => {

   const [currentImageIndex, setCurrentImageIndex] = useState(0);

   const productItem = useSelector((state: any) => state.cart.cart);
   const dispatch = useDispatch();

   const handleAddToCart = (item: any) => {
      dispatch(addToCart(item));
   };

   const handleAddToWishlist = (item: any) => {
      dispatch(addToWishlist(item));
   };

   const totalItems = productItem.find((d_item: any) => d_item?.id === single_product?.id)

   return (
      <div className="tg-shop-details-area pt-130 pb-35">
         <div className="container">
            <div className="row">
               <div className="col-xl-5 col-lg-6">
                  <div className="tg-product-modal-thumb-wrapper mb-40">
                     <div className="tg-product-details-thumb-tab">
                        <div className="tg-product-details-thumb mb-10">
                           <div className="tab-content" id="nav-tabContents">
                              {navb_data.map((img, index) => (
                                 <div key={String(img.src)} className={`tab-pane fade ${index === currentImageIndex ? 'show active' : ''}`} id={`item${index}`}>
                                    <Image src={img} alt="img" />
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="tg-product-details-thumb-nav cm-tab mb-10">
                           <div className="nav nav-tabs d-block" id="nav-tab-two" role="tablist">
                              <div className="row gx-10">
                                 {navs_data.map((img, index) => (
                                    <div key={String(img.src)} className="col-3">
                                       <button type="button" onClick={() => setCurrentImageIndex(index)}
                                          className={`nav-link ${index === currentImageIndex ? 'active' : ''}`}>
                                          <Image src={img} alt="img" />
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-xl-7 col-lg-6">
                  <div className="tg-product-details-wrapper ml-55 mr-115 mb-40">
                     <h3 className="tg-product-details-title mb-5">{single_product?.title ? single_product.title : "Noise Fit Halo Smartwatch"}</h3>
                     <div className="tg-product-details-rating mb-20 d-flex align-items-center">
                        <div className="tg-product-rating d-flex">
                           <span>
                              <i className="fa-sharp fa-solid fa-star"></i>
                           </span>
                           <span>
                              <i className="fa-sharp fa-solid fa-star"></i>
                           </span>
                           <span>
                              <i className="fa-sharp fa-solid fa-star"></i>
                           </span>
                           <span>
                              <i className="fa-sharp fa-solid fa-star"></i>
                           </span>
                           <span>
                              <i className="fa-sharp fa-solid fa-star"></i>
                           </span>
                        </div>
                        <div className="tg-product-details-rating-count">
                           <span>(4 review)</span>
                           <Link href="#">I   Write a Review</Link>
                        </div>
                     </div>
                     <div className="tg-product-details-price">
                        <h6 className="mb-10">$44.00</h6>
                     </div>
                     <div className="tg-product-details-availability mb-20">
                        <span className="availability">Availability:</span>
                        <span className="stock">In Stock</span>
                     </div>
                     <p className="tg-product-details-para mb-20">Nam vel lacus eu nisl bibendum accumsan vitae vitae nibh. Nam
                        nec eros id magna hendrerit sagittis. Nullam sed mi non odio
                        feugiat volutpat sit amet nec elit. Maecenas id hendrerit ipsum.</p>

                     <div className="tg-product-details-quantity mb-30">
                        <span className="quantity mb-5 d-inline-block">Quantity </span>
                        <div className="tg-booking-quantity-item">
                           <button type="button" onClick={() => single_product ? dispatch(decrease_quantity(single_product)) : undefined} className="decrement" aria-label="Decrease quantity">
                              <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M1 1H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </button>
                           <input className="tg-quantity-input" type="text" onChange={preventFormDefault} value={totalItems?.quantity ? totalItems?.quantity : 1} readOnly aria-label="Quantity" />
                           <button type="button" onClick={() => single_product ? dispatch(addToCart(single_product)) : undefined} className="increment" aria-label="Increase quantity">
                              <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M1.22 7H13.38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                 <path d="M7.30 13V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </button>
                        </div>
                     </div>
                     <div className="tg-product-details-button mb-25">
                        <button type="button" onClick={() => single_product ? handleAddToCart(single_product) : undefined} style={{ cursor: "pointer" }} className="tg-btn mb-10">
                           <span>
                              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M1.17 1.67H4.72L7.10 13.57C7.19 13.98 7.41 14.35 7.73 14.61C8.06 14.869 8.47 15.008 8.88 15H17.52C17.94 15.008 18.35 14.869 18.67 14.61C19 14.35 19.219 13.98 19.30 13.57L20.72 6.11H5.61M9.17 19.44C9.17 19.94 8.77 20.33 8.28 20.33C7.79 20.33 7.39 19.94 7.39 19.44C7.39 18.95 7.79 18.56 8.28 18.56C8.77 18.56 9.17 18.95 9.17 19.44ZM18.94 19.44C18.94 19.94 18.55 20.33 18.06 20.33C17.565 20.33 17.167 19.94 17.167 19.44C17.167 18.95 17.565 18.56 18.06 18.56C18.55 18.56 18.94 18.95 18.94 19.44Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </span>
                           Add To Cart
                        </button>
                        <button type="button" onClick={() => single_product ? handleAddToWishlist(single_product) : undefined} style={{ cursor: "pointer" }} className="tg-btn tg-btn-2 mb-10">
                           <span>
                              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M17.76 2.41C17.31 1.97 16.78 1.61 16.19 1.37C15.606 1.12 14.98 1 14.34 1C13.71 1 13.08 1.12 12.50 1.37C11.91 1.61 11.38 1.97 10.93 2.41L10 3.34L9.07 2.41C8.16 1.51 6.94 1 5.66 1C4.38 1 3.15 1.51 2.24 2.41C1.34 3.32 0.83 4.55 0.83 5.83C0.83 7.11 1.34 8.34 2.24 9.24L10 17L17.76 9.24C18.21 8.79 18.56 8.26 18.80 7.68C19.05 7.09 19.17 6.46 19.17 5.83C19.17 5.19 19.05 4.57 18.80 3.98C18.56 3.39 18.21 2.86 17.76 2.41Z" stroke="#560CE3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </span>
                           Add To Wishlist
                        </button>
                     </div>
                     <div className="tg-product-details-share">
                        <span>Social Share:</span>
                        <Link href="#"><i className="fa-brands fa-facebook-f"></i></Link>
                        <Link href="#">
                           <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.33 6.77L15.17 0H13.79L8.72 5.88L4.67 0H0L6.12 8.90L0 16H1.38L6.74 9.79L11.01 16H15.68L9.33 6.77H9.33H9.33ZM7.44 8.97L6.82 8.088L1.88 1.04H4.01L7.99 6.73L8.61 7.61L13.79 15.01H11.66L7.44 8.974V8.97L7.44 8.97Z" fill="currentColor" />
                           </svg>
                        </Link>
                        <Link href="#"><i className="fa-brands fa-linkedin-in"></i></Link>
                        <Link href="#"><i className="fa-brands fa-youtube"></i></Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ShopDetailsArea
