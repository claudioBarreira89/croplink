import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaEthereum, FaCheckCircle } from "react-icons/fa";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { abi, contractAddress } from "../../../constants/croplink";
import FileUploader from "../FileUploader";
import LoadingPage from "../LoadingPage";
import Sidebar from "../Sidebar";

import { useAuth } from "@/api/getAuth";

function Benefits() {
  const toast = useToast();
  const { data = {}, isLoading: isAuthLoading, refetch } = useAuth();
  const { id, isVerified } = data;

  const { address } = useAccount();
  const [verificationStep, setVerificationStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [isClaimingLoading, setIsClaimingLoading] = useState(false);

  const { data: verificationData, isLoading: verificationLoading } =
    useContractRead({
      address: contractAddress,
      abi,
      functionName: "farmerVerifications",
      args: [address],
    });

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "verifyFarmer",
  });
  const { config: claimTreasuryConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "claimTreasury",
  });

  const {
    data: verifyFarmerData,
    write: verifyFarmer,
    isLoading: isVerifyFarmerLoading,
    isError: isVerifyFarmerError,
  } = useContractWrite({ ...config, onSuccess: () => handleVerification() });
  const {
    write: claimTreasury,
    isLoading: isClaimTreasuryLoading,
    isError: isClaimTreasuryError,
    error,
  } = useContractWrite({
    ...claimTreasuryConfig,
    onSuccess: () => handleClaimTreasury(),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.item(0)?.name ?? null);
  };

  const handleVerification = useCallback(() => {
    async () => {
      setIsVerificationLoading(true);

      try {
        await axios.put(`/api/ddb/users/${id}/setIsVerified`, {
          verified: true,
        });
        await refetch();

        toast({
          title: "Verified successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        setVerificationStep(2);
      } catch (error) {
        console.error(error);
      }

      setIsVerificationLoading(false);
    };
  }, [id, refetch, toast]);

  const handleClaimTreasury = async () => {
    setIsClaimingLoading(true);

    try {
      await axios.put(`/api/ddb/users/${id}/setClaimTimestamp`, {
        claimTimestamp: Date.now(),
      });
      await refetch();

      toast({
        title: "Treasury claimed successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
    }

    setIsVerificationLoading(false);
  };

  const { isLoading: waitForLoading, isSuccess } = useWaitForTransaction({
    hash: verifyFarmerData?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      handleVerification();
    }
  }, [handleVerification, isSuccess]);

  const renderStepContent = () => {
    switch (verificationStep) {
      case 1:
        return (
          <>
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
              isLoading={isVerifyFarmerLoading || isVerificationLoading}
              onClick={verifyFarmer}
              width={300}
            >
              Continue
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Box>
              <Heading size="md" mb="5" textAlign={"center"}>
                You are now verified!
              </Heading>

              <Text flex={1} textAlign={"center"} mb="10">
                You can now start collecting the benefits from our treasury,
                <br />
                {`don't`} forget to come back every month
              </Text>

              <Heading
                size="4xl"
                mb="10"
                textAlign={"center"}
                color={"green.500"}
              >
                <Icon as={FaCheckCircle} />
              </Heading>
            </Box>

            <Button
              colorScheme="green"
              rounded="full"
              onClick={() => setVerificationStep(0)}
              width={300}
              isLoading={isVerificationLoading || waitForLoading}
            >
              Continue
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const cardBg = useColorModeValue("gray.50", "gray.900");

  if (isAuthLoading || verificationLoading) return <LoadingPage />;

  return (
    <Container maxW={"7xl"} my={10}>
      <Sidebar>
        <Heading size="lg" mb="5">
          Collect your benefits
        </Heading>

        <Card>
          <CardBody bg={cardBg} textAlign={"center"}>
            {verificationData && verificationStep !== 2 ? (
              <>
                <Box>
                  <Heading size="md" mb="5" textAlign={"center"}>
                    Benefit ready to be collected!
                  </Heading>

                  <Text flex={1} textAlign={"center"} mb="10">
                    Click the button to claim your monthly benefit
                  </Text>

                  <Heading
                    size="4xl"
                    mb="10"
                    textAlign={"center"}
                    color={"yellow.400"}
                  >
                    <Icon as={FaEthereum} />
                  </Heading>
                </Box>

                <Button
                  colorScheme="green"
                  rounded="full"
                  onClick={claimTreasury}
                  width={300}
                  isLoading={isClaimTreasuryLoading || isClaimingLoading}
                >
                  Claim your benefit
                </Button>
              </>
            ) : (
              renderStepContent()
            )}
          </CardBody>
        </Card>
      </Sidebar>
    </Container>
  );
}

export default Benefits;
