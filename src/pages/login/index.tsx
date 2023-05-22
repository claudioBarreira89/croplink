import { Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const LoginPage = () => {
  const Login = dynamic(
    () => import("../../components/Login").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<Spinner />}>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
