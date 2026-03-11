import { ReactNode } from "react";

export interface DAQContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export interface DAQProviderProps {
  children: ReactNode;
}