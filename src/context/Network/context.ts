import { createContext } from "react";

export interface NetworkContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);
