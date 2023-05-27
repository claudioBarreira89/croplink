import {
  Box,
  Button,
  Text,
  Container,
  VStack,
  Flex,
  Heading,
  useDisclosure,
  Modal,
} from "@chakra-ui/react";
import isEqual from "lodash.isequal";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useContractRead } from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";
import LoadingPage from "../LoadingPage";
import Navbar from "../Navbar";
import ProductForm from "../ProductForm";
import Sidebar from "../Sidebar";

type Product = {
  name: string;
  price: BigInt;
  quantity: BigInt;
};

type Props = {
  products: Product[];
};

const MyListings: FC = () => {
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);

  const { data, isLoading, refetch } = useContractRead({
    address: contractAddress,
    abi,
    functionName: address && "getProduceList",
    args: [address],
  }) as any;

  const onSubmit = async () => {
    const res = await refetch();
    setProducts(res.data);
  };

  useEffect(() => {
    setProducts(data);
  }, [data]);

  if (isLoading) return <LoadingPage />;

  return (
    <Box>
      <Container maxW={"7xl"}>
        <Sidebar>
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              marginBottom="5"
            >
              <Heading size="lg">Add Your Products</Heading>
              <Button colorScheme="green" onClick={onOpen}>
                Add new
              </Button>
            </Flex>

            <VStack spacing={3} marginBottom={5}>
              {products?.map((product: Product, i: number) => (
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
                    <Text
                      fontSize="xl"
                      fontWeight="semibold"
                      lineHeight="tight"
                    >
                      {product.name}
                    </Text>
                    <Text fontSize="sm">
                      Price: {product.price.toString()} - Stock:{" "}
                      {product.quantity.toString()}
                    </Text>
                  </Box>

                  <Box>
                    <Button
                      colorScheme="teal"
                      variant="outline"
                      marginRight={2}
                    >
                      Edit
                    </Button>
                    <Button colorScheme="red" variant="outline">
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
        </Sidebar>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ProductForm onClose={onClose} onSubmit={onSubmit} />
      </Modal>
    </Box>
  );
};

export default MyListings;
