import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Tooltip,
  VStack
} from "@chakra-ui/react";
import {InputMode, Mode} from "../core/options";

interface MenuProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  inputMode: InputMode;
  setInputMode: (inputMode: InputMode) => void;
  startGame: () => void;
}

function Menu({mode, setMode, inputMode, setInputMode, startGame}: MenuProps) {
  return (
    <VStack spacing={4} align="start">
      <FormControl w="auto" as="fieldset">
        <FormLabel as="legend">Game mode</FormLabel>
        <RadioGroup value={mode} onChange={setMode}>
          <HStack spacing={4}>
            <Radio value="classic">
              <Tooltip label="Game continues until an incorrect answer is selected. No time limits.">
                Classic
              </Tooltip>
            </Radio>
            <Radio value="timed">Timed</Radio>
            <Radio value="endless">Endless</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <FormControl w="auto" as="fieldset">
        <FormLabel as="legend">Input mode</FormLabel>
        <RadioGroup value={inputMode} onChange={setInputMode}>
          <HStack spacing={4}>
            <Radio value="multiple-choice">Multiple choice</Radio>
            <Radio value="text">Text</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <Button onClick={startGame} alignSelf="center">Start game</Button>
    </VStack>
  );
}

export default Menu;
