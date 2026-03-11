import { useContext } from "react";
import { DAQContext } from "./context";

export function useDAQContext() {
  const context = useContext(DAQContext);
  if (context === undefined) {
    throw new Error("useDAQContext must be used within a DAQProvider");
  }
  return context;
}
