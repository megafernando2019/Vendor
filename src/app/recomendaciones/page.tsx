import { Suspense } from "react";
import RecomendacionesContent from "@/components/recomendaciones/RecomendacionesContent";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Recomendaciones",
};

const page = () => {
  return (
    <Wrapper>
      <Suspense fallback={null}>
        <RecomendacionesContent />
      </Suspense>
    </Wrapper>
  );
};

export default page;
