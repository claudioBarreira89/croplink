import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Container,
  useColorModeValue,
  FormControl,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useState } from "react";

import FileUploader from "../FileUploader";
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
              Congratulations! You are verified. Now, you can collect your
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
    <Container maxW={"7xl"} my={10}>
      <Sidebar>
        <Heading size="lg" mb="5">
          Collect your benefits
        </Heading>

        <Card>
          <CardBody
            bg={useColorModeValue("gray.50", "gray.900")}
            textAlign={"center"}
          >
            <Box>
              <Heading size="md" mb="5" textAlign={"center"}>
                Get verified to benefit from monthly rewards!
              </Heading>

              <Text flex={1} textAlign={"center"} mb="10">
                You can benefit from receiving a monthly crypto payment from our
                treasury. <br />
                First, we just need proof of you farmer activity
              </Text>
            </Box>

            <FileUploader />

            <Button
              colorScheme="green"
              mt={10}
              rounded="full"
              onClick={() => setVerificationStep(2)}
              width={300}
            >
              Continue
            </Button>
          </CardBody>
        </Card>
      </Sidebar>
    </Container>
  );
}

export default Benefits;
