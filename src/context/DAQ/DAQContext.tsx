import { createContext, useContext, useState, ReactNode } from "react";

interface DAQContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

const DAQContext = createContext<DAQContextType | undefined>(undefined);

export function DAQProvider({ children }: { children: ReactNode }) {
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
    <DAQContext.Provider
      value={{ requestSave, registerSaveHandler, unregisterSaveHandler }}
    >
      {children}
    </DAQContext.Provider>
  );
}

export function useDAQContext() {
  const context = useContext(DAQContext);
  if (!context) {
    throw new Error("useDAQContext must be used within DAQProvider");
  }
  return context;
}
