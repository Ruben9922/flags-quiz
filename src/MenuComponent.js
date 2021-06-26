import React from "react";
import {FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Tooltip} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  textWithIcon: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

function MenuComponent({
  mode,
  setMode,
  startGame,
}) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
    >
      <Grid item>
        <FormControl component="fieldset">
          <FormLabel component="legend">Game mode</FormLabel>
          <RadioGroup aria-label="game mode" name="mode" value={mode} onChange={event => setMode(event.target.value)}>
            <FormControlLabel value="classic" control={<Radio />} label={
              <div className={classes.textWithIcon}>
                Classic
                &thinsp;
                <Tooltip
                  arrow
                  placement="right"
                  title="Game continues until an incorrect answer is selected. No time limits."
                >
                  <HelpIcon color="primary" />
                </Tooltip>
              </div>
            } />
            <FormControlLabel value="timed" control={<Radio />} label="Timed" />
            <FormControlLabel value="endless" control={<Radio />} label="Endless" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={startGame} style={{ marginTop: "20px" }}>
          Start game
        </Button>
      </Grid>
    </Grid>
  );
}

export default MenuComponent;
