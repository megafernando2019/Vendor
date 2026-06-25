import DisponibilidadContent from "@/components/disponibilidad/DisponibilidadContent";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Disponibilidad",
};

const page = () => {
  return (
    <Wrapper>
      <DisponibilidadContent />
    </Wrapper>
  );
};

export default page;
