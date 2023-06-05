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

type Buyer = {
  id: string;
  price: number;
  address: string;
};

const buyers: Buyer[] = [
  {
    id: "1",
    price: 2.5, // Price per kg
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  },
  {
    id: "2",
    price: 3.0, // Price per kg
    address: "0x2B5634C42055806a59e9107ED44D43c426E58258",
  },
  {
    id: "3",
    price: 1.5, // Price per kg
    address: "0x1F573D6FB3F13d689FF844B4cE37794d79a7FF1C",
  },
  {
    id: "4",
    price: 1.0, // Price per kg
    address: "0x6810e776880C02933D47DB1b9fc05908e5386b96",
  },
];

export default function FindBuyer() {
  const { address } = useAccount();
  const toast = useToast();

  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null | undefined>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSell = (buyerId: string) => {
    const selected = buyers.find((buyer) => buyer.id === buyerId);
    setSelectedBuyer(selected);
    onOpen();
  };

  const { data, refetch, isLoading } = useContractRead({
    address: contractAddress,
    abi,
    functionName: address && "buyers",
    args: [address],
  });

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "sellProduceAtMarketPrice",
    args: [selectedBuyer?.address],
  });
  const {
    write,
    data: sellProduceData,
    isLoading: sellProduceLoading,
    isError,
  } = useContractWrite(config);

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
            {buyers.map((buyer) => (
              <BuyerListing key={buyer.id} buyer={buyer} onSell={handleSell} />
            ))}
            {selectedBuyer && (
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>
                    Sell to {truncateAddress(selectedBuyer.address)}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text>
                      Are you sure you want to sell your produce to{" "}
                      <b>{truncateAddress(selectedBuyer.address)}</b> at the
                      price of <b>{selectedBuyer.price}</b>?
                    </Text>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="green" mr={3} onClick={onClose}>
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
  buyer,
  onSell,
}: {
  buyer: Buyer;
  onSell: (buyerId: string) => void;
}) => {
  return (
    <HStack
      key={buyer.id}
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
          {truncateAddress(buyer.address)}
        </Text>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={useColorModeValue("green.600", "green.200")}
        >
          Price: {buyer.price} ETH/kg
        </Text>
      </VStack>
      <VStack align="start">
        <Text fontSize="sm">Wallet Address:</Text>
        <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.200")}>
          {buyer.address}
        </Text>
      </VStack>
      <Button colorScheme="green" onClick={() => onSell(buyer.id)}>
        Market sell
      </Button>
    </HStack>
  );
};
