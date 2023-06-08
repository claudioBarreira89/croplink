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
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
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
import { parseWeiToEth } from "@/utils/parseProductPrice";

type BuyerPrice = {
  price: any;
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

  const {
    write,
    data: sellProduceData,
    isLoading: sellProduceLoading,
    isError,
  } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "sellProduceAtMarketPrice",
    onSuccess: onClose,
  });

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
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Address</Th>
                      <Th>Price in ETH</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {buyerPrices?.map((item: BuyerPrice, i: number) => (
                      <BuyerListing key={i} item={item} onSell={handleSell} />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
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
                      of <b>{parseWeiToEth(selectedBuyer.price)} ETH</b>?
                    </Text>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="green"
                      mr={3}
                      onClick={() => {
                        if (write) {
                          write({
                            args: [selectedBuyer?.buyer],
                          });
                        }
                      }}
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
    <Tr>
      <Th>{item.buyer}</Th>
      <Th>{parseWeiToEth(item.price)}</Th>

      <Th>
        <Button
          bg={"green.400"}
          _hover={{ bg: "green.500" }}
          colorScheme={"green"}
          fontWeight={"normal"}
          size="xs"
          onClick={() => onSell(item)}
        >
          Market sell
        </Button>
      </Th>
    </Tr>
  );
};
