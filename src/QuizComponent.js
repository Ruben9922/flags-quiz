import React from 'react';
import Container from "@material-ui/core/Container";
import ReactCountryFlag from "react-country-flag";

function QuizComponent() {
  return (
    <Container maxWidth="md" style={{marginTop: "4em"}}>
      <div style={{ textAlign: "center" }}>
        <ReactCountryFlag countryCode="GB" svg style={{
          fontSize: '10em',
          lineHeight: '10em',
        }}/>
      </div>
    </Container>
  );
}

export default QuizComponent;
