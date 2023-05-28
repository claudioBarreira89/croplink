import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  useBreakpointValue,
  IconProps,
  Icon,
  Image,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import Navbar from "../Navbar";
import SignInButton from "../SignInButton";

import { AuthContextProps, useAuthContext } from "@/context/useUserContext";

export default function Login() {
  const { state } = useAuthContext() as AuthContextProps;
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    if (state.user && !state.isLoading) handleRedirect();
  }, [state, handleRedirect]);

  return (
    <Box>
      <Box position={"relative"} bgGradient="linear(to-r, green.100,green.300)">
        <Container maxW={"7xl"}>
          <Stack
            align={"center"}
            spacing={{ base: 8, md: 20 }}
            py={{ base: 20, md: 32 }}
            direction={{ base: "column", md: "row" }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Stack>
                <Heading
                  lineHeight={1.1}
                  fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "8xl" }}
                  bgGradient="linear(to-r, green.300,blue.500)"
                  bgClip="text"
                >
                  CropLink
                </Heading>
                <Heading
                  fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
                >
                  revolutionizes produce sales, empowering farmers with secure
                  and efficient transactions.
                </Heading>
              </Stack>
              <Stack>
                <Text color={"gray.500"}>Connect your wallet and sign in:</Text>
                <SignInButton />
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={"center"}
              align={"center"}
              position={"relative"}
              w={"full"}
            >
              <Box
                position={"relative"}
                rounded={"2xl"}
                boxShadow={"2xl"}
                width={"full"}
                overflow={"hidden"}
              >
                <Image
                  alt={"Hero Image"}
                  fit={"cover"}
                  align={"center"}
                  w={"100%"}
                  h={"100%"}
                  src={"/assets/hero.webp"}
                />
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>
      <Container maxW={"7xl"}>
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 40 }}
          direction={{ base: "column" }}
        >
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "2xl", md: "3xl", lg: "5xl" }}
            bgGradient="linear(to-r, green.300,orange.300)"
            bgClip="text"
            textAlign="center"
            maxW={{ base: "lg", sm: "xl", md: "2xl", lg: "4xl" }}
            m="auto"
          >
            An AgriTech Dapp with weather-savvy smart contracts for bountiful
            selling
          </Heading>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "xl", sm: "xl", md: "2xl", lg: "3xl" }}
            textAlign="center"
            maxW={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}
            m="auto"
            pb="20"
          >
            Where farmers sow, Chainlink oracle grows, and sellers reap the
            harvest of decentralized agri-trade
          </Heading>

          <Box
            position={"relative"}
            rounded={"2xl"}
            boxShadow={"2xl"}
            width={"full"}
            overflow={"hidden"}
            maxW="4xl"
          >
            <Image
              alt={"Hero Image"}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={"100%"}
              src={"/assets/agriculture.jpg"}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
