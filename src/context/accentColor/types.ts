export type AccentColor =
  | "white"
  | "blue"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "cyan";

export type AccentColorProviderState = {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
};
