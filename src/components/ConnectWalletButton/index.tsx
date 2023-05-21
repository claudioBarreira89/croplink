import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { FC, useEffect } from "react";
import { Button, Image } from "@chakra-ui/react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { truncateAddress } from "@/utils";

const ConnectWalletButton: FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, isLoading } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();

  const connectWallet = () => {
    connect();
  };

  const disconnectWallet = () => {
    disconnect();
  };

  useEffect(() => {
    const connectWalletOnPageLoad = () => {
      if (localStorage?.getItem("wagmi.connected") === "true" && !isConnected) {
        connect();
      }
    };
    connectWalletOnPageLoad();
  }, [connect, isConnected]);

  if (isConnected) {
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
        onClick={() => disconnectWallet()}
      >
        {ensName
          ? `${ensName} (${truncateAddress(address)})`
          : truncateAddress(address)}
      </Button>
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
      isDisabled={isLoading}
      isLoading={isLoading}
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

export default ConnectWalletButton;
