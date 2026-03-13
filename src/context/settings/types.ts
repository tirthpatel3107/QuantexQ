import { ReactNode } from "react";

export interface SettingsContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export interface SettingsProviderProps {
  children: ReactNode;
}
