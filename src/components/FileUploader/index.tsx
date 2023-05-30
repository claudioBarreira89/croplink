import { Box, Text, Button, useToast, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | undefined | null>(
    null
  );
  const toast = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);

    if (file) {
      toast({
        title: "File Selected",
        description: `${file.name} is ready for upload.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box textAlign="center">
      <Text fontSize="md" mb={4}>
        Upload your document
      </Text>
      <Button
        as="label"
        htmlFor="file-upload"
        size="lg"
        colorScheme="green"
        variant="outline"
        leftIcon={<Icon as={AiOutlineUpload} w={6} h={6} />}
      >
        Choose a File
      </Button>
      <input
        id="file-upload"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {selectedFile && (
        <Text mt={2}>
          Selected File: <strong>{selectedFile.name}</strong>
        </Text>
      )}
    </Box>
  );
}

export default FileUploader;
