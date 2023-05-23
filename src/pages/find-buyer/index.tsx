import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@chakra-ui/react";
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
    <Suspense fallback={<Spinner />}>
      <ProtectedRoute>
        <FindBuyer />
      </ProtectedRoute>
    </Suspense>
  );
};

export default FindBuyerPage;
