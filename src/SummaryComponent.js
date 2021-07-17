import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactCountryFlag from "react-country-flag";
import Grid from "@material-ui/core/Grid";
import emojiSupport from "detect-emoji-support";
import * as R from "ramda";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import EmptyStreetSplash from "./undraw_empty_street_sfxm.svg";
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  LineMarkSeries,
  LineSeries,
  VerticalGridLines,
  XAxis,
  YAxis
} from "react-vis";
import '../node_modules/react-vis/dist/style.css';
import {customHumanizer, formatInteger, formatIntegerWithSign, isAnswerCorrect} from "./utilities";
import TimerIcon from '@material-ui/icons/Timer';
import {
  computeTotalBaseScore,
  computeTotalStreakScore,
  computeStreaks,
  computeAllCorrectAchievementBonus
} from "./scoring";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  textWithIcon: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

function SummaryComponent({answers}) {
  const classes = useStyles();

  const cumulativeScoreChartData = R.addIndex(R.map)(
    (value, index) => ({ x: index, y: value }),
    R.reduce(
      (acc, value) => R.append(
        (R.isEmpty(acc) ? 0 : R.last(acc)) + (isAnswerCorrect(value) ? 1 : 0),
        acc
      ),
      [0],
      answers
    )
  );

  const timeTakenChartData = R.addIndex(R.map)(
    (answer, index) => ({
      x: index + 1,
      y: answer.timeTaken === null ? null : (answer.timeTaken / 1000),
      color: isAnswerCorrect(answer),
    }),
    answers
  );

  const correctAnswersTimeTaken = R.map(answer => answer.timeTaken, R.filter(answer => isAnswerCorrect(answer), answers));
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

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        Summary
      </Typography>
        {R.isEmpty(answers) ? (
          <>
            <Typography>
              No answers to show.
            </Typography>
            <Grid container style={{marginTop: "2.5em", marginBottom: "1em"}} justify="center" spacing={3}>
              <Grid item xs={8} sm={6} md={4} style={{ textAlign: "center" }}>
                <img
                  src={EmptyStreetSplash}
                  alt="Empty street splash"
                  style={{ width: "100%" }}
                />
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Grid container spacing={3} justify="center" style={{ marginBottom: "25px" }}>
              <Grid item>
                <Card style={{ textAlign: "center" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Score
                    </Typography>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {formatInteger(totalScore)}
                    </Typography>
                    <table style={{ maxWidth: "100%", minWidth: "250px", marginLeft: "auto", marginRight: "auto" , paddingLeft: "10px", paddingRight: "10px" }}>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: "left" }} color="textSecondary">
                            <Typography color="textSecondary">
                              Base score
                            </Typography>
                          </td>
                          <td style={{ textAlign: "right" }} color="textSecondary">
                            <Typography color="textSecondary">
                              {formatInteger(totalBaseScore)}
                            </Typography>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: "left" }} color="textSecondary">
                            <Typography color="textSecondary">
                              Streak bonus
                            </Typography>
                          </td>
                          <td style={{ textAlign: "right" }} color="textSecondary">
                            <Typography color="textSecondary">
                              {formatIntegerWithSign(totalStreakScore)}
                            </Typography>
                          </td>
                        </tr>
                        {allCorrectAchievementBonus > 0 && (
                          <tr>
                            <td style={{ textAlign: "left" }} color="textSecondary">
                              <Typography color="textSecondary">
                                100% correct bonus
                              </Typography>
                            </td>
                            <td style={{ textAlign: "right" }} color="textSecondary">
                              <Typography color="textSecondary">
                                {formatIntegerWithSign(allCorrectAchievementBonus)}
                              </Typography>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid container spacing={3} justify="center" style={{ marginBottom: "25px" }}>
              <Grid item xs={6} sm={5} md={4} lg={3}>
                <Card style={{ textAlign: "center" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Correct answers
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {R.length(R.filter(isAnswerCorrect, answers))}/{R.length(answers)} ({(R.length(R.filter(isAnswerCorrect, answers))/R.length(answers)).toLocaleString(undefined,{ style: 'percent' })})
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={5} md={4} lg={3}>
                <Card style={{ textAlign: "center" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Longest streak
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {maxStreak}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={5} md={4} lg={3}>
                <Card style={{ textAlign: "center" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Fastest correct answer
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {minTimeTaken === null ? "—" : customHumanizer(minTimeTaken)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={5} md={4} lg={3}>
                <Card style={{ textAlign: "center" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Average time per correct answer
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {averageTimeTaken === null ? "—" : customHumanizer(averageTimeTaken)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            {/*<Typography variant="caption">*/}
            {/*  Note that only correct answers are included in the times shown.*/}
            {/*</Typography>*/}
            <Grid container spacing={3} justify="center">
              <Grid item xs={12} sm={8} md={6} lg={5}>
                <Card style={{ marginBottom: "25px" }}>
                  <CardContent style={{ paddingTop: "12px", paddingRight: "12px", paddingBottom: "4px", paddingLeft: "4px" }}>
                    <FlexibleWidthXYPlot height={300}>
                      <VerticalGridLines />
                      <HorizontalGridLines />
                      <XAxis title="Question" tickFormat={x => x >= 0 && Math.round(x) === x ? x : ""} />
                      <YAxis title="Number of correct answers" tickFormat={x => x >= 0 && Math.round(x) === x ? x : ""} />
                      <LineSeries data={cumulativeScoreChartData} />
                    </FlexibleWidthXYPlot>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={8} md={6} lg={5}>
                <Card style={{ marginBottom: "25px" }}>
                  <CardContent style={{ paddingTop: "12px", paddingRight: "12px", paddingBottom: "4px", paddingLeft: "4px" }}>
                    <FlexibleWidthXYPlot
                      height={300}
                      colorType="category"
                      colorDomain={[true, false]}
                      colorRange={["green", "red"]}
                    >
                      <VerticalGridLines />
                      <HorizontalGridLines />
                      <XAxis title="Question #" tickFormat={x => x >= 1 && Math.round(x) === x ? x : ""} />
                      <YAxis title="Time taken (s)" />
                      <LineMarkSeries data={timeTakenChartData} getNull={v => v.y !== null} />
                    </FlexibleWidthXYPlot>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <div className={classes.root}>
              {answers.map((answer, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>Question {index + 1}</Typography>
                    <Typography className={classes.secondaryHeading}>{isAnswerCorrect(answer) ? "Correct \u2705" : "Incorrect \u274C"}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container direction="row" spacing={3} alignItems="center">
                      <Grid item md={2}>
                        <ReactCountryFlag
                          countryCode={answer.correctCountry.alpha2Code}
                          svg={!emojiSupport()}
                          style={{
                            fontSize: "6em",
                          }}
                        />
                      </Grid>
                      <Grid item md>
                        <p>
                          {isAnswerCorrect(answer) ? (
                            <>
                                {answer.correctCountry.name}
                            </>
                          ) : (
                            <>
                                {answer.correctCountry.name} &mdash; correct answer
                                <br/>
                                {answer.selectedCountry === null
                                  ? "Out of time"
                                  : `${answer.selectedCountry.name} — selected answer`}
                            </>
                          )}
                        </p>
                      </Grid>
                      <Grid item md={2}>
                        <p>
                          <div className={classes.textWithIcon}>
                            <TimerIcon/>
                            &thinsp;
                            {answer.timeTaken === null ? "—" : customHumanizer(answer.timeTaken)}
                          </div>
                        </p>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </>
        )}
    </>
  );
}

export default SummaryComponent;
