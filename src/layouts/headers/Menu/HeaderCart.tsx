/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Link from "next/link"
import Image from "next/image"
import UseCartInfo from '@/hooks/UseCartInfo';
import { useDispatch, useSelector } from "react-redux";
import { remove_cart_product } from '@/redux/features/cartSlice';
import { useIsClient } from "@/hooks/useIsClient";

const HeaderCart = () => {

   const mounted = useIsClient();
   const productItem = useSelector((state: any) => state.cart.cart);
   const dispatch = useDispatch();
   const { total } = UseCartInfo();

   if (!mounted) return null;

   return (
      <div className="minicart">
         {productItem.length === 0 ? (
            <div className="mb-30">
               <div className="empty_bag text-center">
                  <p className="py-3">Your Bag is Empty</p>
                  <Link href={"/shop"} className="swiftcart-btn-black swiftcart-btn-black-large">
                     Go To Shop
                  </Link>
               </div>
            </div>
         ) : (
            <>
               {productItem.map((item: any) => (
                  <div key={item.id} className="cart-content-wrap d-flex align-items-center justify-content-between">
                     <div className="cart-img-info d-flex align-items-center">
                        <div className="cart-thumb">
                           <Link href="/shop-details">
                              <Image src={item.thumb} alt="" />
                           </Link>
                        </div>
                        <div className="cart-content">
                           <h5 className="cart-title"><Link href="/shop-details">{item.title}</Link></h5>
                           <span> ${item.price} <del>${item.delete_price}</del></span>
                        </div>
                     </div>
                     <button type="button" onClick={() => dispatch(remove_cart_product(item))} className="cart-del-icon" aria-label="Remove item">
                        <span><i className="fa-light fa-trash-can"></i></span>
                     </button>
                  </div>
               ))}
               <div className="cart-total-price d-flex align-items-center justify-content-between">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
               </div>
               <div className="minicart-btn">
                  <Link className="cart-btn mb-10" href="/cart"><span>Shopping Cart</span></Link>
                  <Link className="cart-btn cart-btn-black" href="/checkout"><span>Checkout</span></Link>
               </div></>
         )}
      </div>
   )
}

export default HeaderCart
