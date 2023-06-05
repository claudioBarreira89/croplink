import dynamic from "next/dynamic";
import { Suspense } from "react";

import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const MarketPricesPage = () => {
  const MarketPrices = dynamic(
    () => import("@/components/MarketPrices").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedRoute>
        <MarketPrices />
      </ProtectedRoute>
    </Suspense>
  );
};

export default MarketPricesPage;
