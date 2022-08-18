import * as R from "ramda";
import Country from "./country";
import {InputMode} from "./utilities";

// TODO: Change this so the question is part of the answer
export default interface Answer {
  countries: Country[];
  correctCountry: Country;
  answerText: AnswerText;
  timeTaken: DOMHighResTimeStamp | null;
}

export type AnswerText =
  | { answerType: "answered", text: string }
  | { answerType: "don't-know" }
  | { answerType: "out-of-time" };

// todo: answer correct by looking up in similar flags list
// todo: check against official names / other names, not just common name
export function isAnswerCorrect(answer: Answer, inputMode: InputMode): boolean {
  if (answer.answerText.answerType !== "answered") {
    return false;
  }

  if (inputMode === "multiple-choice") {
    return R.equals(answer.correctCountry.name.common, answer.answerText.text);
  } else {
    return R.equals(
      R.toLower(R.trim(answer.correctCountry.name.common)),
      R.toLower(R.trim(answer.answerText.text)),
    );
  }
}
