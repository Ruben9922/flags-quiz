// TODO: Change this so the question is part of the answer
import Country from "./country";

export default interface Answer {
  countries: Country[];
  correctCountry: Country;
  selectedCountry: Country | null;
  timeTaken: DOMHighResTimeStamp | null;
}
