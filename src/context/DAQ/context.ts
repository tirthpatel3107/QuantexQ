import { createContext } from "react";

export interface DAQContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export const DAQContext = createContext<DAQContextType | undefined>(undefined);
