import { useContext } from "react";
import { NetworkContext } from "./context";

export function useNetworkContext() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetworkContext must be used within a NetworkProvider");
  }
  return context;
}
