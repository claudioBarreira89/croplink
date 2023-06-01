import { Box, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useAccount, useContractRead } from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";
import Sidebar from "../Sidebar";

export default function FindBuyer() {
  const { address } = useAccount();
  console.log(address);
  const { data, isLoading } = useContractRead({
    address: contractAddress,
    abi,
    functionName: address && "buyers",
    args: [address],
  }) as any;
  console.log(data);
  return (
    <Container maxW={"7xl"} mt="10">
      <Sidebar>
        <Box>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginBottom="5"
          >
            <Heading size="lg">Find buyers</Heading>
          </Flex>

          {/* <VStack spacing={3} marginBottom={5}>
            {data?.map((buyer: any, i: number) => (
              <Box
                key={i}
                borderWidth="1px"
                borderRadius="lg"
                padding={3}
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Text fontSize="xl" fontWeight="semibold" lineHeight="tight">
                    {buyer}
                  </Text>
                </Box>
              </Box>
            ))}
          </VStack> */}
        </Box>
      </Sidebar>
    </Container>
  );
}
