import React from "react";
import {Box, LinearProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

function Timer({
  timeLeft,
  totalTime,
  onCountdownEnd,
}) {
  React.useEffect(() => {
    if (timeLeft === 0) {
      onCountdownEnd();
    }
  }, [timeLeft, onCountdownEnd]);

  return (
    <Box display="flex" alignItems="center" style={{ marginBottom: "20px" }}>
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={(totalTime - timeLeft) * (100 / totalTime)} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${timeLeft / 1000}s`}</Typography>
      </Box>
    </Box>
  );
}

export default Timer;
