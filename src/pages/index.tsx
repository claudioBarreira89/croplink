import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Index = () => {
  const Main = dynamic(
    () => import("../components/Main").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    </Suspense>
  );
};

export default Index;
