import { createContext } from "react";
import type {
  SimulationStateContextValue,
  SimulationDataContextValue,
} from "./types";

export const SimulationStateContext =
  createContext<SimulationStateContextValue | null>(null);
export const SimulationDataContext =
  createContext<SimulationDataContextValue | null>(null);
