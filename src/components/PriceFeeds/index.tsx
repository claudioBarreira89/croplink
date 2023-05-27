import { Box, Container } from "@chakra-ui/react";

import Sidebar from "../Sidebar";

export default function PriceFeeds() {
  return (
    <Box>
      <Container maxW={"7xl"} mt="10">
        <Sidebar>PriceFeeds</Sidebar>
      </Container>
    </Box>
  );
}
