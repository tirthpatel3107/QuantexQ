import {
  useState,
  useMemo,
  useCallback,
} from "react";
import type { NetworkProviderProps } from "./types";
import { NetworkContext } from "./context";

export function NetworkProvider({ children }: NetworkProviderProps) {
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
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}


