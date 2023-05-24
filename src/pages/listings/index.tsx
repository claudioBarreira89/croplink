import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ListingsPage = () => {
  const Listings = dynamic(
    () => import("../../components/Listings").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedRoute>
        <Listings />
      </ProtectedRoute>
    </Suspense>
  );
};

export default ListingsPage;
