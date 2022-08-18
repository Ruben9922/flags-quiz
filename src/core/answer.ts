import * as R from "ramda";
import Country from "./country";
import {InputMode} from "./utilities";

// TODO: Change this so the question is part of the answer
export default interface Answer {
  countries: Country[];
  correctCountry: Country;
  answerText: string | null;
  timeTaken: DOMHighResTimeStamp | null;
}

// todo: answer correct by looking up in similar flags list
// todo: check against official names / other names, not just common name
export function isAnswerCorrect(answer: Answer, inputMode: InputMode): boolean {
  if (inputMode === "multiple-choice") {
    return answer.answerText !== null && R.equals(answer.correctCountry.name.common, answer.answerText);
  } else {
    return answer.answerText !== null && R.equals(
      R.toLower(R.trim(answer.correctCountry.name.common)),
      R.toLower(R.trim(answer.answerText)),
    );
  }
}
