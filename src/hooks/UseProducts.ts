import { selectProducts } from "@/redux/features/productSlice";
import { useState } from "react";
import { useSelector } from "react-redux";

const UseProducts = () => {
   const products = useSelector(selectProducts) ?? [];
   const [productList, setProducts] = useState(products);
   return {
      products: productList,
      setProducts
   }
}

export default UseProducts