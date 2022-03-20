import Country from "./country";

export default interface Question {
  countries: Country[];
  correctCountry: Country;
}
