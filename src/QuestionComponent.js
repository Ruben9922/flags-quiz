import Typography from "@material-ui/core/Typography";
import ReactCountryFlag from "react-country-flag";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import React from "react";
import * as R from "ramda";
import TimerComponent from "./TimerComponent";
import {isAnswerCorrect} from "./utilities";

function QuestionComponent({
  answers,
  currentQuestion,
  answered,
  answer,
  resetQuestion,
  mode,
  timeLeft,
  totalTime,
  onCountdownEnd,
}) {
  const handleClick = country => {
    answer(country);
    setTimeout(resetQuestion, 1500);
  };

  return (
    <>
      {mode === "timed" && (
        <TimerComponent
          timeLeft={timeLeft}
          totalTime={totalTime}
          onCountdownEnd={onCountdownEnd}
        />
      )}
      <Typography paragraph>
        Score: {R.length(R.filter(isAnswerCorrect, answers))}/{R.length(answers)}
      </Typography>
      <ReactCountryFlag
        countryCode={currentQuestion.correctCountry.alpha2Code}
        svg
        style={{
          width: '10em',
          height: '10em',
        }}
      />
      <Grid
        container
        spacing={2}
        justify="center"
        alignItems="baseline"
      >
        {currentQuestion.countries.map((country, index) => (
          <Grid item key={index}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={answered}
              onClick={() => handleClick(country)}
              style={{width: "250px", minHeight: "80px"}}
            >
              {country.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default QuestionComponent;
