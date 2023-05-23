import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@chakra-ui/react";
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
    <Suspense fallback={<Spinner />}>
      <ProtectedRoute>
        <Listings />
      </ProtectedRoute>
    </Suspense>
  );
};

export default ListingsPage;
