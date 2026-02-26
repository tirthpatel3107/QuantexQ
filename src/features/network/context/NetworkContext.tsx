import { createContext, useContext, useState, ReactNode } from "react";

interface NetworkContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [saveHandler, setSaveHandler] = useState<(() => void) | null>(null);

  const registerSaveHandler = (handler: () => void) => {
    setSaveHandler(() => handler);
  };

  const unregisterSaveHandler = () => {
    setSaveHandler(null);
  };

  const requestSave = () => {
    if (saveHandler) {
      saveHandler();
    }
  };

  return (
    <NetworkContext.Provider
      value={{ requestSave, registerSaveHandler, unregisterSaveHandler }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetworkContext must be used within NetworkProvider");
  }
  return context;
}
