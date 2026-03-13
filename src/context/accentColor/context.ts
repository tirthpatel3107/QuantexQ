import { createContext, useContext } from "react";
import type { AccentColorProviderState } from "./types";
import { initialState } from "./constants";

export const AccentColorProviderContext =
  createContext<AccentColorProviderState>(initialState);

export function useAccentColor() {
  const context = useContext(AccentColorProviderContext);
  if (context === undefined) {
    throw new Error(
      "useAccentColor must be used within an AccentColorProvider",
    );
  }
  return context;
}
