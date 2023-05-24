import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { sepolia } from "viem/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: false,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
          </AuthProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}
