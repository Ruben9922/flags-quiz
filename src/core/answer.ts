import * as R from "ramda";
import Country from "./country";
import Options from "./options";

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
// todo: remove multiple consecutive spaces
// todo: remove non-alphanumeric characters
// todo: handle accented characters (ignore accents)
export function isAnswerCorrect(answer: Answer, options: Options): boolean {
  if (answer.answerText.answerType !== "answered") {
    return false;
  }

  if (options.inputMode === "multiple-choice") {
    return R.equals(answer.correctCountry.name.common, answer.answerText.text);
  } else {
    // Correct if answer is equal to common name, official name or an alternative spelling
    // Ignore case, and ignore leading and trailing spaces
    return R.includes(
      R.toLower(R.trim(answer.answerText.text)),
      R.map(correctAnswer => R.toLower(R.trim(correctAnswer)), [
        answer.correctCountry.name.common,
        answer.correctCountry.name.official,
        ...answer.correctCountry.altSpellings,
      ])
    );
  }
}
