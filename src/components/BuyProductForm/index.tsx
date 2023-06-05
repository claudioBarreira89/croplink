import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  Stack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";

type Product = {
  name: string;
  price: number;
  quantity: number;
  index: number;
  farmer: string;
};

const BuyProductForm: FC<{
  details: Product | null;
  onClose: () => void;
}> = ({ details, onClose }) => {
  const toast = useToast();

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "purchaseProduce",
    args: [details?.farmer, details?.index],
  });

  console.log(details);

  const { data, write, isLoading } = useContractWrite(config);

  const { isLoading: isBuyLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onBuyProduct = useCallback(() => {
    if (write) write();
  }, [write]);

  useEffect(() => {
    if (isSuccess) {
      onClose();

      toast({
        title: "Product sale successful",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [isSuccess, onClose, toast]);

  if (!details) return null;

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buy product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <FormControl id="product-name">
              <FormLabel>{`Product: ${details.name}`}</FormLabel>
            </FormControl>

            <FormControl id="product-price">
              <FormLabel>{`Price: ${details.price}`}</FormLabel>
            </FormControl>

            <FormControl id="product-quantity">
              <FormLabel>{`Quantity: ${details.quantity}`}</FormLabel>
            </FormControl>

            <FormControl id="total">
              <FormLabel fontWeight="bold">{`Total: ${
                details.quantity * details.price
              }`}</FormLabel>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={onBuyProduct}
            isLoading={isLoading || isBuyLoading}
          >
            Buy
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default BuyProductForm;
