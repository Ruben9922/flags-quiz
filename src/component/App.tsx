import React from "react";
import {Alert, AlertIcon, ChakraProvider, CircularProgress, Container, VStack} from "@chakra-ui/react";
import {useFetch} from "use-http";
import Quiz from "./Quiz";
import Country from "../core/country";
import theme from "../theme";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import NavBar from "./NavBar";

export default function App() {
  const { loading, error, data = null } = useFetch<Country[]>("https://restcountries.com/v3.1/all?fields=name,cca2,altSpellings,flags", {}, []);

  return (
    <ChakraProvider theme={theme}>
      <VStack spacing={6} pb={8}>
        <NavBar />
        {error && (
          <Container maxW="container.md">
            <Alert status="error">
              <AlertIcon />
              Failed to load country/territory data.
            </Alert>
          </Container>
        )}
        {loading && (
          <Container>
            <CircularProgress isIndeterminate />
          </Container>
        )}
        {data && (
          <Container maxW="container.lg">
            <Quiz countries={data} />
          </Container>
        )}
      </VStack>
    </ChakraProvider>
  )
}
