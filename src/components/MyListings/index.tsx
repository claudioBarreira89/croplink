import React, { FC } from "react";
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
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Stack,
} from "@chakra-ui/react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { abi, contractAddress } from "../../../constants/croplink";
import { useAccount, useContractRead } from "wagmi";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type Props = {
  products: Product[];
};

const products = [
  {
    id: 1,
    name: "Fresh Apples",
    price: 20,
    quantity: 100,
  },
  {
    id: 2,
    name: "Organic Carrots",
    price: 15,
    quantity: 80,
  },
  {
    id: 3,
    name: "Free-range Eggs",
    price: 10,
    quantity: 50,
  },
  {
    id: 4,
    name: "Fresh Milk",
    price: 12,
    quantity: 70,
  },
];

const ProductsPage: FC = () => {
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const { data } = useContractRead({
  //   address: contractAddress,
  //   abi: abi.output.abi,
  //   functionName: address && "getProduceList",
  //   args: [address],
  // });

  return (
    <Box>
      <Navbar />
      <Container maxW={"7xl"} mt="10">
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
              {products.map((product) => (
                <Box
                  key={product.id}
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
                      {product.price} USD - {product.quantity} in stock
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
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <FormControl id="product-name" isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input type="text" />
              </FormControl>

              <FormControl id="product-price" isRequired>
                <FormLabel>Price</FormLabel>
                <Input type="number" />
              </FormControl>

              <FormControl id="product-quantity" isRequired>
                <FormLabel>Quantity</FormLabel>
                <Input type="number" />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductsPage;
