import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const VerifyPage = () => {
  const Verify = dynamic(
    () => import("../../components/Verify").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedRoute>
        <Verify />
      </ProtectedRoute>
    </Suspense>
  );
};

export default VerifyPage;
