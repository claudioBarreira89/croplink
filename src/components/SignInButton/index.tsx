import {
  Button,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useNetwork,
  useSignMessage,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { AuthContextProps, useAuthContext } from "@/context/useUserContext";
import { truncateAddress } from "@/utils";

const SignInButton = () => {
  const { state: authState, dispatch } = useAuthContext() as AuthContextProps;
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();

  const [state, setState] = useState<{
    loading?: boolean;
    nonce?: string;
  }>({});

  const fetchNonce = useCallback(async () => {
    setState((x) => ({ ...x, loading: true }));

    try {
      const nonceRes = await fetch("/api/nonce");
      const nonce = await nonceRes.text();
      setState((x) => ({ ...x, nonce, loading: false }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error, loading: false }));
    }
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "LOGOUT" });
    setState({});
  }, [dispatch]);

  const { disconnect } = useDisconnect({ onSuccess: signOut });

  const signIn = useCallback(async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      let nonce = state.nonce;
      if (!nonce) {
        const nonceRes = await fetch("/api/nonce");
        nonce = await nonceRes.text();
      }

      setState((x) => ({ ...x, loading: true }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await fetch("/api/ddb/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");

      const res = await fetch("/api/ddb/me");
      const json = await res.json();

      setState((x) => ({ ...x, loading: false }));
      dispatch({ type: "LOGIN", payload: address, role: json.role });

      toast({
        title: "Login successful",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setState((x) => ({ ...x, loading: false }));
      fetchNonce();
      disconnect();
    }
  }, [
    address,
    chain?.id,
    disconnect,
    dispatch,
    fetchNonce,
    signMessageAsync,
    state.nonce,
    toast,
  ]);

  const { connect, isLoading } = useConnect({
    connector: new MetaMaskConnector(),
    ...(!authState?.user && { onSuccess: signIn }),
  });

  const connectWallet = useCallback(() => {
    connect();
  }, [connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const buttonLoading = isLoading || state.loading;

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  useEffect(() => {
    fetchNonce();
  }, [fetchNonce]);

  useEffect(() => {
    const connectWalletOnPageLoad = () => {
      if (localStorage?.getItem("wagmi.connected") === "true" && !isConnected) {
        connect();
      }
    };
    connectWalletOnPageLoad();
  }, [connect, isConnected]);

  if (authState?.user) {
    return (
      <Menu>
        <MenuButton
          as={Button}
          rounded={"full"}
          size={"lg"}
          fontWeight={"normal"}
          px={6}
          colorScheme={"green"}
          bg={"green.400"}
          _hover={{ bg: "green.500" }}
          isDisabled={buttonLoading}
          isLoading={buttonLoading}
        >
          {ensName
            ? `${ensName} (${truncateAddress(address)})`
            : truncateAddress(address)}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => disconnectWallet()}>Disconnect</MenuItem>
        </MenuList>
      </Menu>
    );
  }

  return (
    <Button
      rounded={"full"}
      size={"lg"}
      fontWeight={"normal"}
      px={6}
      colorScheme={"green"}
      bg={"green.400"}
      _hover={{ bg: "green.500" }}
      onClick={() => connectWallet()}
      isDisabled={buttonLoading}
      isLoading={buttonLoading}
    >
      <Image
        mr="2"
        w="8"
        height="8"
        src="/assets/metamask.png"
        alt="metamask"
      />
      Connect with Metamask
    </Button>
  );
};

export default SignInButton;
