import React from "react";
import {Alert, AlertIcon, ChakraProvider, CircularProgress, Container, VStack} from "@chakra-ui/react";
import {useFetch} from "use-http";
import Quiz from "./Quiz";
import Country from "./country";
import theme from "./theme";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import NavBar from "./NavBar";

export default function App() {
  const { loading, error, data = null } = useFetch<Country[]>("https://restcountries.com/v2/all?fields=name,alpha2Code", {}, []);

  return (
    <ChakraProvider theme={theme}>
      <VStack spacing={6}>
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
        {data && <Quiz countries={data} />}
      </VStack>
    </ChakraProvider>
  )
}