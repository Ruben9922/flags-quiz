import React from "react";
import {Box, Flex, IconButton, Link, Stack, Text, Tooltip, useColorMode, useColorModeValue} from "@chakra-ui/react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import {FaGithub} from "react-icons/fa";

function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box alignSelf="stretch" bg={useColorModeValue("gray.100", "gray.900")} px={6}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Text /*color="whiteAlpha.900"*/ fontWeight="bold">Flags Quiz</Text>

          <Flex alignItems="center">
            <Stack direction="row" spacing={2}>
              <Tooltip label="GitHub repository" hasArrow>
                <IconButton
                  variant={colorMode === "light" ? "solid" : "ghost"}
                  icon={<FaGithub />}
                  aria-label="GitHub repository"
                  href="https://github.com/Ruben9922/flags-quiz"
                  isExternal
                  as={Link}
                />
              </Tooltip>
              <Tooltip label="Toggle dark mode" hasArrow>
                <IconButton
                  variant={colorMode === "light" ? "solid" : "ghost"}
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  aria-label="Toggle dark mode"
                />
              </Tooltip>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default NavBar;
