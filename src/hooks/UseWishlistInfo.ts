import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const UseWishlistInfo = () => {
   const wishlistItems = useSelector((state: RootState) => state.wishlist.wishlist);

   return {
      wishlistItems,
   };
}

export default UseWishlistInfo;
