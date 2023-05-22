import { ReactNode, useState } from "react";
import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Button,
  Icon,
  Container,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../Navbar";
import { FaViadeo, FaShoppingBag } from "react-icons/fa";
import { useRouter } from "next/router";
import { AuthContextProps, useAuthContext } from "@/context/useUserContext";

function RoleWrapper({
  isSelected,
  name,
  setSelected,
  children,
}: {
  isSelected: boolean;
  name: string;
  setSelected: (name: string) => void;
  children: ReactNode;
}) {
  return (
    <Button
      py={10}
      mb={4}
      shadow="base"
      borderWidth="2px"
      alignSelf={{ base: "center", sm: "flex-start" }}
      borderColor={useColorModeValue("green.200", "blue.500")}
      borderRadius={"xl"}
      bg={isSelected ? "green.200" : "white"}
      _hover={{
        bg: "green.100",
      }}
      onClick={() => setSelected(name)}
    >
      {children}
    </Button>
  );
}

export default function Register() {
  const toast = useToast();
  const { state: authState, dispatch } = useAuthContext() as AuthContextProps;

  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: authState.user, role: selected }),
      });

      dispatch({ type: "UPDATE_ROLE", payload: selected });
      setIsLoading(false);

      toast({
        title: "Role selected",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      push("/");
    } catch (_error) {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Navbar />
      <Container maxW={"7xl"}>
        <Box py={12}>
          <VStack spacing={2} textAlign="center">
            <Heading as="h1" fontSize="4xl">
              Select your role
            </Heading>
            <Text fontSize="lg" color={"gray.500"}>
              Are you looking to sell your crops or looking to buy?
            </Text>
          </VStack>
          <Stack
            direction={{ base: "column", sm: "row" }}
            textAlign="center"
            justify="center"
            spacing={{ base: 4, lg: 10 }}
            py={10}
          >
            <RoleWrapper
              isSelected={"farmer" === selected}
              name="farmer"
              setSelected={(name) => setSelected(name)}
            >
              <Box py={4} px={12} minW={"200"}>
                <Text fontWeight="500" fontSize="3xl">
                  <Icon as={FaViadeo} />
                </Text>
                <Text fontWeight="500" fontSize="2xl">
                  Farmer
                </Text>
              </Box>
            </RoleWrapper>

            <RoleWrapper
              isSelected={"buyer" === selected}
              name="buyer"
              setSelected={(name) => setSelected(name)}
            >
              <Box py={4} px={12} minW={"200"}>
                <Text fontWeight="500" fontSize="3xl">
                  <Icon as={FaShoppingBag} />
                </Text>
                <Text fontWeight="500" fontSize="2xl">
                  Buyer
                </Text>
              </Box>
            </RoleWrapper>
          </Stack>
          <Stack direction={"row"} textAlign="center" justify="center">
            <Button
              rounded={"full"}
              size={"md"}
              fontWeight={"normal"}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
              w="sm"
              py="6"
              isDisabled={!selected}
              isLoading={isLoading}
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
