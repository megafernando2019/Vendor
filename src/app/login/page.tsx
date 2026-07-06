import Login from "@/components/pages/login";
import Wrapper from "@/layouts/Wrapper";
import { getSafeCallbackUrl } from "@/utils/safeCallbackUrl";

export const metadata = {
  title: "Login Tourex - Tour & Travel Booking React Next js Template",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

const page = async ({ searchParams }: LoginPageProps) => {
  const { callbackUrl } = await searchParams;
  const redirectTo = getSafeCallbackUrl(callbackUrl);

  return (
    <Wrapper>
      <Login redirectTo={redirectTo} />
    </Wrapper>
  );
};

export default page;
