import * as R from "ramda";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ExpandedIndex,
  Grid,
  HStack,
  Image,
  Text,
  VStack
} from "@chakra-ui/react";
import {customHumanizer, formatInteger} from "../core/utilities";
import React, {useState} from "react";
import Answer, {isAnswerCorrect} from "../core/answer";
import {computeBaseScore} from "../core/scoring";
import Options from "../core/options";

interface AnswersAccordionProps {
  answers: Answer[];
  options: Options;
}

function AnswersAccordion({answers, options}: AnswersAccordionProps) {
  const [expandedIndices, setExpandedIndices] = useState<ExpandedIndex>([]);

  return (
    <VStack align="stretch" spacing={4}>
      <HStack spacing={2} justify="right">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setExpandedIndices(R.range(0, R.length(answers)))}
          isDisabled={Array.isArray(expandedIndices) && R.length(expandedIndices) === R.length(answers)}
        >
          Expand all
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setExpandedIndices([])}
          isDisabled={R.isEmpty(expandedIndices)}
        >
          Collapse all
        </Button>
      </HStack>
      <Accordion
        allowMultiple
        index={expandedIndices}
        onChange={(expandedIndices) => setExpandedIndices(expandedIndices)}
      >
        {answers.map((answer, index) => (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text>Question {index + 1}</Text>
                </Box>
                <Box flex="1" textAlign="left">
                  <Text>
                    {isAnswerCorrect(answer, options) && (
                      <>Correct <span role="img" aria-label="check">✅</span></>
                    )}
                    {answer.answerText.answerType === "answered" && !isAnswerCorrect(answer, options) && (
                      <>Incorrect <span role="img" aria-label="cross">❌</span></>
                    )}
                    {answer.answerText.answerType === "don't-know" && (
                      <>Didn't know <span role="img" aria-label="cross">❌</span></>
                    )}
                    {answer.answerText.answerType === "out-of-time" && (
                      <>Out of time <span role="img" aria-label="cross">❌</span></>
                    )}
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Grid templateColumns="auto 1fr 1fr" gap={10} alignItems="center">
                <Image
                  src={answer.correctCountry.flags.svg}
                  htmlWidth="100"
                  htmlHeight="80"
                  fallbackSrc="https://via.placeholder.com/100x80"
                  height="80px"
                  fit="contain"
                  alt="Flag"
                  marginY="5px"
                />
                <VStack alignItems="start" spacing={0}>
                    {isAnswerCorrect(answer, options) ? (
                      <Text>
                        {answer.correctCountry.name.common}
                      </Text>
                    ) : (
                      <>
                        <Text>
                          {answer.correctCountry.name.common} &mdash; correct answer
                        </Text>
                        {answer.answerText.answerType === "answered" && (
                          <Text>
                            {options.inputMode === "multiple-choice"
                              ? <>{answer.answerText.text} — selected answer</>
                              : <><em>{answer.answerText.text}</em> — entered answer</>}
                          </Text>
                        )}
                      </>
                    )}
                </VStack>
                <VStack alignItems="start" spacing={0}>
                  <Text>
                    <span role="img" aria-label="time">⏳</span> {answer.timeTaken === null ? "—" : customHumanizer(answer.timeTaken)}
                  </Text>
                  <Text>
                    <span role="img" aria-label="score">📊</span> {formatInteger(computeBaseScore(answer, options))}
                  </Text>
                </VStack>
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  )
}

export default AnswersAccordion;
