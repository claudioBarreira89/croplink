import dynamic from "next/dynamic";
import { Suspense } from "react";

const Index = () => {
  const Login = dynamic(
    () => import("../../components/Login").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
};

export default Index;
