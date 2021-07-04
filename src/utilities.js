import * as R from "ramda";

export function isAnswerCorrect(answer) {
  return answer.selectedCountry !== null && R.equals(answer.correctCountry, answer.selectedCountry);
}
