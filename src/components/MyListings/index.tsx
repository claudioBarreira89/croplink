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
  useToast,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { useAccount, useContractRead, useWaitForTransaction } from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";
import EditProductForm from "../EditProductForm";
import LoadingPage from "../LoadingPage";
import ProductForm from "../ProductForm";
import Sidebar from "../Sidebar";

import useDeleteActions from "./useDeleteActions";

type Product = {
  name: string;
  price: BigInt;
  quantity: BigInt;
};

const MyListings: FC = () => {
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const toast = useToast();

  const [selectedItem, setSelectedItem] = useState<number | undefined>();

  const {
    data,
    isLoading: isListLoading,
    refetch,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: address && "getProduceList",
    args: [address],
  }) as any;

  const { onDeleteItem, deleteLoading } = useDeleteActions(refetch);

  const { isLoading, isSuccess } = useWaitForTransaction({ hash });

  const handleEdit = (index: number) => {
    setSelectedItem(index);
    onEditOpen();
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();

      toast({
        title: "Product added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [isSuccess, refetch, toast]);

  if (isListLoading) return <LoadingPage />;

  return (
    <Box my={10}>
      <Container maxW={"7xl"}>
        <Sidebar>
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              marginBottom="5"
            >
              <Heading size="lg">Add Your Products</Heading>
              <Button
                colorScheme="green"
                onClick={onOpen}
                isLoading={isLoading}
              >
                Add new
              </Button>
            </Flex>

            <VStack spacing={3} marginBottom={5}>
              {data?.map((product: Product, i: number) => (
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
                      isDisabled={deleteLoading === i}
                      onClick={() => handleEdit(i)}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      isLoading={deleteLoading === i}
                      onClick={() => {
                        onDeleteItem(i);
                      }}
                    >
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
        <ProductForm onClose={onClose} setHash={(hash) => setHash(hash)} />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
        <EditProductForm
          details={{
            index: selectedItem,
            ...data[selectedItem || 0],
          }}
          onClose={onEditClose}
          refetch={refetch}
        />
      </Modal>
    </Box>
  );
};

export default MyListings;
