import LoadingPage from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@chakra-ui/react";
import { Suspense } from "react";

const Index = () => (
  <Suspense fallback={<LoadingPage />}>
    <ProtectedRoute />
  </Suspense>
);

export default Index;
