import dynamic from "next/dynamic";
import { Suspense } from "react";

import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const FindBuyerPage = () => {
  const FindBuyer = dynamic(
    () => import("@/components/FindBuyer").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedRoute>
        <FindBuyer />
      </ProtectedRoute>
    </Suspense>
  );
};

export default FindBuyerPage;
