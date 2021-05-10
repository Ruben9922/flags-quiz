import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {isAnswerCorrect} from "./QuizComponent";
import ReactCountryFlag from "react-country-flag";
import Grid from "@material-ui/core/Grid";
import emojiSupport from "detect-emoji-support";

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
}));

function SummaryComponent({answers}) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        Summary
      </Typography>
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
              {isAnswerCorrect(answer) ? (
                <Grid item md>
                  <p>
                    {answer.correctCountry.name}
                  </p>
                </Grid>
              ) : (
                <Grid item md>
                  <p>
                    {answer.correctCountry.name} &mdash; correct answer
                    <br/>
                    {answer.selectedCountry.name} &mdash; selected answer
                  </p>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      </div>
    </>
  );
}

export default SummaryComponent;
