import React from 'react';
import Container from "@material-ui/core/Container";
import ReactCountryFlag from "react-country-flag";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { useImmerReducer } from "use-immer";
import * as R from "ramda";

const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function pickCountries(countries) {
  const count = 4;
  return R.map(() => chooseElement(countries), R.range(0, count));
}

function chooseElement(l) {
  return l[Math.floor(Math.random() * R.length(l))];
}

function init(countries) {
  const pickedCountries = pickCountries(countries);

  return {
    pickedCountries: pickedCountries,
    correctCountry: chooseElement(pickedCountries),
    totalCorrect: 0,
    totalAnswered: 0,
    correctSnackbarOpen: false,
    incorrectSnackbarOpen: false,
    prevCorrectCountry: null,
    answered: false,
  };
}

function reducer(draft, action) {
  switch (action.type) {
    case "answer":
      const isCorrect = R.equals(action.country, draft.correctCountry);

      draft.totalCorrect = isCorrect ? draft.totalCorrect + 1 : draft.totalCorrect;
      draft.totalAnswered = draft.totalAnswered + 1;
      draft.correctSnackbarOpen = isCorrect;
      draft.incorrectSnackbarOpen = !isCorrect;
      draft.prevCorrectCountry = draft.correctCountry;
      draft.answered = true;

      return;
    case "timerElapsed":
      const pickedCountries = pickCountries(action.countries);

      draft.pickedCountries = pickedCountries;
      draft.correctCountry = chooseElement(pickedCountries);
      draft.answered = false;

      return;
    case "closeSnackbar":
      draft.correctSnackbarOpen = false;
      draft.incorrectSnackbarOpen = false;

      return;
  }
}

function QuizComponent({ countries }) {
  const classes = useStyles();

  const [state, dispatch] = useImmerReducer(reducer, init(countries));

  const handleClick = country => {
    dispatch({ type: "answer", country });
    setTimeout(() => dispatch({ type: "timerElapsed", countries }), 1500);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: "closeSnackbar" });
  };

  return (
    <>
      <Container maxWidth="lg" style={{marginTop: "6em", textAlign: "center"}}>
        <Typography paragraph>
          Score: {state.totalCorrect}/{state.totalAnswered}
        </Typography>
        <ReactCountryFlag countryCode={state.correctCountry.alpha2Code} svg style={{
          fontSize: '10em',
          lineHeight: '10em',
        }}/>
        <Grid
          container
          className={classes.root}
          spacing={2}
          justify="center"
          alignItems="baseline"
        >
          {state.pickedCountries.map((country, index) => (
            <Grid item key={index}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={state.answered}
                onClick={() => handleClick(country)}
                style={{width: "250px", minHeight: "80px"}}
              >
                {country.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Snackbar
        key={state.totalAnswered}
        open={state.correctSnackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Correct!
        </Alert>
      </Snackbar>
      <Snackbar
        key={state.totalAnswered}
        open={state.incorrectSnackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" elevation={6} variant="filled">
          Incorrect!
          {state.prevCorrectCountry && (
            <>&nbsp;It's the flag of {state.prevCorrectCountry.name}.</>
          )}
        </Alert>
      </Snackbar>
    </>
  );
}

export default QuizComponent;
