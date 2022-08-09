import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  Text,
  VStack
} from "@chakra-ui/react";
import {customHumanizer, formatInteger} from "../core/utilities";
import ReactCountryFlag from "react-country-flag";
import React from "react";
import Answer, {isAnswerCorrect} from "../core/answer";
import {computeBaseScore} from "../core/scoring";
import Mode from "../core/mode";

interface AnswersAccordionProps {
  answers: Answer[];
  mode: Mode;
}

function AnswersAccordion({answers, mode}: AnswersAccordionProps) {
  return (
    <Accordion allowMultiple>
      {answers.map((answer, index) => (
        <AccordionItem key={index}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text>Question {index + 1}</Text>
              </Box>
              <Box flex="1" textAlign="left">
                <Text>{isAnswerCorrect(answer) ? "Correct \u2705" : "Incorrect \u274C"}</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Grid templateColumns="auto 1fr 1fr" gap={10} alignItems="center">
              <ReactCountryFlag
                countryCode={answer.correctCountry.alpha2Code}
                style={{
                  fontSize: "6em",
                  gridColumn: 1,
                }}
              />
              <VStack alignItems="start" spacing={0}>
                  {isAnswerCorrect(answer) ? (
                    <Text>
                      {answer.correctCountry.name}
                    </Text>
                  ) : (
                    <>
                      <Text>
                        {answer.correctCountry.name} &mdash; correct answer
                      </Text>
                      <Text>
                        {answer.selectedCountry === null
                          ? "Out of time"
                          : `${answer.selectedCountry.name} — selected answer`}
                      </Text>
                    </>
                  )}
              </VStack>
              <VStack alignItems="start" spacing={0}>
                <Text>
                  <span role="img" aria-label="time">⏳</span> {answer.timeTaken === null ? "—" : customHumanizer(answer.timeTaken)}
                </Text>
                <Text>
                  <span role="img" aria-label="score">📊</span> {formatInteger(computeBaseScore(answer, mode))}
                </Text>
              </VStack>
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default AnswersAccordion;
