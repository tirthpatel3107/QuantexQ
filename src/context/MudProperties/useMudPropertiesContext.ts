import { useContext } from "react";
import { MudPropertiesContext } from "./context";

export function useMudPropertiesContext() {
  const context = useContext(MudPropertiesContext);
  if (context === undefined) {
    throw new Error("useMudPropertiesContext must be used within a MudPropertiesProvider");
  }
  return context;
}
