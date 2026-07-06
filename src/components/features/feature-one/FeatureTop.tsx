/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product, selectProducts } from "@/redux/features/productSlice";
import NiceSelect from "@/ui/NiceSelect";
import { useSelector } from "react-redux";

interface ProductTopProps {
   startOffset: number;
   endOffset: number;
   totalItems: number;
   setProducts: (products: Product[]) => void;
   isListView: boolean;
   handleListViewClick: () => void;
   handleGridViewClick: () => void;
}

interface Option {
   value: string;
   text: string;
}

const FeatureTop = ({ startOffset, endOffset, totalItems, setProducts, isListView, handleListViewClick, handleGridViewClick }: ProductTopProps) => {

   const allProducts = useSelector(selectProducts);
   const filteredAllProduct = allProducts

   const niceSelectHandler = (item: Option) => {
      let sortedProducts = [...filteredAllProduct];

      switch (item.value) {
         case 'popular':
            sortedProducts = sortedProducts
               .filter(item => item.offer)
               .sort((a, b) => {
                  const aPopular = parseFloat(a.offer || "0");
                  const bPopular = parseFloat(b.offer || "0");
                  return bPopular - aPopular;
               });
            break;
         case 'price':
            sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
            break;
         case 'rating':
            sortedProducts = sortedProducts.sort((a, b) => b.review - a.review);
            break;
         default:
            sortedProducts = filteredAllProduct;
            break;
      }

      setProducts(sortedProducts);
   };

   return (
      <div className="tg-listing-box-filter mb-15">
         <div className="row align-items-center">
            <div className="col-lg-5 col-md-5 mb-15">
               <div className="tg-listing-box-number-found">
                  <span> Showing {startOffset}-{endOffset} of {totalItems} Results</span>
               </div>
            </div>
            <div className="col-lg-7 col-md-7 mb-15">
               <div className="tg-listing-box-view-type d-flex justify-content-end align-items-center">
                  <div className="tg-listing-sort">
                     <span>Sort by:</span>
                     <button type="button" aria-label="Toggle sort direction">
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M8.47 3.28C8.61 3.42 8.80 3.50 9 3.50C9.20 3.50 9.39 3.42 9.53 3.28L10.25 2.56V12.75C10.25 12.95 10.33 13.139 10.47 13.28C10.61 13.42 10.80 13.50 11 13.50C11.20 13.50 11.39 13.42 11.53 13.28C11.67 13.139 11.75 12.95 11.75 12.75V2.56L12.47 3.28C12.54 3.35 12.62 3.41 12.71 3.45C12.80 3.49 12.904 3.52 13 3.52C13.11 3.52 13.21 3.50 13.30 3.46C13.39 3.43 13.477 3.37 13.55 3.30C13.62 3.23 13.68 3.14 13.71 3.05C13.751 2.96 13.77 2.86 13.77 2.75C13.766 2.65 13.74 2.55 13.703 2.46C13.662 2.37 13.60 2.288 13.53 2.22L11.53 0.22C11.39 0.08 11.20 0 11 0C10.80 0 10.61 0.08 10.47 0.22L8.47 2.22C8.33 2.36 8.25 2.55 8.25 2.75C8.25 2.95 8.33 3.14 8.47 3.28ZM3.75 12.94L4.47 12.22C4.54 12.15 4.62 12.09 4.71 12.05C4.80 12 4.90 11.98 5 11.98C5.11 11.979 5.21 12 5.30 12.04C5.39 12.07 5.477 12.13 5.55 12.20C5.62 12.27 5.68 12.36 5.71 12.45C5.75 12.54 5.77 12.64 5.77 12.74C5.77 12.84 5.74 12.94 5.70 13.04C5.66 13.13 5.60 13.21 5.53 13.28L3.53 15.28C3.39 15.42 3.20 15.50 3 15.50C2.80 15.50 2.61 15.42 2.47 15.28L0.47 13.28C0.40 13.21 0.34 13.13 0.30 13.04C0.25 12.94 0.23 12.84 0.23 12.74C0.23 12.64 0.25 12.54 0.29 12.45C0.32 12.36 0.38 12.27 0.45 12.20C0.52 12.13 0.61 12.07 0.70 12.04C0.79 12 0.89 11.979 0.99 11.98C1.09 11.98 1.19 12 1.29 12.05C1.38 12.09 1.46 12.15 1.53 12.22L2.25 12.94V2.75C2.25 2.55 2.33 2.36 2.47 2.22C2.61 2.08 2.80 2 3 2C3.20 2 3.39 2.08 3.53 2.22C3.67 2.36 3.75 2.55 3.75 2.75V12.94Z" fill="currentColor" />
                        </svg>
                     </button>
                  </div>
                  <div className="tg-listing-select-price ml-10">
                     <NiceSelect
                        className="select"
                        options={[
                           { value: "", text: "Default sorting" },
                           { value: "popular", text: "Sort by Best Offers" },
                           { value: "price", text: "Sort by price" },
                           { value: "rating", text: "Sort by rating" },
                        ]}
                        defaultCurrent={0}
                        onChange={niceSelectHandler}
                        name=""
                        placeholder=""  ariaLabel="Sort by" />
                  </div>
                  <div className="d-none d-sm-block">
                     <div className="tg-listing-box-view ml-10 d-flex">
                        <div className="list-switch-item">
                           <button type="button" className={`grid-view ${!isListView ? 'active' : ''}`} onClick={handleGridViewClick} aria-label="Grid view">
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M8 1H1V8H8V1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                 <path d="M19 1H12V8H19V1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                 <path d="M19 12H12V19H19V12Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                 <path d="M8 12H1V19H8V12Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </button>
                        </div>
                        <div className="list-switch-item ml-5">
                           <button type="button" className={`list-view ${isListView ? 'active' : ''}`} onClick={handleListViewClick} aria-label="List view">
                              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M6 1H19M6 7H19M6 13H19M1 1H1.01M1 7H1.01M1 13H1.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default FeatureTop
