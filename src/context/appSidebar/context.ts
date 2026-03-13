import { createContext, useContext } from "react";

export interface AppSidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const AppSidebarContext = createContext<
  AppSidebarContextType | undefined
>(undefined);

export const useAppSidebar = () => {
  const context = useContext(AppSidebarContext);
  if (!context) {
    throw new Error("useAppSidebar must be used within AppSidebarProvider");
  }
  return context;
};
