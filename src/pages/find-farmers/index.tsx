import dynamic from "next/dynamic";
import { Suspense } from "react";

import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const FindFarmersPage = () => {
  const FindFarmers = dynamic(
    () => import("../../components/FindFarmers").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedRoute>
        <FindFarmers />
      </ProtectedRoute>
    </Suspense>
  );
};

export default FindFarmersPage;
