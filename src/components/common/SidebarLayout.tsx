import type { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/hooks/useSidebarContext";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { CommonButton } from "./CommonButton";
import { CommonTooltip } from "./CommonTooltip";

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

const DEFAULT_SIDEBAR_WIDTH = "w-[17rem]";
const COLLAPSED_SIDEBAR_WIDTH = "w-[6rem]";
const DEFAULT_MAIN_MARGIN = "lg:ml-[260px]";
const COLLAPSED_MAIN_MARGIN = "lg:ml-[85px]";

/**
 * Layout with fixed left sidebar (hidden on small screens) and main content.
 * Used by Settings and Mud Properties.
 */
export function SidebarLayout({
  sidebar,
  sidebarFooter,
  children,
  sidebarWidth: sidebarWidthProp,
  mainMarginClass: mainMarginClassProp,
}: SidebarLayoutProps) {
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  const sidebarWidth =
    sidebarWidthProp ||
    (isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH);
  const mainMarginClass =
    mainMarginClassProp ||
    (isCollapsed ? COLLAPSED_MAIN_MARGIN : DEFAULT_MAIN_MARGIN);

  return (
    <div className="flex flex-1">
      <div
        className={cn(
          "hidden lg:block fixed left-0 top-[68px] bottom-0 z-10 p-3 transition-all duration-300 ease-in-out",
          sidebarWidth,
        )}
      >
        <aside className="dashboard-panel h-full max-h-[calc(100vh-3.5rem)] w-full border-0 shadow-none flex flex-col overflow-hidden relative group/sidebar">
          {/* Toggle Button */}
          <div
            className={cn(
              "absolute z-20 transition-all duration-300 ease-in-out",
              isCollapsed
                ? "top-[20px] left-1/2 -translate-x-1/2"
                : "top-4 right-4",
            )}
          >
            <CommonTooltip
              content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <CommonButton
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={`h-10 w-10 text-primary  ${isCollapsed ? "bg-white shadow-sm dark:bg-primary/10 " : ""}`}
              >
                {isCollapsed ? (
                  <ChevronsRight className="h-5 w-5" />
                ) : (
                  <ChevronsLeft className="h-5 w-5" />
                )}
              </CommonButton>
            </CommonTooltip>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div
              className={cn(
                "transition-all duration-300",
                isCollapsed ? "pt-[65px]" : "px-3 pt-0",
              )}
            >
              {sidebar}
            </div>
          </ScrollArea>

          {sidebarFooter != null && !isCollapsed && (
            <div className="shrink-0 px-3 pb-3 pt-2 border-t border-border animate-in fade-in duration-500">
              {sidebarFooter}
            </div>
          )}
        </aside>
      </div>
      <div
        className={cn(
          "flex-1 min-w-0 flex flex-col min-h-0 p-3 transition-all duration-300 ease-in-out",
          mainMarginClass,
        )}
      >
        {children}
      </div>
    </div>
  );
}
