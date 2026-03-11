import {
  useState,
  useMemo,
  useCallback,
  ReactNode,
  createContext,
  useContext,
} from "react";

export interface DAQContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export const DAQContext = createContext<DAQContextType | undefined>(undefined);

export function DAQProvider({ children }: { children: ReactNode }) {
  const [saveHandler, setSaveHandler] = useState<(() => void) | null>(null);

  const registerSaveHandler = useCallback((handler: () => void) => {
    setSaveHandler(() => handler);
  }, []);

  const unregisterSaveHandler = useCallback(() => {
    setSaveHandler(null);
  }, []);

  const requestSave = useCallback(() => {
    if (saveHandler) {
      saveHandler();
    }
  }, [saveHandler]);

  const value = useMemo(
    () => ({ requestSave, registerSaveHandler, unregisterSaveHandler }),
    [requestSave, registerSaveHandler, unregisterSaveHandler],
  );

  return <DAQContext.Provider value={value}>{children}</DAQContext.Provider>;
}

export function useDAQContext() {
  const context = useContext(DAQContext);
  if (context === undefined) {
    throw new Error("useDAQContext must be used within a DAQProvider");
  }
  return context;
}
