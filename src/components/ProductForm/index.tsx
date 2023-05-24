import React, { FC, useCallback, useState } from "react";
import {
  Button,
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
  useToast,
} from "@chakra-ui/react";

import { abi, contractAddress } from "../../../constants/croplink";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const ProductForm: FC<{ onSubmit: () => void; onClose: () => void }> = ({
  onSubmit,
  onClose,
}) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const toast = useToast();

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "addProduce",
    args: [name, price, quantity],
  });

  const {
    data: writeData,
    write,
    isLoading,
    isError,
    writeAsync,
  } = useContractWrite({
    ...config,
    onSuccess: () => {
      toast({
        title: "Product added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      onClose();

      setName("");
      setPrice(0);
      setQuantity(0);

      onSubmit();
    },
  });

  const onSubmitProduct = useCallback(() => {
    if (!name || !price || !quantity) return;
    if (write) write();
  }, [name, price, quantity, write]);

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <FormControl id="product-name" isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input type="text" onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl id="product-price" isRequired>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                onChange={(e) => setPrice(parseInt(e.target.value))}
              />
            </FormControl>

            <FormControl id="product-quantity" isRequired>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={onSubmitProduct}
            isLoading={isLoading}
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default ProductForm;
