import { useContext } from "react";
import { AccentColorProviderContext } from "./accent-color-context";

export function useAccentColor() {
  const context = useContext(AccentColorProviderContext);
  if (context === undefined) {
    throw new Error(
      "useAccentColor must be used within an AccentColorProvider",
    );
  }
  return context;
}
