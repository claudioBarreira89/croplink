import * as React from "react";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import ConnectWalletButton from "../ConnectWalletButton";
import SignInButton from "../SignInButton";
import { AuthContextProps, useAuthContext } from "@/context/useUserContext";

const Navbar = () => {
  const { state } = useAuthContext() as AuthContextProps;

  return (
    <Box bg="whitesmoke">
      <Container maxW={"7xl"}>
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          py={3}
        >
          <Flex align="center" mr={5}>
            <Heading as="h1" size="lg">
              CROPLINK
            </Heading>
          </Flex>

          <Box display="flex" width="auto" alignItems="center" gap={"2"}>
            <ConnectWalletButton />
            {state?.user && <SignInButton />}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
