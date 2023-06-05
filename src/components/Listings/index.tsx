import {
  Box,
  Container,
  Flex,
  Heading,
  Table,
  TableContainer,
  Td,
  Th,
  Tbody,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FC } from "react";
import { useAccount, useContractRead } from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";
import LoadingPage from "../LoadingPage";
import Sidebar from "../Sidebar";

type Product = {
  name: string;
  price: BigInt;
  quantity: BigInt;
};

const Listings: FC = () => {
  const {
    data,
    isLoading: isListLoading,
    refetch,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAllProduceList",
  }) as any;

  if (isListLoading) return <LoadingPage />;

  return (
    <Box>
      <Container maxW={"7xl"} mt="10">
        <Sidebar>
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              marginBottom="5"
            >
              <Heading size="lg">Listings</Heading>
            </Flex>
          </Box>

          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Price</Th>
                  <Th>Stock</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((product: Product, i: number) => (
                  <Tr key={i}>
                    <Th>{product.name}</Th>
                    <Th>{product.price.toString()}</Th>
                    <Th>{product.quantity.toString()}</Th>
                    <Th></Th>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Sidebar>
      </Container>
    </Box>
  );
};

export default Listings;
