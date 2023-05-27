import dynamic from "next/dynamic";
import { Suspense } from "react";

import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const RegisterPage = () => {
  const Register = dynamic(
    () => import("../../components/Register").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedRoute>
        <Register />
      </ProtectedRoute>
    </Suspense>
  );
};

export default RegisterPage;
