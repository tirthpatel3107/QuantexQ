import { memo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  Activity,
  Droplets,
  Network,
  ChevronDown,
  ChevronUp,
  Menu,
  Gauge,
} from "lucide-react";
import { cn } from "@/utils/lib/utils";
import { ROUTES } from "@/app/routes/routeEndpoints";
import {
  SETTINGS_NAV,
  DAQ_NAV,
  MUD_NAV,
  NETWORK_NAV,
} from "@/utils/constants";
import { useAppSidebar } from "@/context/appSidebar";
import { CommonButton, CommonTooltip } from "@/components/shared";

interface SidebarProps {
  isOpen: boolean;
}

const mainMenus = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    route: ROUTES.SETTINGS,
    submenus: SETTINGS_NAV.filter((item) => !item.isOverview),
  },
  {
    id: "daq",
    label: "DAQ",
    icon: Activity,
    route: ROUTES.DAQ,
    submenus: DAQ_NAV.filter((item) => !item.isOverview),
  },
  {
    id: "mud-properties",
    label: "Mud Properties",
    icon: Droplets,
    route: ROUTES.MUD_PROPERTIES,
    submenus: MUD_NAV.filter((item) => !item.isOverview),
  },
  {
    id: "network",
    label: "Network",
    icon: Network,
    route: ROUTES.NETWORK,
    submenus: NETWORK_NAV.filter((item) => !item.isOverview),
  },
];

export const Sidebar = memo(function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { toggle: toggleSidebar } = useAppSidebar();
  
  const currentMenu = mainMenus.find((menu) =>
    location.pathname.startsWith(menu.route),
  );
  
  const [manualExpandedMenu, setManualExpandedMenu] = useState<string | null>(
    currentMenu?.id || "settings",
  );
  
  const expandedMenu = manualExpandedMenu || currentMenu?.id || "settings";

  const toggleMenu = (menuId: string) => {
    setManualExpandedMenu((prev) => (prev === menuId ? null : menuId));
  };

  const handleMenuClick = (menuId: string) => {
    setManualExpandedMenu(menuId);
  };

  const isActiveRoute = (route: string) => {
    return location.pathname.startsWith(route);
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 z-10 p-3 transition-all duration-300 ease-in-out",
        isOpen ? "w-[300px]" : "w-0",
      )}
    >
      <aside
        className={cn(
          "dashboard-panel h-full w-full border-0 shadow-none flex flex-col overflow-hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        {/* Sidebar Header with Logo and Menu Toggle */}
        <div className="flex items-center gap-2 px-3 py-5 border-b border-border shrink-0">
          <CommonTooltip content="Toggle menu">
            <CommonButton
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
              icon={Menu}
            />
          </CommonTooltip>
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 hover:text-foreground transition-colors min-w-0 flex-1"
          >
            <div className="h-8 w-8 rounded-lg bg-white dark:bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">
                QuantexQ<span className="text-foreground/60">™</span>
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">
                Professional Drilling Monitoring
              </p>
            </div>
          </Link>
        </div>

        <div 
          className="flex-1 min-h-0 overflow-y-auto scrollbar-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          } as React.CSSProperties}
        >
          <nav className="p-3 space-y-3">
            {mainMenus.map((menu) => {
              const isExpanded = expandedMenu === menu.id;
              const isActive = isActiveRoute(menu.route);

              return (
                <div key={menu.id} className="space-y-2">
                  <Link
                    to={`${menu.route}/${menu.id}`}
                    onClick={() => handleMenuClick(menu.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-3 text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-white dark:bg-primary/20 text-primary shadow-sm dark:shadow-none hover:bg-white dark:hover:bg-primary/30"
                        : "bg-white/50 dark:bg-white/5 text-foreground hover:bg-white/80 dark:hover:bg-white/10",
                    )}
                  >
                    <menu.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{menu.label}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMenu(menu.id);
                      }}
                      className="shrink-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </Link>

                  {isExpanded && (
                    <div className="ml-4 pl-3 border-l border-primary border-opacity-20 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {menu.submenus.map((submenu) => {
                        const submenuPath = `${menu.route}/${submenu.id}`;
                        const isSubmenuActive =
                          location.pathname === submenuPath;

                        return (
                          <Link
                            key={submenu.id}
                            to={submenuPath}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-all duration-200",
                              isSubmenuActive
                                ? "bg-white dark:bg-primary/20 text-primary shadow-sm dark:shadow-none hover:bg-white dark:hover:bg-primary/30 hover:text-primary"
                                : "bg-white/50 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-white/10",
                            )}
                          >
                            <submenu.icon className="h-4 w-4 shrink-0" />
                            {submenu.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
});
