import { Suspense } from "react";

import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const Index = () => (
  <Suspense fallback={<LoadingPage />}>
    <ProtectedRoute />
  </Suspense>
);

export default Index;
