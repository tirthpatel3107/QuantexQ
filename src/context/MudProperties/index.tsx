import {
  useState,
  useMemo,
  useCallback,
  ReactNode,
  createContext,
  useContext,
} from "react";

export interface MudPropertiesContextType {
  requestSave: () => void;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
}

export const MudPropertiesContext = createContext<
  MudPropertiesContextType | undefined
>(undefined);

export function MudPropertiesProvider({ children }: { children: ReactNode }) {
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

  return (
    <MudPropertiesContext.Provider value={value}>
      {children}
    </MudPropertiesContext.Provider>
  );
}

export function useMudPropertiesContext() {
  const context = useContext(MudPropertiesContext);
  if (context === undefined) {
    throw new Error(
      "useMudPropertiesContext must be used within a MudPropertiesProvider",
    );
  }
  return context;
}
