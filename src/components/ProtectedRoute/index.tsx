import { AuthContextProps, useAuthContext } from "@/context/useUserContext";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

function ProtectedRoute({ children }: any) {
  const { state } = useAuthContext() as AuthContextProps;
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const authCheck = useCallback(
    (url: string) => {
      if (state?.isLoading) return;

      const publicPaths = ["/login"];
      const path = url.split("?")[0];
      if (!state?.user && !publicPaths.includes(path)) {
        setAuthorized(false);
        router.push({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        });
      } else {
        setAuthorized(true);
      }
    },
    [router, state]
  );

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [authCheck, router.asPath, router.events]);

  if (state.isLoading) return <Spinner />;
  return authorized && children;
}

export default ProtectedRoute;
