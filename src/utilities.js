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

export const formatInteger = x => x.toLocaleString(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
export const formatIntegerWithSign = x => x.toLocaleString(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  signDisplay: "always",
});
