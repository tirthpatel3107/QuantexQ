import {
  useState,
  useMemo,
  useCallback,
} from "react";
import type { SettingsProviderProps } from "./types";
import { SettingsContext } from "./context";

export function SettingsProvider({ children }: SettingsProviderProps) {
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
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}


