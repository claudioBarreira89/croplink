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
} from "@chakra-ui/react";
import Navbar from "../Navbar";
import SignInButton from "../SignInButton";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { AuthContextProps, useAuthContext } from "@/context/useUserContext";

export default function Login() {
  const { state: authState } = useAuthContext() as AuthContextProps;
  const { replace } = useRouter();

  const handleRedirect = useCallback(() => {
    replace("/");
  }, [replace]);

  useEffect(() => {
    console.log({ authState });
    if (authState.user) handleRedirect();
  }, [authState, handleRedirect]);

  return (
    <Box position={"relative"} bg="green.100" h="100vh">
      <Navbar />
      <Container maxW={"7xl"}>
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
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
                revolutionizes produce sales, empowering farmers with secure and
                efficient transactions.
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
            <Blob
              w={"150%"}
              h={"150%"}
              position={"absolute"}
              top={"-20%"}
              left={0}
              zIndex={-1}
              color={useColorModeValue("green.50", "green.400")}
            />
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
  );
}

export const Blur = (props: IconProps) => {
  return (
    <Icon
      width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#48BB78" />
      <circle cx="244" cy="106" r="139" fill="#48BB78" />
      <circle cy="291" r="139" fill="#48BB78" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#48BB78" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#48BB78" />
    </Icon>
  );
};

export const Blob = (props: IconProps) => {
  return (
    <Icon
      width={"100%"}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};
