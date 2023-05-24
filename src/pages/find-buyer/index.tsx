import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const FindBuyerPage = () => {
  const FindBuyer = dynamic(
    () => import("../../components/FindBuyer").then((res) => res.default),
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
