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
  Button,
  Modal,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { useContractRead } from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";
import BuyProductForm from "../BuyProductForm";
import LoadingPage from "../LoadingPage";
import Sidebar from "../Sidebar";

import { parseWeiToEth } from "@/utils/parseProductPrice";

type Product = {
  name: string;
  price: number;
  quantity: number;
  index: number;
  farmer: string;
};

const Listings: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {
    data: produceListData = [],
    isLoading: isListLoading,
    refetch,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getAllProduceList",
  }) as any;

  const [data, adjustment] = produceListData;

  const onBuyModalOpen = useCallback(
    (product: Product) => {
      setSelectedProduct({
        ...product,
        price: product.price + product.price / adjustment,
      });
      onOpen();
    },
    [adjustment, onOpen]
  );

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
                  <Th>Price in ETH</Th>
                  <Th>Stock</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data
                  ?.filter((product: Product) => product.name.length)
                  .map((product: Product, i: number) => (
                    <Tr key={i}>
                      <Th>{product.name}</Th>
                      <Th>
                        {parseWeiToEth(
                          product.price + product.price / adjustment
                        ).toString()}{" "}
                        {adjustment > 0 && (
                          <Text color={"green.400"} as="span">
                            (+{parseWeiToEth(product.price / adjustment)})
                          </Text>
                        )}
                        {adjustment < 0 && (
                          <Text color={"red.400"} as="span">
                            ({parseWeiToEth(product.price / adjustment)})
                          </Text>
                        )}
                      </Th>
                      <Th>{product.quantity.toString()}</Th>
                      <Th>
                        <Button
                          bg={"green.400"}
                          _hover={{ bg: "green.500" }}
                          colorScheme={"green"}
                          fontWeight={"normal"}
                          size="xs"
                          onClick={() => onBuyModalOpen(product)}
                        >
                          Buy
                        </Button>
                      </Th>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Text fontSize="xs" color="gray.600" mt={5}>
            Prices may change due to weather conditions
          </Text>
        </Sidebar>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <BuyProductForm
          details={selectedProduct}
          onClose={onClose}
          refetchListings={refetch}
        />
      </Modal>
    </Box>
  );
};

export default Listings;
