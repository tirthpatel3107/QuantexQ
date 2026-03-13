import { createContext, useContext } from "react";
import type { SidebarContextType } from "./types";

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined,
);

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}
