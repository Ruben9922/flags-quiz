import React from "react";
import {Box, BoxProps, useColorModeValue} from "@chakra-ui/react";

type PaperProps = BoxProps & {
  children: React.ReactNode;
}

function Paper({children, ...props}: PaperProps) {
  return (
    <Box
      borderRadius="lg"
      // bg="gray.700"
      // color="whiteAlpha.900"
      bg={useColorModeValue("white", "gray.700")}
      py={3}
      px={4}
      boxShadow="lg"
      {...props}
    >
      {children}
    </Box>
  );
}

export default Paper;
