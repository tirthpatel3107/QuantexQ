import {
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { MudPropertiesContext, type MudPropertiesContextType } from "./context";

export type { MudPropertiesContextType };

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
