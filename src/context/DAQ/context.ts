import { createContext } from "react";
import type { DAQContextType } from "./types";

export const DAQContext = createContext<DAQContextType | undefined>(undefined);