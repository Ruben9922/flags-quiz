import * as R from "ramda";
import humanizeDuration from "humanize-duration";

export function isAnswerCorrect(answer) {
  return answer.selectedCountry !== null && R.equals(answer.correctCountry, answer.selectedCountry);
}

export const customHumanizer = humanizeDuration.humanizer({
  maxDecimalPoints: 1,
  spacer: "",
  delimiter: " ",
  largest: 2,

  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});

