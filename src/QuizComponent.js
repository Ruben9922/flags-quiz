import React from 'react';
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import {useImmerReducer} from "use-immer";
import * as R from "ramda";
import QuestionComponent from "./QuestionComponent";
import SummaryComponent from "./SummaryComponent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuComponent from "./MenuComponent";
import useCountDown from "react-countdown-hook";

const initialTime = 10 * 1000;
const interval = 1000;

function pickCountries(countries) {
  const count = 4; // Technically, count must be less than the number of countries
  let pickedCountries = [];
  for (let i = 0; i < count; i++) {
    // Choose an element from countries list with the already picked countries removed
    // Could be made more efficient by removing by index; for this you would have to store the list of available
    // countries and remove from this each time
    const pickedCountry = chooseElement(R.without(pickedCountries, countries));
    pickedCountries = R.append(pickedCountry, pickedCountries);
  }
  return pickedCountries;
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
    view: "menu",
    mode: "classic",
  };
}

export function isAnswerCorrect(answer) {
  return answer.selectedCountry !== null && R.equals(answer.correctCountry, answer.selectedCountry);
}

function reducer(draft, action) {
  const resetQuestion = () => {
    const pickedCountries = pickCountries(action.countries);

    draft.currentQuestion = {
      countries: pickedCountries,
      correctCountry: chooseElement(pickedCountries),
    };
    draft.answered = false;

    action.start();
  }

  switch (action.type) {
    case "answer": {
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

      action.pause();

      return;
    }
    case "resetQuestion": {
      resetQuestion();

      const isCorrect = isAnswerCorrect(R.last(draft.answers));

      if (draft.mode === "classic" && !isCorrect) {
        draft.view = "summary";
      }

      return;
    }
    case "closeSnackbar":
      draft.correctSnackbarOpen = false;
      draft.incorrectSnackbarOpen = false;

      return;
    case "playAgain":
      draft.view = "menu";

      return;
    case "setMode":
      draft.mode = action.mode;

      return;
    case "endGame":
      draft.view = "summary";

      return;
    case "startGame":
      draft.answers = [];
      resetQuestion();
      draft.view = "question";

      return;
    // no default
  }
}

function QuizComponent({ countries }) {
  const [state, dispatch] = useImmerReducer(reducer, init(countries));
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: "closeSnackbar" });
  };

  return (
    <>
      <Container maxWidth="lg" style={{marginTop: "6em"}}>
        {state.view === "menu" && (
          <MenuComponent
            mode={state.mode}
            setMode={mode => dispatch({ type: "setMode", mode })}
            startGame={() => dispatch({ type: "startGame", start, countries })}
          />
        )}
        {state.view === "question" && (
          <div style={{textAlign: "center"}}>
            <QuestionComponent
              currentQuestion={state.currentQuestion}
              answers={state.answers}
              answer={country => dispatch({ type: "answer", country, pause })}
              resetQuestion={() => dispatch({ type: "resetQuestion", countries, start })}
              answered={state.answered}
              mode={state.mode}
              timeLeft={timeLeft}
              totalTime={initialTime}
              onCountdownEnd={() => {
                dispatch({ type: "answer", country: null, pause: () => {} });
                setTimeout(() => dispatch({ type: "resetQuestion", countries, start }), 2500);
              }}
            />
            <Button variant="contained" onClick={() => setDialogOpen(true)} style={{ marginTop: "25px" }}>
              End game
            </Button>
          </div>
        )}
        {state.view === "summary" && (
          <>
            <SummaryComponent answers={state.answers} />
            <div style={{textAlign: "center"}}>
              <Button
                variant="contained"
                style={{ marginTop: "25px" }}
                onClick={() => { dispatch({ type: "playAgain" }); }}>
                Play again
              </Button>
            </div>
          </>
        )}
      </Container>
      <Snackbar
        key={R.length(state.answers)}
        open={state.correctSnackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Correct!
        </Alert>
      </Snackbar>
      <Snackbar
        key={R.length(state.answers)}
        open={state.incorrectSnackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" elevation={6} variant="filled">
          {R.last(state.answers)?.selectedCountry === null ? "Out of time!" : "Incorrect!"}
          {R.last(state.answers)?.correctCountry && (
            <>&nbsp;It's the flag of {R.last(state.answers)?.correctCountry.name}.</>
          )}
        </Alert>
      </Snackbar>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you wish to end the game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { setDialogOpen(false); dispatch({ type: "endGame" }); }} color="primary" autoFocus>
            End game
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default QuizComponent;
