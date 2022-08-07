import * as R from "ramda";
import Country from "./country";

// TODO: Change this so the question is part of the answer
export default interface Answer {
  countries: Country[];
  correctCountry: Country;
  selectedCountry: Country | null;
  timeTaken: DOMHighResTimeStamp | null;
}

export function isAnswerCorrect(answer: Answer): boolean {
  return answer.selectedCountry !== null && R.equals(answer.correctCountry, answer.selectedCountry);
}
