import {
  Box,
  Container,
  Flex,
  Heading,
  Table,
  TableContainer,
  Td,
  Th,
  Tbody,
  Thead,
  Tr,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";
import LoadingPage from "../LoadingPage";
import Sidebar from "../Sidebar";

import { parseEthToWei, parseWeiToEth } from "@/utils/parseProductPrice";

const MarketPrices: FC = () => {
  const [price, setPrice] = useState<number | undefined>(0);

  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    data,
    isLoading: isListLoading,
    refetch,
  } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getMarketPrices",
  }) as any;

  const {
    data: setMarketPriceData,
    write,
    isLoading,
  } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "setMarketPrice",
    onSuccess: () => {
      onClose();
      setPrice(undefined);
    },
  });

  const { isLoading: isWaitForLoading, isSuccess } = useWaitForTransaction({
    hash: setMarketPriceData?.hash,
  });

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  if (isListLoading) return <LoadingPage />;

  const marketPrices = data?.filter(({ price }: any) => price > 0);

  return (
    <>
      <Box>
        <Container maxW={"7xl"} mt="10">
          <Sidebar>
            <Box>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                marginBottom="5"
              >
                <Heading size="lg">Market Prices</Heading>
                <Button
                  colorScheme="green"
                  onClick={onOpen}
                  isLoading={isWaitForLoading}
                >
                  Add market price
                </Button>
              </Flex>
            </Box>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Address</Th>
                    <Th>Price in ETH</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {marketPrices?.map((item: any, i: number) => (
                    <Tr key={i} bg={item.buyer === address ? "green.200" : ""}>
                      <Th>{item.buyer}</Th>
                      <Th>{parseWeiToEth(item.price).toString()}</Th>
                      <Th />
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Sidebar>
        </Container>
      </Box>

      <AddMarketPriceModal
        isOpen={isOpen}
        isLoading={isLoading}
        setPrice={setPrice}
        onClose={onClose}
        onSubmit={() => {
          if (write) {
            write({
              value: BigInt(parseEthToWei(price || 0)),
            });
          }
        }}
      />
    </>
  );
};

const AddMarketPriceModal = ({
  isOpen,
  isLoading,
  onClose,
  setPrice,
  onSubmit,
}: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add market price</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={3}>
            <FormControl id="price" isRequired>
              <FormLabel>Price in ETH</FormLabel>
              <Input type="number" onChange={(e) => setPrice(e.target.value)} />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={isLoading}
            colorScheme="teal"
            mr={3}
            onClick={onSubmit}
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MarketPrices;
