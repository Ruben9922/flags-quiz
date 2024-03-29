import React, {useState} from "react";
import * as R from "ramda";
import Timer from "./Timer";
import {Button, HStack, IconButton, Image, Input, SimpleGrid, Text} from "@chakra-ui/react";
import Answer, {AnswerText} from "../core/answer";
import QuestionType from "../core/question";
import Options from "../core/options";
import Country from "../core/country";
import {computeScores} from "../core/scoring";
import {formatInteger} from "../core/utilities";
import {CheckIcon} from "@chakra-ui/icons";

interface QuestionProps {
  answers: Answer[];
  currentQuestion: QuestionType;
  answered: boolean;
  answer: (answerText: AnswerText) => void;
  resetQuestion: () => void;
  options: Options;
  timeLeft: number;
  totalTime: number;
  onCountdownEnd: () => void;
  countries: Country[];
}

function computeButtonColor(answered: boolean, country: Country, correctCountry: Country, answerText: AnswerText | undefined): "blue" | "green" | "red" | "gray" {
  // todo: use R.equals instead of ===
  // todo: use isAnswerCorrect
  if (answered && country === correctCountry && answerText?.answerType !== "answered") {
    return "blue";
  }
  if (answered && country === correctCountry) {
    return "green";
  }
  if (answered && answerText?.answerType === "answered" && country.name.common === answerText.text) {
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
                    options,
                    timeLeft,
                    totalTime,
                    onCountdownEnd,
                    countries,
                  }: QuestionProps) {
  const [answerText, setAnswerText] = useState("");
  const handleClick = (answerText: AnswerText) => {
    answer(answerText);
    setTimeout(() => {
      setAnswerText("");
      resetQuestion();
    }, 1500);
  };

  return (
    <>
      {options.mode === "timed" && (
        <Timer
          timeLeft={timeLeft}
          totalTime={totalTime}
          onCountdownEnd={onCountdownEnd}
        />
      )}
      <Text>
        Score: {formatInteger(computeScores(answers, options, countries).totalScore)}
      </Text>
      <Image
        src={currentQuestion.correctCountry.flags.svg}
        htmlWidth="160"
        htmlHeight="160"
        fallbackSrc="https://via.placeholder.com/160"
        height="160px"
        fit="contain"
        alt="Flag"
      />
      {options.inputMode === "multiple-choice" ? (
        <SimpleGrid
          columns={[1, null, 2]}
          spacing={2}
        >
          {currentQuestion.countries.map((country, index) => (
            <Button
              key={index}
              size="lg"
              disabled={answered}
              onClick={() => handleClick({ answerType: "answered", text: country.name.common })}
              width="250px"
              minHeight="80px"
              height="auto"
              whiteSpace="normal"
              paddingY={4}
              colorScheme={computeButtonColor(answered, country, currentQuestion.correctCountry, R.last(answers)?.answerText)}
            >
              {country.name.common}
            </Button>
          ))}
        </SimpleGrid>
      ) : (
        <HStack spacing={2}>
          {/* todo: disable autocorrect / spellcheck  */}
          {/* todo: focus answer input */}
          <Input
            value={answerText}
            onChange={event => setAnswerText(event.target.value)}
            onKeyDown={event => {
              if (!R.isEmpty(R.trim(answerText)) && event.key === "Enter") {
                handleClick({ answerType: "answered", text: answerText });
              }
            }}
            placeholder="Answer"
            disabled={answered}
            flex={1}
          />
          <IconButton
            aria-label="Submit answer"
            icon={<CheckIcon />}
            colorScheme="green"
            onClick={() => handleClick({ answerType: "answered", text: answerText })}
            disabled={R.isEmpty(R.trim(answerText)) || answered}
          />
          <Button onClick={() => handleClick({ answerType: "don't-know" })}>
            Don't know
          </Button>
        </HStack>
      )}
    </>
  );
}

export default Question;
