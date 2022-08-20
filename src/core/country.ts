import * as R from "ramda";

export default interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  altSpellings: string[];
  flags: { svg: string };
}

const countryCodesWithSimilarFlags: string[][] = [
  [
    "RO", // Romania
    "TD", // Chad
  ],
  [
    "MC", // Monaco
    "ID", // Indonesia
  ],
  [
    "US", // United States
    "UM", // United States Minor Outlying Islands
  ],
  [
    "FR", // France
    "MF", // Saint Martin
  ],
  // todo: add australia/nz and its overseas territories
  // todo: other french overseas territories
];

export function getCountryCodesWithSimilarFlagsForCountries(countryCodes: string[]): string[] {
  return R.flatten(R.filter(
    (countryCodeGroup: string[]) => !R.isEmpty(R.intersection(countryCodes, countryCodeGroup)),
    countryCodesWithSimilarFlags,
  ))
}
