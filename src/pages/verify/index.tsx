import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const VerifyPage = () => {
  const Verify = dynamic(
    () => import("../../components/Verify").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<Spinner />}>
      <ProtectedRoute>
        <Verify />
      </ProtectedRoute>
    </Suspense>
  );
};

export default VerifyPage;
