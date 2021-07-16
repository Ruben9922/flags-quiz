import React from 'react';
import Container from "@material-ui/core/Container";
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
import {isAnswerCorrect} from "./utilities";
import {useSnackbar} from "notistack";
import {computeStreak, isStreakAtThreshold} from "./scoring";

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
    answered: false,
    view: "menu",
    mode: "classic",
    timestamp: null,
  };
}

function reducer(draft, action) {
  switch (action.type) {
    case "answer": {
      const answer = {
        countries: draft.currentQuestion.countries,
        correctCountry: draft.currentQuestion.correctCountry,
        selectedCountry: action.country,
        timeTaken: action.country === null ? null : (performance.now() - draft.timestamp),
      };
      draft.answers = R.append(answer, draft.answers);

      // draft.currentQuestion = null;
      draft.answered = true;
      draft.timestamp = null;

      return;
    }
    case "resetQuestion": {
      const pickedCountries = pickCountries(action.countries);

      draft.currentQuestion = {
        countries: pickedCountries,
        correctCountry: chooseElement(pickedCountries),
      };
      draft.answered = false;
      draft.timestamp = performance.now();

      if (!R.isEmpty(draft.answers) && draft.mode === "classic" && !isAnswerCorrect(R.last(draft.answers))) {
        draft.view = "summary";
      }

      return;
    }
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
      draft.view = "question";

      return;
    // no default
  }
}

function QuizComponent({ countries }) {
  const [state, dispatch] = useImmerReducer(reducer, init(countries));
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [timeLeft, { start, pause }] = useCountDown(initialTime, interval);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (!R.isEmpty(state.answers)) {
      if (isAnswerCorrect(R.last(state.answers))) {
        enqueueSnackbar("Correct!", {
          variant: "success",
        });

        // Snackbar for consecutive correct answers
        const streak = computeStreak(state.answers);
        if (isStreakAtThreshold(streak)) {
          setTimeout(() => enqueueSnackbar(`\u{1F389} Nice! ${streak} in a row!`), 500);
        }
      } else {
        let message = R.last(state.answers)?.selectedCountry === null ? "Out of time!" : "Incorrect!";
        if (R.last(state.answers)?.correctCountry) {
          message += ` It's the flag of ${R.last(state.answers)?.correctCountry.name}.`
        }
        enqueueSnackbar(message, {
          variant: "error",
        });

        // Snackbar for losing a streak
        const prevStreak = computeStreak(R.init(state.answers));
        if (prevStreak >= 3) {
          setTimeout(() => enqueueSnackbar(`\u{1F622} Awh! You just lost your streak of ${prevStreak}!`), 500);
        }
      }
    }
  }, [state.answers, enqueueSnackbar]);

  const displayAllCorrectSnackbar = React.useCallback(() => {
    if (R.length(state.answers) >= 3 && R.all(isAnswerCorrect, state.answers)) {
      enqueueSnackbar("\u{1F389} Awesome! You got 100%!", { variant: "default" });
    }
  }, [state.answers, enqueueSnackbar]);

  React.useEffect(() => {
    if (state.mode === "classic" && !R.isEmpty(state.answers) && !isAnswerCorrect(R.last(state.answers))) {
      setTimeout(() => enqueueSnackbar("Game over!", { variant: "default" }), 1500);
      setTimeout(displayAllCorrectSnackbar, 2000);
    }
  }, [state.answers, state.mode, enqueueSnackbar, displayAllCorrectSnackbar]);

  const startGame = () => {
    dispatch({ type: "startGame", countries });
    resetQuestion();
  };

  const resetQuestion = React.useCallback(() => {
    dispatch({ type: "resetQuestion", countries });
    start();
  }, [countries, dispatch, start]);

  const onCountdownEnd = React.useCallback(
    () => {
      dispatch({ type: "answer", country: null });
      setTimeout(resetQuestion, 2500);
    },
    [dispatch, resetQuestion],
  );

  const answer = country => {
    dispatch({ type: "answer", country });
    pause();
  };

  const endGame = () => {
    setDialogOpen(false);
    dispatch({ type: "endGame", enqueueSnackbar });
    enqueueSnackbar("Game over!", { variant: "default" });
    setTimeout(displayAllCorrectSnackbar, 500);
  };

  return (
    <>
      <Container maxWidth="lg" style={{marginTop: "6em"}}>
        {state.view === "menu" && (
          <MenuComponent
            mode={state.mode}
            setMode={mode => dispatch({ type: "setMode", mode })}
            startGame={startGame}
          />
        )}
        {state.view === "question" && (
          <div style={{textAlign: "center"}}>
            <QuestionComponent
              currentQuestion={state.currentQuestion}
              answers={state.answers}
              answer={answer}
              resetQuestion={resetQuestion}
              answered={state.answered}
              mode={state.mode}
              timeLeft={timeLeft}
              totalTime={initialTime}
              onCountdownEnd={onCountdownEnd}
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
          <Button
            onClick={endGame}
            color="primary"
            autoFocus
          >
            End game
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default QuizComponent;
