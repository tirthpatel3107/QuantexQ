import { createContext } from "react";

export interface MudPropertiesContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export const MudPropertiesContext = createContext<
  MudPropertiesContextType | undefined
>(undefined);
