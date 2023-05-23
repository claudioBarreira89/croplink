import Navbar from "@/components/Navbar";
import { Box, Container } from "@chakra-ui/react";
import Sidebar from "../Sidebar";

export default function FindBuyer() {
  return (
    <Box>
      <Navbar />
      <Container maxW={"7xl"} mt="10">
        <Sidebar>FindBuyer</Sidebar>
      </Container>
    </Box>
  );
}
