import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  Input,
  Container,
  useColorModeValue,
  FormControl,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";

import Sidebar from "../Sidebar";

function Benefits() {
  const [verificationStep, setVerificationStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.item(0)?.name ?? null);
  };

  const renderStepContent = () => {
    switch (verificationStep) {
      case 1:
        return (
          <>
            <Text>
              To verify your identity, please upload a proof of your farm (a
              document, image, etc.).
            </Text>
            <FormControl mt={4}>
              <Input
                type="file"
                id="file-upload"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                display="none"
              />
              <Button
                as="label"
                htmlFor="file-upload"
                colorScheme="green"
                width="full"
              >
                {selectedFile || "Choose a File"}
              </Button>
            </FormControl>
            <Button
              colorScheme="green"
              mt={4}
              onClick={() => setVerificationStep(2)}
            >
              Upload Document
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Text>
              Thank you! Your document is being verified. This process may take
              a few minutes.
            </Text>
            {/* Simulating blockchain verification */}
            <Button
              colorScheme="green"
              mt={4}
              onClick={() => setVerificationStep(3)}
            >
              Next
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <Text>
              Congratulations! You're verified. Now, you can collect your
              benefits.
            </Text>
            <Button
              colorScheme="green"
              mt={4}
              onClick={() => alert("Benefits collected!")}
            >
              Collect Benefits
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxW={"7xl"}>
      <Sidebar>
        <Heading size="lg">Collect your benefits</Heading>
        <VStack
          spacing={6}
          margin="auto"
          p={4}
          backgroundColor={useColorModeValue("white", "gray.700")}
          borderRadius="md"
        >
          <Box p={5} borderWidth={1} borderRadius="md" mt="10">
            <Text
              fontSize="md"
              color={useColorModeValue("gray.600", "gray.300")}
            >
              Here, you can collect your farming benefits in crypto. Please
              follow the steps to verify your account.
            </Text>
            <Divider my={5} />

            {renderStepContent()}
          </Box>
        </VStack>
      </Sidebar>
    </Container>
  );
}

export default Benefits;
