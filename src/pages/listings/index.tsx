import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Index = () => {
  const Main = dynamic(
    () => import("../../components/Main").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<Spinner />}>
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    </Suspense>
  );
};

export default Index;
