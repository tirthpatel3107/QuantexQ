import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

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
  if (!context) {
    throw new Error(
      "useMudPropertiesContext must be used within MudPropertiesProvider",
    );
  }
  return context;
}
