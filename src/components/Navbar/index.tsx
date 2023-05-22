import * as React from "react";
import { Box, Container, Flex, Heading, Stack } from "@chakra-ui/react";
import SignInButton from "../SignInButton";
import { AuthContextProps, useAuthContext } from "@/context/useUserContext";

const Navbar = () => {
  const { state } = useAuthContext() as AuthContextProps;

  return (
    <Box bg="whitesmoke">
      <Container maxW={"7xl"}>
        <Stack
          as="nav"
          align="center"
          wrap="wrap"
          py={3}
          direction={{ base: "column", sm: "row" }}
          justify={{ base: "center", sm: "space-between" }}
        >
          <Flex align="center">
            <Heading as="h1" size="lg">
              CROPLINK
            </Heading>
          </Flex>

          <Box display="flex" width="auto" alignItems="center">
            {state?.user && <SignInButton />}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Navbar;
