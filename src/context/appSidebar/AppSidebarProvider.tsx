import { ReactNode, useState, useCallback, useMemo } from "react";
import { AppSidebarContext, AppSidebarContextType } from "./context";

interface AppSidebarProviderProps {
  children: ReactNode;
}

export function AppSidebarProvider({ children }: AppSidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo<AppSidebarContextType>(
    () => ({
      isOpen,
      toggle,
      open,
      close,
    }),
    [isOpen, toggle, open, close],
  );

  return (
    <AppSidebarContext.Provider value={value}>
      {children}
    </AppSidebarContext.Provider>
  );
}
