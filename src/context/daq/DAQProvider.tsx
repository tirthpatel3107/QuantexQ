import { useState, useMemo, useCallback } from "react";
import type { DAQProviderProps } from "./types";
import { DAQContext } from "./context";

export function DAQProvider({ children }: DAQProviderProps) {
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
