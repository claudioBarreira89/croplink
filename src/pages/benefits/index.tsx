import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const BenefitsPage = () => {
  const Benefits = dynamic(
    () => import("../../components/Benefits").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<Spinner />}>
      <ProtectedRoute>
        <Benefits />
      </ProtectedRoute>
    </Suspense>
  );
};

export default BenefitsPage;
