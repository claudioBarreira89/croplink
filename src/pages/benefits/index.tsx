import dynamic from "next/dynamic";
import { Suspense } from "react";

import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

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
