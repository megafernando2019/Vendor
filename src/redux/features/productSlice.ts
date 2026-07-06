import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import products from '@/data/ShopData';

export interface Product {
   id: number;
   page: string;
   thumb: string;
   tag?: string;
   featured?: string;
   offer?: string;
   title: string;
   location: string;
   delete_price?: number;
   price: number;
   review: number;
   total_review?: number;
   category: string;
   amenities: string;
   language: string;
   destination: string;
   duration: string;
   desc:string;
   guest:string;
   quantity: number;
}

interface ProductState {
   products: Product[];
   product: Product | null;
}

const initialState: ProductState = {
   products: products as unknown as Product[],
   product: null,
};

const productSlice = createSlice({
   name: 'products',
   initialState,
   reducers: {
      single_product: (state, action: PayloadAction<number>) => {
         state.product = state.products.find((p) => p.id === action.payload) || null;
      },
   },
});

export const selectProducts = (state: { products: ProductState }) => state?.products?.products;

export default productSlice.reducer;