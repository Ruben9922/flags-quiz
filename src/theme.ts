import {extendTheme} from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "Lato, sans-serif",
    body: "Lato, sans-serif",
  },
});

export default theme;
