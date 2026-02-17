import type { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface SidebarLayoutProps {
  /** Sidebar content (nav list). */
  sidebar: ReactNode;
  /** Footer inside sidebar (e.g. "Modified by ..."). */
  sidebarFooter?: ReactNode;
  /** Main content area. */
  children: ReactNode;
  /** Width class for sidebar container (default w-[16rem]). */
  sidebarWidth?: string;
  /** Margin class for main when sidebar is visible (default lg:ml-[16rem]). */
  mainMarginClass?: string;
}

const DEFAULT_SIDEBAR_WIDTH = "w-[16rem]";
const DEFAULT_MAIN_MARGIN = "lg:ml-[16rem]";

/**
 * Layout with fixed left sidebar (hidden on small screens) and main content.
 * Used by Settings and Mud Properties.
 */
export function SidebarLayout({
  sidebar,
  sidebarFooter,
  children,
  sidebarWidth = DEFAULT_SIDEBAR_WIDTH,
  mainMarginClass = DEFAULT_MAIN_MARGIN,
}: SidebarLayoutProps) {
  return (
    <div className="flex flex-1 pt-14">
      <div
        className={cn(
          "hidden lg:block fixed left-0 top-14 bottom-0 z-10 p-4",
          sidebarWidth,
        )}
      >
        <aside className="h-full max-h-[calc(100vh-3.5rem)] w-56 border border-border rounded-lg bg-card/50 shadow-sm flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 min-h-0">{sidebar}</ScrollArea>
          {sidebarFooter != null && (
            <div className="shrink-0 px-3 pb-3 pt-2 border-t border-border">
              {sidebarFooter}
            </div>
          )}
        </aside>
      </div>
      <div
        className={cn(
          "flex-1 min-w-0 flex flex-col min-h-0 p-4 pt-4",
          mainMarginClass,
        )}
      >
        {children}
      </div>
    </div>
  );
}
