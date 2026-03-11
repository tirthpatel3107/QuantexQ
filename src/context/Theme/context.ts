import { createContext } from "react";
import type { ThemeProviderState } from "./types";
import { initialState } from "./constants";

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);
