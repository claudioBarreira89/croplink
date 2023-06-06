import {
  Box,
  Container,
  Flex,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import Sidebar from "../Sidebar";

const data = [
  {
    produce: "Apples",
    demandPrice: "10",
    supplyPrice: "12",
  },
  {
    produce: "Oranges",
    demandPrice: "8",
    supplyPrice: "10",
  },
  // Add more produce as needed
];

export default function PriceFeeds() {
  return (
    <Box mt="10">
      <Container maxW={"7xl"}>
        <Sidebar>
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              marginBottom="5"
            >
              <Heading size="lg">Price feeds</Heading>
            </Flex>

            <Box overflowX="auto">
              <Table variant="simple">
                <TableCaption>Produce Price Feeds</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Produce</Th>
                    <Th>Demand Price</Th>
                    <Th>Supply Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.produce}</Td>
                      <Td>{item.demandPrice}</Td>
                      <Td>{item.supplyPrice}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Sidebar>
      </Container>
    </Box>
  );
}
