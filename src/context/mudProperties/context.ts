import { createContext, useContext } from "react";
import type { MudPropertiesContextType } from "./types";

export const MudPropertiesContext = createContext<
  MudPropertiesContextType | undefined
>(undefined);

export function useMudPropertiesContext() {
  const context = useContext(MudPropertiesContext);
  if (context === undefined) {
    throw new Error(
      "useMudPropertiesContext must be used within a MudPropertiesProvider",
    );
  }
  return context;
}
