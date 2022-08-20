import humanizeDuration from "humanize-duration";
import * as R from "ramda";

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

export const formatInteger = (x: number): string => x.toLocaleString(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
export const formatIntegerWithSign = (x: number): string => x.toLocaleString(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  signDisplay: "always",
});

export function collapseSpaces(string: string): string {
  return R.pipe(
    R.split(" "),
    R.filter(token => token !== ""),
    R.join(" "),
  )(string);
}
