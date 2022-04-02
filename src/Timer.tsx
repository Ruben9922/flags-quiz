import React from "react";
import {Grid, Progress, Text} from "@chakra-ui/react";
import {customHumanizer} from "./utilities";

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  onCountdownEnd: () => void;
}

function Timer({
                 timeLeft,
                 totalTime,
                 onCountdownEnd,
               }: TimerProps) {
  React.useEffect(() => {
    if (timeLeft === 0) {
      onCountdownEnd();
    }
  }, [timeLeft, onCountdownEnd]);

  return (
    <Grid templateColumns="1fr auto" alignSelf="stretch" alignItems="center" gap={4}>
      <Progress value={(totalTime - timeLeft) * (100 / totalTime)} />
      <Text>{customHumanizer(timeLeft, { maxDecimalPoints: 0 })}</Text>
    </Grid>
  );
}

export default Timer;
