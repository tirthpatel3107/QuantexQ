import { createContext, useContext, useState, ReactNode } from "react";

interface MudPropertiesContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

const MudPropertiesContext = createContext<
  MudPropertiesContextType | undefined
>(undefined);

export function MudPropertiesProvider({ children }: { children: ReactNode }) {
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
    <MudPropertiesContext.Provider
      value={{ requestSave, registerSaveHandler, unregisterSaveHandler }}
    >
      {children}
    </MudPropertiesContext.Provider>
  );
}

export function useMudPropertiesContext() {
  const context = useContext(MudPropertiesContext);
  if (!context) {
    throw new Error(
      "useMudPropertiesContext must be used within MudPropertiesProvider",
    );
  }
  return context;
}
