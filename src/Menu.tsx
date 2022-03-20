import React from "react";
import {Button, FormControl, FormLabel, HStack, Radio, RadioGroup, Tooltip, VStack} from "@chakra-ui/react";
import Mode from "./mode";

interface MenuProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  startGame: () => void;
}

function Menu({mode, setMode, startGame}: MenuProps) {
  return (
    <VStack spacing={4}>
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
      <Button onClick={startGame}>Start game</Button>
    </VStack>
  );
}

export default Menu;
