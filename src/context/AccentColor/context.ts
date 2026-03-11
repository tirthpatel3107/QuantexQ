import { createContext } from "react";
import type { AccentColorProviderState } from "./types";
import { initialState } from "./constants";

export const AccentColorProviderContext =
  createContext<AccentColorProviderState>(initialState);
