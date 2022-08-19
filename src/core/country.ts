export default interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  altSpellings: string[];
  flags: { svg: string };
}
