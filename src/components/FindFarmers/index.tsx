import { Box, Container } from "@chakra-ui/react";

import Sidebar from "../Sidebar";

export default function FindBuyer() {
  return (
    <Box>
      <Container maxW={"7xl"} mt="10">
        <Sidebar>FindFarmers</Sidebar>
      </Container>
    </Box>
  );
}
