import { ReactNode } from "react";

export interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
}

export interface SidebarProviderProps {
  children: ReactNode;
}