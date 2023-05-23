import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@chakra-ui/react";
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
    <Suspense fallback={<Spinner />}>
      <ProtectedRoute>
        <MyListings />
      </ProtectedRoute>
    </Suspense>
  );
};

export default MyListingsPage;
