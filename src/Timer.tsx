import React from "react";
import {Progress, Text} from "@chakra-ui/react";

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
    <>
      <Progress value={(totalTime - timeLeft) * (100 / totalTime)} width="100%" />
      <Text>{`${timeLeft / 1000}s`}</Text>
    </>
  );
}

export default Timer;
