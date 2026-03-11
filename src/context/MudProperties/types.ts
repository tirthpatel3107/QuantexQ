import { ReactNode } from "react";

export interface MudPropertiesContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export interface MudPropertiesProviderProps {
  children: ReactNode;
}