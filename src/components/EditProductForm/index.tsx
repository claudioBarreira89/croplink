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
import { useDebounce } from "usehooks-ts";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";

import { parseEthToWei, parseWeiToEth } from "@/utils/parseProductPrice";

const EditProductForm: FC<{
  details: { index: number; name: string; price: number; quantity: number };
  refetch: () => void;
  onClose: () => void;
}> = ({ details, refetch, onClose }) => {
  const [name, setName] = useState<string>(details.name);
  const [price, setPrice] = useState<string>(parseWeiToEth(details.price));
  const [quantity, setQuantity] = useState<number>(details.quantity);
  const debouncedPrice = useDebounce(price, 500);
  const debouncedQuantity = useDebounce(quantity, 500);
  const toast = useToast();

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "editProduce",
    args: [
      details.index,
      name,
      debouncedQuantity,
      parseEthToWei(Number(debouncedPrice)),
    ],
  });

  const { data, write, isLoading } = useContractWrite(config);

  const { isLoading: isEditLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onSubmitProduct = useCallback(() => {
    if (!name || !price || !quantity) return;
    if (write) write();
  }, [name, price, quantity, write]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      onClose();

      toast({
        title: "Product updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [isSuccess, onClose, refetch, toast]);

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <FormControl id="product-name" isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="product-price" isRequired>
              <FormLabel>Price in ETH</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>

            <FormControl id="product-quantity" isRequired>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                value={quantity.toString()}
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
            isLoading={isLoading || isEditLoading}
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default EditProductForm;
