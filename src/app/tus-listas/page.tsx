import { Suspense } from "react";
import TusListasContent from "@/components/tus-listas/TusListasContent";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Tus listas",
};

const page = () => {
  return (
    <Wrapper>
      <Suspense fallback={null}>
        <TusListasContent />
      </Suspense>
    </Wrapper>
  );
};

export default page;
