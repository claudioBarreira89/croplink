import { AuthContextProps, useAuthContext } from "@/context/useUserContext";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import {
  buyerPaths,
  farmerPaths,
  privatePaths,
  publicPaths,
} from "../../../constants/paths";
import LoadingPage from "../LoadingPage";

function ProtectedRoute({ children }: any) {
  const { state } = useAuthContext() as AuthContextProps;
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const authCheck = useCallback(
    (url: string) => {
      const { user, role, isLoading } = state || {};

      if (isLoading) return;

      const path = url.split("?")[0].split("#")[0];
      // if (!state?.user && !publicPaths.includes(path)) {
      //   setAuthorized(false);
      //   router.push({
      //     pathname: "/login",
      //     query: { returnUrl: router.asPath },
      //   });
      // } else {
      //   setAuthorized(true);
      // }
      console.log(role, path);
      if (!user && !publicPaths.includes(path)) {
        setAuthorized(false);
        return router.push({ pathname: "/login" });
      }
      if (user && !role && !privatePaths.includes(path)) {
        setAuthorized(false);
        return router.push({ pathname: "/register" });
      }
      if (user && role === "farmer" && !farmerPaths.includes(path)) {
        setAuthorized(false);
        return router.push({ pathname: "/my-listings" });
      }
      if (user && role === "buyer" && !buyerPaths.includes(path)) {
        setAuthorized(false);
        return router.push({ pathname: "/listings" });
      }

      setAuthorized(true);
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

  if (state.isLoading) return <LoadingPage />;
  return authorized && children;
}

export default ProtectedRoute;
