import { createContext } from "react";
import type { NetworkContextType } from "./types";

export const NetworkContext = createContext<NetworkContextType | undefined>(
  undefined,
);