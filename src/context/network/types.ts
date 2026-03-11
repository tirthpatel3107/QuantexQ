import { ReactNode } from "react";

export interface NetworkContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export interface NetworkProviderProps {
  children: ReactNode;
}
