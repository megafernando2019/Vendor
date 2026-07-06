import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useIsClient } from "@/hooks/useIsClient";

const TotalCart = () => {
   const productItem = useSelector((state: RootState) => state.cart.cart);
   const isClient = useIsClient();

   if (!isClient) return null;

   return <>{productItem.length}</>;
};

export default TotalCart;
