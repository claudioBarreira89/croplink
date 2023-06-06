import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";
import {
  buyerPaths,
  farmerPaths,
  privatePaths,
  publicPaths,
} from "../../../constants/paths";
import LoadingPage from "../LoadingPage";

import { AuthContextProps, useAuthContext } from "@/context/useUserContext";

function ProtectedRoute({ children }: any) {
  // const { address } = useAccount();

  const { state } = useAuthContext() as AuthContextProps;
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // const farmers = useContractRead({
  //   address: contractAddress,
  //   abi,
  //   functionName: "farmers",
  //   args: [address],
  // });
  // const buyers = useContractRead({
  //   address: contractAddress,
  //   abi,
  //   functionName: "buyers",
  //   args: [address],
  // });

  // console.log({
  //   farmers: farmers.data,
  //   buyers: buyers.data,
  // });

  const authCheck = useCallback(
    (url: string) => {
      const { user, role, isLoading } = state || {};

      if (isLoading) return;

      const path = url.split("?")[0].split("#")[0];

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
