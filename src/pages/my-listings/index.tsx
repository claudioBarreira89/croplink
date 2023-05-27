import dynamic from "next/dynamic";
import { Suspense } from "react";

import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const MyListingsPage = () => {
  const MyListings = dynamic(
    () => import("../../components/MyListings").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedRoute>
        <MyListings />
      </ProtectedRoute>
    </Suspense>
  );
};

export default MyListingsPage;
