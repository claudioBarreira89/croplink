import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const RegisterPage = () => {
  const Register = dynamic(
    () => import("../../components/Register").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<Spinner />}>
      <ProtectedRoute>
        <Register />
      </ProtectedRoute>
    </Suspense>
  );
};

export default RegisterPage;
