export default interface Options {
  mode: Mode;
  inputMode: InputMode;
}

export type Mode = "classic" | "timed" | "endless";
export type InputMode = "multiple-choice" | "text";
