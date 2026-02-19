import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/context/SidebarContext";
import { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isOverview?: boolean;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  activeSection: string;
  baseRoute: string;
}

export function SidebarNav({
  items,
  activeSection,
  baseRoute,
}: SidebarNavProps) {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebarContext();

  return (
    <nav className={`py-3 ${isCollapsed ? "px-3" : ""} space-y-1`}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isOverview = item.isOverview;
        return (
          <div key={item.id}>
            <button
              onClick={() =>
                !["signals"].includes(item.id) &&
                navigate(`${baseRoute}/${item.id}`)
              }
              title={isCollapsed ? item.label : ""}
              className={cn(
                "w-full flex items-center gap-3 rounded-md transition-all duration-200 border-0 shadow-none text-left overflow-hidden",
                isCollapsed ? "justify-center p-0 h-10 w-10 mx-auto" : "px-3",
                isOverview
                  ? isCollapsed
                    ? "h-10 w-10"
                    : "py-3 text-base font-semibold"
                  : isCollapsed
                    ? "h-10 w-10 mb-2"
                    : "py-3 text-sm font-medium mb-2",
                isOverview
                  ? isCollapsed
                    ? isActive
                      ? "bg-white dark:bg-primary/20 text-foreground"
                      : "dark:bg-white/5 text-muted-foreground"
                    : "text-foreground"
                  : isActive
                    ? "bg-white dark:bg-primary/20 text-primary shadow-sm dark:shadow-none hover:bg-white dark:hover:bg-primary/30 hover:text-primary"
                    : "dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-white/10",
              )}
            >
              <Icon
                className={cn(
                  "shrink-0",
                  isOverview || isCollapsed ? "h-5 w-5" : "h-4 w-4",
                )}
              />
              {!isCollapsed && (
                <span className="truncate animate-in fade-in slide-in-from-left-1 duration-300">
                  {item.label}
                </span>
              )}
            </button>
            {isOverview && (
              <hr
                className={cn(
                  " border-none transition-all duration-300",
                  isCollapsed
                    ? "my-5 h-[3px] mx-auto bg-black dark:bg-border/50"
                    : "mt-1 mb-4 h-[3px] w-full bg-black/30 dark:bg-border/50",
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
