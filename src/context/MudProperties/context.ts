import { createContext } from "react";
import type { MudPropertiesContextType } from "./types";

export const MudPropertiesContext = createContext<
  MudPropertiesContextType | undefined
>(undefined);
