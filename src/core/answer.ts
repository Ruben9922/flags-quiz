import * as R from "ramda";
import Country, {getCountryCodesWithSimilarFlagsForCountries} from "./country";
import Options from "./options";
import {collapseSpaces} from "./utilities";

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

// todo: remove non-alphanumeric characters
// todo: handle accented characters (ignore accents)
export function isAnswerCorrect(answer: Answer, options: Options, countries: Country[]): boolean {
  if (answer.answerText.answerType !== "answered") {
    return false;
  }

  if (options.inputMode === "multiple-choice") {
    return R.equals(answer.correctCountry.name.common, answer.answerText.text);
  } else {
    const countryCodesWithSimilarFlags = getCountryCodesWithSimilarFlagsForCountries([answer.correctCountry.cca2]);
    const countriesWithSimilarFlags = R.innerJoin(
      (country, countryCode) => country.cca2 === countryCode,
      countries,
      countryCodesWithSimilarFlags,
    );
    const correctCountries = [
      answer.correctCountry,
      ...countriesWithSimilarFlags,
    ];
    const correctNames = R.chain(country => [
      country.name.common,
      country.name.official,
      ...country.altSpellings,
    ], correctCountries);

    // Correct if answer is equal to common name, official name or an alternative spelling
    // Ignore case, and ignore leading and trailing spaces
    return R.includes(
      R.toLower(collapseSpaces(answer.answerText.text)),
      R.map(correctAnswer => R.toLower(collapseSpaces(correctAnswer)), correctNames)
    );
  }
}
