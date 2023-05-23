import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PriceFeedsPage = () => {
  const PriceFeeds = dynamic(
    () => import("../../components/PriceFeeds").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<Spinner />}>
      <ProtectedRoute>
        <PriceFeeds />
      </ProtectedRoute>
    </Suspense>
  );
};

export default PriceFeedsPage;
