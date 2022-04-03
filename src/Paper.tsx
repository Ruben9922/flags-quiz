import React from "react";
import {Box, BoxProps, useColorModeValue} from "@chakra-ui/react";

function Paper(props: BoxProps) {
  return (
    <Box
      borderRadius="lg"
      bg={useColorModeValue("white", "gray.700")}
      py={3}
      px={4}
      boxShadow="lg"
      {...props}
    />
  );
}

export default Paper;
