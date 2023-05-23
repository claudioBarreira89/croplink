import Navbar from "@/components/Navbar";
import { Box, Container } from "@chakra-ui/react";
import Sidebar from "../Sidebar";

export default function Listings() {
  return (
    <Box>
      <Navbar />
      <Container maxW={"7xl"} mt="10">
        <Sidebar>Listings</Sidebar>
      </Container>
    </Box>
  );
}
