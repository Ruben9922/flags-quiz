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
import {FlexibleWidthXYPlot, HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, YAxis} from "react-vis";
import '../node_modules/react-vis/dist/style.css';
import {customHumanizer, isAnswerCorrect} from "./utilities";
import TimerIcon from '@material-ui/icons/Timer';

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

  const maxStreak = R.reduce(({ maxStreak, currentStreak }, value) => {
    const newCurrentStreak = isAnswerCorrect(value) ? currentStreak + 1 : 0;
    const newMaxStreak = R.max(maxStreak, newCurrentStreak);

    return {
      maxStreak: newMaxStreak,
      currentStreak: newCurrentStreak,
    };
  }, {
    maxStreak: 0,
    currentStreak: 0,
  }, answers).maxStreak;

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
            <Grid container spacing={3} justify="center">
              <Grid item xs={6} sm={5} md={4} lg={3} style={{ marginBottom: "25px" }}>
                <Card style={{ textAlign: "center" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Score
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {R.length(R.filter(isAnswerCorrect, answers))}/{R.length(answers)} ({(R.length(R.filter(isAnswerCorrect, answers))/R.length(answers)).toLocaleString(undefined,{ style: 'percent' })})
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={5} md={4} lg={3} style={{ marginBottom: "25px" }}>
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
              </Grid>
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
