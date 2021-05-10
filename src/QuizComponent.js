import React from 'react';
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import {useImmerReducer} from "use-immer";
import * as R from "ramda";
import QuestionComponent from "./QuestionComponent";
import SummaryComponent from "./SummaryComponent";

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
    currentQuestion: {
      countries: pickedCountries,
      correctCountry: chooseElement(pickedCountries),
    },
    answers: [],
    correctSnackbarOpen: false,
    incorrectSnackbarOpen: false,
    answered: false,
  };
}

export function isAnswerCorrect(answer) {
  return R.equals(answer.correctCountry, answer.selectedCountry);
}

function reducer(draft, action) {
  const resetQuestion = () => {
    const pickedCountries = pickCountries(action.countries);

    draft.currentQuestion = {
      countries: pickedCountries,
      correctCountry: chooseElement(pickedCountries),
    };
    draft.answered = false;
  }

  switch (action.type) {
    case "answer":
      const answer = {
        countries: draft.currentQuestion.countries,
        correctCountry: draft.currentQuestion.correctCountry,
        selectedCountry: action.country,
      };
      const isCorrect = isAnswerCorrect(answer);

      draft.answers = R.append(answer, draft.answers);
      draft.correctSnackbarOpen = isCorrect;
      draft.incorrectSnackbarOpen = !isCorrect;
      // draft.currentQuestion = null;
      draft.answered = true;

      return;
    case "resetQuestion":
      resetQuestion();

      return;
    case "closeSnackbar":
      draft.correctSnackbarOpen = false;
      draft.incorrectSnackbarOpen = false;

      return;
    case "reset":
      draft.answers = [];
      resetQuestion();

      return;
    // no default
  }
}

function QuizComponent({ countries }) {
  const [state, dispatch] = useImmerReducer(reducer, init(countries));
  const [view, setView] = React.useState("question");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: "closeSnackbar" });
  };

  return (
    <>
      <Container maxWidth="lg" style={{marginTop: "6em"}}>
        {view !== "summary" ? (
          <div style={{textAlign: "center"}}>
            <QuestionComponent
              currentQuestion={state.currentQuestion}
              answers={state.answers}
              answer={country => dispatch({ type: "answer", country })}
              resetQuestion={() => dispatch({ type: "resetQuestion", countries })}
              answered={state.answered}
            />
            <Button variant="contained" onClick={() => setView("summary")} style={{ marginTop: "25px" }}>
              End game
            </Button>
          </div>
        ) : (
          <>
            <SummaryComponent answers={state.answers} />
            <div style={{textAlign: "center"}}>
              <Button
                variant="contained"
                style={{ marginTop: "25px" }}
                onClick={() => { setView("question"); dispatch({ type: "reset", countries }); }}>
                Play again
              </Button>
            </div>
          </>
        )}
      </Container>
      <Snackbar
        key={R.length(state.answers)}
        open={state.correctSnackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Correct!
        </Alert>
      </Snackbar>
      <Snackbar
        key={R.length(state.answers)}
        open={state.incorrectSnackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" elevation={6} variant="filled">
          Incorrect!
          {R.last(state.answers)?.correctCountry && (
            <>&nbsp;It's the flag of {R.last(state.answers)?.correctCountry.name}.</>
          )}
        </Alert>
      </Snackbar>
    </>
  );
}

export default QuizComponent;
