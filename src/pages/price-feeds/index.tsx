import dynamic from "next/dynamic";
import { Suspense } from "react";

import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const PriceFeedsPage = () => {
  const PriceFeeds = dynamic(
    () => import("../../components/PriceFeeds").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedRoute>
        <PriceFeeds />
      </ProtectedRoute>
    </Suspense>
  );
};

export default PriceFeedsPage;
