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
import React, { FC, useCallback, useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";

const ProductForm: FC<{
  setHash: (hash?: `0x${string}`) => void;
  onClose: () => void;
}> = ({ setHash, onClose }) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "addProduce",
    args: [name, quantity, price],
  });

  const { data, write, isLoading } = useContractWrite({
    ...config,
    onSuccess: () => {
      onClose();
      setName("");
      setPrice(0);
      setQuantity(0);
    },
  });

  const onSubmitProduct = useCallback(() => {
    if (!name || !price || !quantity) return;
    if (write) write();
  }, [name, price, quantity, write]);

  useEffect(() => {
    setHash(data?.hash);
  }, [data?.hash, setHash]);

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
