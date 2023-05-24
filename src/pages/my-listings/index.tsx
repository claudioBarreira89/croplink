import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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
