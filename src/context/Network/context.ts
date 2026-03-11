import { createContext, useContext } from "react";
import type { NetworkContextType } from "./types";

export const NetworkContext = createContext<NetworkContextType | undefined>(
  undefined,
);

export function useNetworkContext() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetworkContext must be used within a NetworkProvider");
  }
  return context;
}
