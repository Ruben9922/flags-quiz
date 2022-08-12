import React from "react";
import {useImmerReducer} from "use-immer";
import * as R from "ramda";
import QuestionComponent from "./Question";
import Summary from "./Summary";
import Menu from "./Menu";
import useCountDown from "react-countdown-hook";
import {computeStreak, isAllCorrectAchievement, isStreakAtThreshold} from "../core/scoring";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
  VStack
} from "@chakra-ui/react";
import Country from "../core/country";
import Mode from "../core/mode";
import Answer, {isAnswerCorrect} from "../core/answer";
import Question from "../core/question";

interface QuizProps {
  countries: Country[];
}

type View = "menu" | "question" | "summary";

interface QuizState {
  currentQuestion: Question | null;
  answers: Answer[];
  answered: boolean;
  view: View;
  mode: Mode;
  timestamp: DOMHighResTimeStamp | null;
}

type QuizAction =
  | { type: "answer", country: Country | null }
  | { type: "resetQuestion", countries: Country[] }
  | { type: "playAgain" }
  | { type: "setMode", mode: Mode }
  | { type: "endGame" }
  | { type: "startGame", countries: Country[] };

const initialTime = 10 * 1000;
const interval = 50;

function removeCountriesWithSimilarFlags(countries: Country[], pickedCountries: Country[]): Country[] {
  // Using country codes only as these are probably more stable than country names
  const countryCodesWithSimilarFlags: string[][] = [
    [
      "RO", // Romania
      "TD", // Chad
    ],
    [
      "MC", // Monaco
      "ID", // Indonesia
    ],
    [
      "US", // United States
      "UM", // United States Minor Outlying Islands
    ],
  ];
  const pickedCountryCodes = R.map((country: Country) => country.cca2, pickedCountries);
  // List of country codes to remove - specifically countries in the same group as any picked country
  // E.g. If Romania has been picked, we want to remove Romania and Chad (but keep Monaco and Indonesia)
  const countryCodesToRemove = R.flatten(R.filter(
    (countryCodeGroup: string[]) => !R.isEmpty(R.intersection(pickedCountryCodes, countryCodeGroup)),
    countryCodesWithSimilarFlags,
  ));
  // Remove countries whose country codes are in this list
  return R.reject((country: Country) => R.includes(country.cca2, countryCodesToRemove), countries);
}

function pickCountries(countries: Country[]): Country[] {
  const count = 4;

  // If the number of countries to pick is greater than or equal to the total number of countries, then just return the
  // entire list of countries
  if (R.length(countries) <= count) {
    return countries;
  }

  let pickedCountries: Country[] = [];
  for (let i = 0; i < count; i++) {
    // Choose an element from countries list with the already picked countries removed
    // Could be made more efficient by removing by index; for this you would have to store the list of available
    // countries and remove from this each time
    let availableCountries = R.without(pickedCountries, countries);
    availableCountries = removeCountriesWithSimilarFlags(availableCountries, pickedCountries);
    const pickedCountry = chooseElement(availableCountries);
    pickedCountries = R.append(pickedCountry, pickedCountries);
  }
  return pickedCountries;
}

function chooseElement<T>(l: T[]): T {
  return l[Math.floor(Math.random() * R.length(l))];
}

const initialState: QuizState = {
  currentQuestion: null,
  answers: [],
  answered: false,
  view: "menu",
  mode: "classic",
  timestamp: null,
};

function reducer(draft: QuizState, action: QuizAction): void {
  switch (action.type) {
    case "answer": {
      if (draft.currentQuestion !== null) {
        const answer = {
          countries: draft.currentQuestion.countries,
          correctCountry: draft.currentQuestion.correctCountry,
          selectedCountry: action.country,
          timeTaken: draft.timestamp === null || action.country === null ? null : (performance.now() - draft.timestamp),
        };
        draft.answers = R.append(answer, draft.answers);

        // draft.currentQuestion = null;
        draft.answered = true;
        draft.timestamp = null;
      }

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

      if (!R.isEmpty(draft.answers) && draft.mode === "classic" && !isAnswerCorrect(R.last(draft.answers)!)) {
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

function Quiz({ countries }: QuizProps) {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [timeLeft, { start, pause }] = useCountDown(initialTime, interval);
  const toast = useToast();

  const cancelRef = React.useRef(null);

  React.useEffect(() => {
    if (!R.isEmpty(state.answers)) {
      if (isAnswerCorrect(R.last(state.answers)!)) {
        toast({
          description: "Correct!",
          status: "success",
        });

        // Snackbar for consecutive correct answers
        const streak = computeStreak(state.answers);
        if (isStreakAtThreshold(streak)) {
          setTimeout(() => toast({ description: `\u{1F389} Nice! ${streak} in a row!` }), 500);
        }
      } else {
        let message = R.last(state.answers)?.selectedCountry === null ? "Out of time!" : "Incorrect!";
        if (R.last(state.answers)?.correctCountry) {
          message += ` It's the flag of ${R.last(state.answers)?.correctCountry.name.common}.`
        }
        toast({
          description: message,
          status: "error",
        });

        // Snackbar for losing a streak
        const prevStreak = computeStreak(R.init(state.answers));
        if (prevStreak >= 3) {
          setTimeout(() => toast({ description: `\u{1F622} Awh! You just lost your streak of ${prevStreak}!` }), 500);
        }
      }
    }
  }, [state.answers, toast]);

  const displayAllCorrectSnackbar = React.useCallback(() => {
    if (isAllCorrectAchievement(state.answers)) {
      toast({ description: "\u{1F389} Awesome! You got 100%!" });
    }
  }, [state.answers, toast]);

  React.useEffect(() => {
    if (state.mode === "classic" && !R.isEmpty(state.answers) && !isAnswerCorrect(R.last(state.answers)!)) {
      setTimeout(() => toast({ description: "Game over!" }), 1500);
      setTimeout(displayAllCorrectSnackbar, 2000);
    }
  }, [state.answers, state.mode, toast, displayAllCorrectSnackbar]);

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

  const answer = (country: Country) => {
    dispatch({ type: "answer", country });
    pause();
  };

  const endGame = () => {
    setDialogOpen(false);
    dispatch({ type: "endGame" });
    toast({ description: "Game over!" });
    setTimeout(displayAllCorrectSnackbar, 500);
  };

  return (
    <>
      {state.view === "menu" && (
        <Menu
          mode={state.mode}
          setMode={(mode: Mode) => dispatch({ type: "setMode", mode })}
          startGame={startGame}
        />
      )}
      {state.view === "question" && state.currentQuestion !== null && (
        <VStack spacing={4}>
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
          <Button onClick={() => setDialogOpen(true)}>
            End game
          </Button>
        </VStack>
      )}
      {state.view === "summary" && (
        <Summary
          answers={state.answers}
          playAgain={() => { dispatch({ type: "playAgain" }); }}
          mode={state.mode}
        />
      )}

      <AlertDialog
        isOpen={dialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              End Game
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you wish to end the game?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={endGame} ml={3}>
                End game
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default Quiz;
