import { useState, useMemo, useCallback } from "react";
import type { MudPropertiesProviderProps } from "./types";
import { MudPropertiesContext } from "./context";

export function MudPropertiesProvider({
  children,
}: MudPropertiesProviderProps) {
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
