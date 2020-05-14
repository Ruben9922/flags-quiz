import React from 'react';
import Container from "@material-ui/core/Container";
import ReactCountryFlag from "react-country-flag";

class QuizComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {countries} = this.props;

    return (
      <Container maxWidth="md" style={{marginTop: "4em"}}>
        <div style={{textAlign: "center"}}>
          <ReactCountryFlag countryCode="GB" svg style={{
            fontSize: '10em',
            lineHeight: '10em',
          }}/>
        </div>
        <ul>
          {countries.map(country => (
            <li key={country.alpha2Code}>
              {country.name} {country.alpha2Code}
            </li>
          ))}
        </ul>
      </Container>
    );
  }
}

export default QuizComponent;
