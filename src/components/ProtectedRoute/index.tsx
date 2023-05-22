import { AuthContextProps, useAuthContext } from "@/context/useUserContext";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function ProtectedRoute({ children }: any) {
  const { state } = useAuthContext() as AuthContextProps;
  const { replace } = useRouter();

  useEffect(() => {
    if (!state?.user && !state.isLoading) replace("/login");
  }, [state, replace]);

  if (state.isLoading) return <Spinner />;
  return children;
}

export default ProtectedRoute;
