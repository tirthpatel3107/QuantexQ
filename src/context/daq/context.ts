import { createContext, useContext } from "react";
import type { DAQContextType } from "./types";

export const DAQContext = createContext<DAQContextType | undefined>(undefined);

export function useDAQContext() {
  const context = useContext(DAQContext);
  if (context === undefined) {
    throw new Error("useDAQContext must be used within a DAQProvider");
  }
  return context;
}
