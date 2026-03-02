import { createContext } from "react";

export interface SettingsContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);
