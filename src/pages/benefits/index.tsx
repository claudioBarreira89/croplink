import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const BenefitsPage = () => {
  const Benefits = dynamic(
    () => import("../../components/Benefits").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedRoute>
        <Benefits />
      </ProtectedRoute>
    </Suspense>
  );
};

export default BenefitsPage;
