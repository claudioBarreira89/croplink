import { AuthContextProps, useAuthContext } from "@/context/useUserContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function ProtectedRoute({ children }: any) {
  const { state } = useAuthContext() as AuthContextProps;
  const { replace } = useRouter();

  useEffect(() => {
    if (!state?.user) replace("/login");
  }, [state, replace]);

  return children;
}

export default ProtectedRoute;
