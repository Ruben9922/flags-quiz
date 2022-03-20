import React from "react";
import * as R from "ramda";
import EmptyStreetSplash from "./undraw_empty_street_sfxm.svg";
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  LineMarkSeries,
  LineMarkSeriesPoint,
  LineSeries,
  VerticalGridLines,
  XAxis,
  YAxis
} from "react-vis";
import '../node_modules/react-vis/dist/style.css';
import {customHumanizer, formatInteger, formatIntegerWithSign, isAnswerCorrect} from "./utilities";
import {
  computeAllCorrectAchievementBonus,
  computeStreaks,
  computeTotalBaseScore,
  computeTotalStreakScore
} from "./scoring";
import {Button, Grid, Heading, Image, SimpleGrid, Text, useColorModeValue, VStack} from "@chakra-ui/react";
import Answer from "./answer";
import AnswersAccordion from "./AnswersAccordion";
import Paper from "./Paper";
import theme from "./theme";

interface SummaryProps {
  answers: Answer[];
  playAgain: () => void;
}

function Summary({answers, playAgain}: SummaryProps) {
  type CumulativeScoreChartData = { x: number, y: number };
  const cumulativeScoreChartData = R.addIndex<number, CumulativeScoreChartData>(R.map)(
    (value, index) => ({ x: index, y: value }),
    R.reduce<Answer, number[]>(
      (acc, value) => R.append(
        (R.isEmpty(acc) ? 0 : R.last(acc)!) + (isAnswerCorrect(value) ? 1 : 0),
        acc
      ),
      [0],
      answers
    )
  );

  type TimeTakenChartData = { x: number, y: number | null, color: boolean };
  const timeTakenChartData = R.addIndex<Answer, TimeTakenChartData>(R.map)(
    (answer, index) => ({
      x: index + 1,
      y: answer.timeTaken === null ? null : (answer.timeTaken / 1000),
      color: isAnswerCorrect(answer),
    }),
    answers
  );

  const correctAnswersTimeTaken = R.map((answer: Answer) => answer.timeTaken!, R.filter(answer => isAnswerCorrect(answer) && answer.timeTaken !== null, answers));
  const streaks = computeStreaks(answers);

  // Calculate score
  // Base score is a score for answering a question, based on the time taken
  const totalBaseScore = computeTotalBaseScore(correctAnswersTimeTaken);
  const totalStreakScore = computeTotalStreakScore(streaks);
  const allCorrectAchievementBonus = computeAllCorrectAchievementBonus(answers);
  const totalScore = totalBaseScore + totalStreakScore + allCorrectAchievementBonus;

  const maxStreak = R.apply(Math.max, streaks);
  const minTimeTaken = R.isEmpty(correctAnswersTimeTaken) ? null : R.apply(Math.min, correctAnswersTimeTaken);
  const averageTimeTaken = R.isEmpty(correctAnswersTimeTaken) ? null : R.mean(correctAnswersTimeTaken);

  const StatisticCard = ({label, value}: {label: string, value: string | number}) => (
    <Paper>
      <VStack justifyContent="center" height="100%" spacing={0} textAlign="center">
        <Text>
          {label}
        </Text>
        <Text fontSize="2xl">
          {value}
        </Text>
      </VStack>
    </Paper>
  );

  const chartColor = useColorModeValue(theme.colors.gray["800"], theme.colors.whiteAlpha["900"]);
  const gridLinesStyle = {stroke: chartColor, opacity: 0.1, strokeDasharray: "1 1"};
  const chartAxisStyle = {fill: chartColor, color: chartColor};

  return (
    <VStack alignItems="stretch" spacing={8}>
      <Heading as="h1" size="lg">
        Game Over!
      </Heading>
      {R.isEmpty(answers) ? (
        <>
          <Text>
            No answers to show.
          </Text>
          {/*<Grid container style={{marginTop: "2.5em", marginBottom: "1em"}} justify="center" spacing={3}>*/}
          {/*  <Grid item xs={8} sm={6} md={4} style={{ textAlign: "center" }}>*/}
              <Image
                src={EmptyStreetSplash}
                alt="Empty street splash"
                htmlWidth="400px"
                alignSelf="center"
              />
          {/*  </Grid>*/}
          {/*</Grid>*/}
        </>
      ) : (
        <>
          <VStack spacing={8} alignItems="stretch">
            <Paper alignSelf="center" px={6}>
              <VStack spacing={2}>
                <VStack spacing={0} textAlign="center">
                  <Text>
                    Score
                  </Text>
                  <Text fontSize="3xl">
                    {formatInteger(totalScore)}
                  </Text>
                </VStack>
                <Grid minWidth="200px">
                  <Text textAlign="left" gridColumn={1} gridRow={1}>
                    Base score
                  </Text>
                  <Text textAlign="right" gridColumn={2} gridRow={1}>
                    {formatInteger(totalBaseScore)}
                  </Text>
                  <Text textAlign="left" gridColumn={1} gridRow={2}>
                    Streak bonus
                  </Text>
                  <Text textAlign="right" gridColumn={2} gridRow={2}>
                    {formatIntegerWithSign(totalStreakScore)}
                  </Text>
                  {allCorrectAchievementBonus > 0 && (
                    <>
                      <Text textAlign="left" gridColumn={1} gridRow={3}>
                        100% correct bonus
                      </Text>
                      <Text textAlign="right" gridColumn={2} gridRow={3}>
                        {formatIntegerWithSign(allCorrectAchievementBonus)}
                      </Text>
                    </>
                  )}
                </Grid>
              </VStack>
            </Paper>
            <SimpleGrid spacing={4} columns={[1, 2, 4]}>
              <StatisticCard
                label="Correct answers"
                value={`${R.length(R.filter(isAnswerCorrect, answers))}/${R.length(answers)} (${(R.length(R.filter(isAnswerCorrect, answers))/R.length(answers)).toLocaleString(undefined,{ style: 'percent' })})`}
              />
              <StatisticCard
                label="Longest streak"
                value={maxStreak}
              />
              <StatisticCard
                label="Fastest correct answer"
                value={minTimeTaken === null ? "—" : customHumanizer(minTimeTaken)}
              />
              <StatisticCard
                label="Average time per correct answer"
                value={averageTimeTaken === null ? "—" : customHumanizer(averageTimeTaken)}
              />
            </SimpleGrid>
            {/*<Typography variant="caption">*/}
            {/*  Note that only correct answers are included in the times shown.*/}
            {/*</Typography>*/}
            <SimpleGrid columns={[1, 2]} alignContent="center" spacing={4}>
              <Paper pt={3} pr={3} pb={1} pl={1}>
                <FlexibleWidthXYPlot height={200}>
                  <VerticalGridLines style={gridLinesStyle} />
                  <HorizontalGridLines style={gridLinesStyle} />
                  <XAxis title="Question" tickFormat={x => x >= 0 && Math.round(x) === x ? x : ""} style={chartAxisStyle} />
                  <YAxis title="Number of correct answers" tickFormat={x => x >= 0 && Math.round(x) === x ? x : ""} style={chartAxisStyle} />
                  <LineSeries data={cumulativeScoreChartData} />
                </FlexibleWidthXYPlot>
              </Paper>
              <Paper pt={3} pr={3} pb={1} pl={1}>
                <FlexibleWidthXYPlot
                  height={200}
                  colorType="category"
                  colorDomain={[true, false]}
                  colorRange={["green", "red"]}
                >
                  <VerticalGridLines style={gridLinesStyle} />
                  <HorizontalGridLines style={gridLinesStyle} />
                  <XAxis title="Question #" tickFormat={x => x >= 1 && Math.round(x) === x ? x : ""} style={chartAxisStyle} />
                  <YAxis title="Time taken (s)" style={chartAxisStyle} />
                  <LineMarkSeries data={timeTakenChartData as unknown as LineMarkSeriesPoint[]} getNull={v => v.y !== null} />
                </FlexibleWidthXYPlot>
              </Paper>

              {/*<Paper pt={3} pr={3} pb={1} pl={1}>*/}
              {/*  <ResponsiveContainer>*/}
              {/*    <LineChart data={cumulativeScoreChartData}>*/}
              {/*      <Line type="monotone" dataKey="y" strokeWidth={2} />*/}
              {/*      /!*<CartesianGrid stroke="gray" opacity={0.5} strokeDasharray="5 5" />*!/*/}
              {/*      <XAxis label="" dataKey="x" />*/}
              {/*      <YAxis label="" scale="linear" />*/}
              {/*      <Tooltip />*/}
              {/*    </LineChart>*/}
              {/*  </ResponsiveContainer>*/}
              {/*</Paper>*/}
            </SimpleGrid>
            <AnswersAccordion answers={answers} />
          </VStack>
        </>
      )}
      <Button alignSelf="center" onClick={playAgain}>
        Play again
      </Button>
    </VStack>
  );
}

export default Summary;
