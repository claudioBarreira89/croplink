import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";

const LoadingPage = () => {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      position={"fixed"}
      top={0}
    >
      <Spinner size="xl" thickness="4px" color="teal.500" />
    </Box>
  );
};

export default LoadingPage;
