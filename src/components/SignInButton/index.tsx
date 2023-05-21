import * as React from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { AuthContextProps, useAuthContext } from "@/context/useUserContext";

function SignInButton({
  onSuccess,
  onError,
}: {
  onSuccess?: (args: { address: string }) => void;
  onError?: (args: { error: Error }) => void;
}) {
  const { state: authState, dispatch } = useAuthContext() as AuthContextProps;
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();

  const [state, setState] = React.useState<{
    loading?: boolean;
    nonce?: string;
  }>({});

  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch("/api/nonce");
      const nonce = await nonceRes.text();
      setState((x) => ({ ...x, nonce }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    }
  };

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  React.useEffect(() => {
    fetchNonce();
  }, []);

  const signIn = async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      setState((x) => ({ ...x, loading: true }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: state.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");

      setState((x) => ({ ...x, loading: false }));
      dispatch({ type: "LOGIN", payload: address });
      if (onSuccess) onSuccess({ address });

      toast({
        title: "Login successful",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      if (onError) onError({ error: error as Error });
      fetchNonce();
    }
  };

  if (authState.user) {
    return (
      <Button
        rounded={"full"}
        size={"lg"}
        fontWeight={"normal"}
        px={6}
        colorScheme={"green"}
        bg={"green.400"}
        _hover={{ bg: "green.500" }}
        onClick={async () => {
          await fetch("/api/logout");
          dispatch({ type: "LOGOUT" });
          setState({});
        }}
      >
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      ml={4}
      rounded={"full"}
      size={"lg"}
      fontWeight={"normal"}
      px={6}
      colorScheme={"green"}
      bg={"green.400"}
      _hover={{ bg: "green.500" }}
      _disabled={{
        bg: "gray.500",
      }}
      isDisabled={!state.nonce || state.loading || !isConnected}
      onClick={signIn}
      isLoading={state.loading}
    >
      Sign-In {!isConnected && " (Connect wallet first)"}
    </Button>
  );
}

export default SignInButton;
