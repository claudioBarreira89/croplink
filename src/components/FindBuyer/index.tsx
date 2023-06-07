import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";
import Sidebar from "../Sidebar";

import { truncateAddress } from "@/utils";

type BuyerPrice = {
  price: bigint;
  buyer: string;
};

export default function FindBuyer() {
  const { address } = useAccount();
  const toast = useToast();

  const [selectedBuyer, setSelectedBuyer] = useState<
    BuyerPrice | null | undefined
  >(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSell = (item: BuyerPrice) => {
    setSelectedBuyer(item);
    onOpen();
  };

  const { data, refetch, isLoading } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getMarketPrices",
  }) as any;
  console.log(selectedBuyer?.buyer);
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "sellProduceAtMarketPrice",
    args: [selectedBuyer?.buyer],
  });
  const {
    write,
    data: sellProduceData,
    isLoading: sellProduceLoading,
    isError,
  } = useContractWrite({ ...config, onSuccess: onClose });

  const { isLoading: waitForLoading, isSuccess } = useWaitForTransaction({
    hash: sellProduceData?.hash,
  });

  const onSuccess = useCallback(async () => {
    if (refetch) refetch();

    toast({
      title: "Produce sold",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }, [refetch, toast]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const buyerPrices = data?.filter(({ price }: any) => price > 0);

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

          <Box>
            {waitForLoading ? (
              <Spinner />
            ) : (
              buyerPrices?.map((item: BuyerPrice, i: number) => (
                <BuyerListing key={i} item={item} onSell={handleSell} />
              ))
            )}
            {selectedBuyer && (
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>
                    Sell to {truncateAddress(selectedBuyer.buyer)}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text>
                      Are you sure you want to sell your produce to{" "}
                      <b>{truncateAddress(selectedBuyer.buyer)}</b> at the price
                      of <b>{selectedBuyer.price.toString()}</b>?
                    </Text>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="green"
                      mr={3}
                      onClick={write}
                      isLoading={sellProduceLoading}
                    >
                      Confirm Sale
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}
          </Box>
        </Box>
      </Sidebar>
    </Container>
  );
}

const BuyerListing = ({
  item,
  onSell,
}: {
  item: BuyerPrice;
  onSell: (item: BuyerPrice) => void;
}) => {
  return (
    <HStack
      bg={useColorModeValue("gray.100", "gray.700")}
      p={4}
      borderRadius="md"
      justifyContent="space-between"
      align="center"
      spacing={4}
      mb={2}
    >
      <VStack align="start">
        <Text fontSize="md" fontWeight="bold">
          {truncateAddress(item.buyer)}
        </Text>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={useColorModeValue("green.600", "green.200")}
        >
          Price: {item.price.toString()} ETH/kg
        </Text>
      </VStack>
      <VStack align="start">
        <Text fontSize="sm">Wallet Address:</Text>
        <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.200")}>
          {item.buyer}
        </Text>
      </VStack>
      <Button colorScheme="green" onClick={() => onSell(item)}>
        Market sell
      </Button>
    </HStack>
  );
};
