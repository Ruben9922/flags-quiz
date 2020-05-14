import React from 'react';
import Container from "@material-ui/core/Container";
import ReactCountryFlag from "react-country-flag";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class QuizComponent extends React.Component {
  constructor(props) {
    super(props);

    let pickedCountries = this.pickCountries();
    let correctCountry = this.chooseElement(pickedCountries);

    this.state = {
      pickedCountries: pickedCountries,
      correctCountry: correctCountry,
      totalCorrect: 0,
      totalAnswered: 0
    };
  }

  render() {
    const {classes, countries} = this.props;
    const {pickedCountries, correctCountry, totalCorrect, totalAnswered} = this.state;

    return (
      <Container maxWidth="md" style={{marginTop: "4em", textAlign: "center"}}>
        <Typography paragraph>
          Score: {totalCorrect}/{totalAnswered}
        </Typography>
        <ReactCountryFlag countryCode={correctCountry.alpha2Code} svg style={{
          fontSize: '10em',
          lineHeight: '10em',
        }}/>
        <Grid container className={classes.root}>
          {pickedCountries.map(country => (
            <Grid item xs={6}>
              <Card onClick={() => this.handleClick(country)} style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', width: "100%"}}>
                <CardActionArea>
                  <Typography variant="body1">
                    {country.name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  handleClick(country) {
    let pickedCountries = this.pickCountries();
    let correctCountry = this.chooseElement(pickedCountries);

    this.setState(state => ({
      pickedCountries: pickedCountries,
      correctCountry: correctCountry,
      totalCorrect: country === state.correctCountry ? state.totalCorrect + 1 : state.totalCorrect,
      totalAnswered: state.totalAnswered + 1
    }));
  }

  pickCountries() {
    const {countries} = this.props;

    let pickedCountries = []
    const count = 4;
    for (let i = 0; i < count; i++) {
      let country = countries[Math.floor(Math.random() * countries.length)];
      pickedCountries.push(country)
    }

    return pickedCountries;
  }

  chooseElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

export default withStyles(styles)(QuizComponent);
