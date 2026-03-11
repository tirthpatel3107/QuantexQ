import { createContext, useContext } from "react";
import type { SettingsContextType } from "./types";

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSettingsContext must be used within a SettingsProvider",
    );
  }
  return context;
}
