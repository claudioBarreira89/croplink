import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

import Navbar from "../Navbar";

const Layout = ({ children }: { children: ReactNode }) => (
  <Flex h="100vh" direction="column">
    <Navbar />
    <Box h="full" overflow={"auto"}>
      <Box my={10}>{children}</Box>
    </Box>
  </Flex>
);

export default Layout;
