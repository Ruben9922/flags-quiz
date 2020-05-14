import React from 'react';
import AppBarComponent from "./AppBarComponent";
import Container from "@material-ui/core/Container";
import ReactCountryFlag from "react-country-flag";

function App() {
  return [
    <AppBarComponent/>,
    <Container maxWidth="md" style={{marginTop: "4em"}}>
      <div style={{ textAlign: "center" }}>
        <ReactCountryFlag countryCode="GB" svg style={{
          fontSize: '10em',
          lineHeight: '10em',
        }}/>
      </div>
    </Container>
  ];
}

export default App;
