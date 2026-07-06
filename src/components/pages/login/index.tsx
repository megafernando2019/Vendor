import LoginArea from "./LoginArea"
import FooterFive from "@/layouts/footers/FooterFive"

type LoginProps = {
  redirectTo: string;
};

const Login = ({ redirectTo }: LoginProps) => {
   return (
      <>
         <main>
            <LoginArea redirectTo={redirectTo} />
         </main>
         <FooterFive />
      </>
   )
}

export default Login
