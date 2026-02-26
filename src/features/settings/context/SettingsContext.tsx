import { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
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
    <SettingsContext.Provider
      value={{ requestSave, registerSaveHandler, unregisterSaveHandler }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within SettingsProvider");
  }
  return context;
}
