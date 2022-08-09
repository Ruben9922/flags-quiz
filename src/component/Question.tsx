import React from "react";
import ReactCountryFlag from "react-country-flag";
import * as R from "ramda";
import Timer from "./Timer";
import {Button, SimpleGrid, Text} from "@chakra-ui/react";
import Answer from "../core/answer";
import QuestionType from "../core/question";
import Mode from "../core/mode";
import Country from "../core/country";
import {computeScores} from "../core/scoring";
import {formatInteger} from "../core/utilities";

interface QuestionProps {
  answers: Answer[];
  currentQuestion: QuestionType;
  answered: boolean;
  answer: (country: Country) => void;
  resetQuestion: () => void;
  mode: Mode;
  timeLeft: number;
  totalTime: number;
  onCountdownEnd: () => void;
}

function computeButtonColor(answered: boolean, country: Country, correctCountry: Country, selectedCountry: Country | null): "blue" | "green" | "red" | "gray" {
  if (answered && country === correctCountry && selectedCountry === null) {
    return "blue";
  }
  if (answered && country === correctCountry) {
    return "green";
  }
  if (answered && country === selectedCountry) {
    return "red";
  }
  return "gray";
}

function Question({
                    answers,
                    currentQuestion,
                    answered,
                    answer,
                    resetQuestion,
                    mode,
                    timeLeft,
                    totalTime,
                    onCountdownEnd,
                  }: QuestionProps) {
  const handleClick = (country: Country) => {
    answer(country);
    setTimeout(resetQuestion, 1500);
  };

  return (
    <>
      {mode === "timed" && (
        <Timer
          timeLeft={timeLeft}
          totalTime={totalTime}
          onCountdownEnd={onCountdownEnd}
        />
      )}
      <Text>
        Score: {formatInteger(computeScores(answers, mode).totalScore)}
      </Text>
      <ReactCountryFlag
        countryCode={currentQuestion.correctCountry.alpha2Code}
        svg
        style={{
          width: '10em',
          height: '10em',
        }}
      />
      <SimpleGrid
        columns={[1, null, 2]}
        spacing={2}
      >
        {currentQuestion.countries.map((country, index) => (
          <Button
            key={index}
            size="lg"
            disabled={answered}
            onClick={() => handleClick(country)}
            width="250px"
            minHeight="80px"
            height="auto"
            whiteSpace="normal"
            paddingY={4}
            colorScheme={computeButtonColor(answered, country, currentQuestion.correctCountry, R.last(answers)?.selectedCountry ?? null)}
          >
            {country.name}
          </Button>
        ))}
      </SimpleGrid>
    </>
  );
}

export default Question;
