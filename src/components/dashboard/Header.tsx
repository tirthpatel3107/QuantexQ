import { useState, useEffect, useCallback } from "react";
import { Bell, Gauge, Menu, Moon, Sun, Settings, Filter, Check, SlidersHorizontal, Square, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SideDrawer } from "@/components/dashboard/SideDrawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { notifications } from "@/data/mockData";
import { useSimulation } from "@/hooks/useSimulation";
import { SimulationTimerWidget } from "@/components/dashboard/SimulationTimerWidget";
import { useTheme } from "@/components/theme-provider";

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const SEVERITY_OPTIONS = [
  { key: "all", label: "All" },
  { key: "normal", label: "Normal" },
  { key: "warning", label: "Warnings only" },
  { key: "critical", label: "Critical only" },
] as const;

const TIMEFRAME_OPTIONS = [
  { key: "1h", label: "Last 1 hour" },
  { key: "6h", label: "Last 6 hours" },
  { key: "24h", label: "Last 24 hours" },
  { key: "7d", label: "Last 7 days" },
] as const;

const SYSTEM_OPTIONS = [
  { key: "all", label: "All systems" },
  { key: "pumps", label: "Pumps" },
  { key: "circulation", label: "Circulation" },
  { key: "pressure", label: "Pressure" },
] as const;

const INITIAL_FILTERS = { severity: "all", timeframe: "24h", system: "all" };

export function Header() {
  const [time, setTime] = useState(() => new Date());
  const { isRunning, setRunning } = useSimulation();
  const { theme, setTheme } = useTheme();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stopConfirmOpen, setStopConfirmOpen] = useState(false);
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <header className="fixed top-0 inset-x-0 z-30 min-h-14 h-auto border-b border-border bg-card px-3 sm:px-4 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <SideDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      {/* Hamburger + Brand */}
      <div className="flex items-center gap-2 shrink-0 min-w-0 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-3 hover:text-foreground transition-colors min-w-0"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center">
              <Gauge className="h-5 w-5 text-primary-foreground" />
            </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">
              QuantexQ<span className="text-primary">™</span>
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
              Professional Drilling Monitoring
            </p>
          </div>
        </div>
        </Link>
      </div>

      {/* Center - Project Info */}
      <div className="hidden lg:flex items-center gap-3 text-sm min-w-0">
        <div className="flex items-center gap-1">
          {/* <span className="text-muted-foreground">Project:</span> */}
          <span className="font-medium text-foreground">Offshore Block A-7</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          {/* <span className="text-muted-foreground">Well:</span> */}
          <span className="font-medium text-foreground">DW-0347</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <div className="status-indicator online" />
          <span className="text-success text-xs font-medium">Live</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <div className="status-indicator online" />
          <span className="text-success text-xs font-medium">System Hydraulics</span>
        </div>
      </div>

      {/* Right - Time & Actions */}
      <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3 justify-between sm:justify-end flex-wrap">
        {/* Status - top right */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="action-btn action-btn-ghost bg-accent text-foreground hover:bg-accent/80 inline-flex items-center gap-2"
              aria-label="Operational status"
            >
              <div className="status-indicator online" />
              <span className="hidden sm:inline text-xs font-medium">Status</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-0">
            <div className="px-3 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
              Operational Status
            </div>
            <div className="p-2 space-y-1">
              {operationalStatus.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent/50 text-xs"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span
                    className={cn(
                      "font-medium tabular-nums",
                      item.status === "warning" && "text-warning",
                      item.status === "critical" && "text-destructive",
                      (!item.status || item.status === "normal") && "text-foreground"
                    )}
                  >
                    {item.value}
                    {item.unit && (
                      <span className="text-muted-foreground ml-1">{item.unit}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden sm:block h-8 w-px bg-border" /> */}

        <div className="text-right leading-tight">
          <div className="text-base sm:text-lg font-bold tabular-nums text-primary glow-primary">
            {formatTime(time)}
          </div>
          <div className="hidden sm:block text-[10px] text-muted-foreground -mt-0.5">
            {formatDate(time)}
          </div>
        </div>

        <div className="hidden sm:block h-8 w-px bg-border" />

        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              type="button"
              onClick={() => setStartConfirmOpen(true)}
              className="action-btn action-btn-primary inline-flex items-center gap-2"
              aria-label="Start operation"
            >
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Start</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStopConfirmOpen(true)}
              className="action-btn action-btn-danger inline-flex items-center gap-2"
              aria-label="Stop operation"
            >
              <Square className="h-4 w-4" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}
          <div className="hidden sm:block h-8 w-px bg-border" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="action-btn action-btn-ghost bg-accent text-foreground hover:bg-accent/80"
                aria-label="Dashboard filters"
              >
                <Filter className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-0 flex flex-col max-h-[min(70vh,320px)]">
              <ScrollArea className="h-[220px] shrink-0">
                <div className="p-2 space-y-1">
                  <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-muted-foreground uppercase">
                    Severity
                  </div>
                  {SEVERITY_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.key}
                      onSelect={() => setFilters((f) => ({ ...f, severity: option.key }))}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {filters.severity === option.key && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}

                  <div className="px-3 pt-3 pb-1 text-[11px] font-semibold text-muted-foreground uppercase">
                    Timeframe
                  </div>
                  {TIMEFRAME_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.key}
                      onSelect={() => setFilters((f) => ({ ...f, timeframe: option.key }))}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {filters.timeframe === option.key && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}

                  <div className="px-3 pt-3 pb-1 text-[11px] font-semibold text-muted-foreground uppercase">
                    System
                  </div>
                  {SYSTEM_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.key}
                      onSelect={() => setFilters((f) => ({ ...f, system: option.key }))}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {filters.system === option.key && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </div>
              </ScrollArea>
              <div className="px-3 py-2 border-t border-border shrink-0 bg-card">
                <button
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm font-medium hover:bg-secondary/60 transition-colors"
                  onClick={() => setFilters(INITIAL_FILTERS)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Reset filters
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            className="action-btn action-btn-ghost bg-accent text-foreground hover:bg-accent/80"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                className="action-btn action-btn-ghost relative bg-accent text-foreground hover:bg-accent/80"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-destructive text-[9px] font-bold flex items-center justify-center text-destructive-foreground shadow-sm">
                  {notifications.length}
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90vw] max-w-[360px] sm:max-w-[420px] p-0">
              <SheetHeader className="px-4 py-3 border-b border-border text-left">
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full max-h-[calc(100vh-56px)] custom-scrollbar">
                <div className="divide-y divide-border/50">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="notification-item animate-none"
                    >
                      <div
                        className={cn(
                          "shrink-0 mt-0.5",
                          notification.type === "info" && "text-info",
                          notification.type === "success" && "text-success",
                          notification.type === "warning" && "text-warning",
                          notification.type === "error" && "text-destructive"
                        )}
                      >
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            {notification.timestamp}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-medium px-1.5 py-0.5 rounded",
                              notification.type === "info" && "bg-info/10 text-info",
                              notification.type === "success" && "bg-success/10 text-success",
                              notification.type === "warning" && "bg-warning/10 text-warning",
                              notification.type === "error" && "bg-destructive/10 text-destructive"
                            )}
                          >
                            {notification.category}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="action-btn action-btn-ghost bg-accent text-foreground hover:bg-accent/80"
                aria-label="Settings menu"
              >
                <Settings className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => navigate(ROUTES.PROFILE)}
                className="cursor-pointer"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => navigate(ROUTES.HOME)}
                className="cursor-pointer text-destructive"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SimulationTimerWidget useOwnStopDialog={false} onStopClick={() => setStopConfirmOpen(true)} />

      <AlertDialog open={stopConfirmOpen} onOpenChange={setStopConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop operation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop? This will halt the current operation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setRunning(false);
                setStopConfirmOpen(false);
              }}
            >
              Stop
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={startConfirmOpen} onOpenChange={setStartConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start operation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start? This will begin the operation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRunning(true);
                setStartConfirmOpen(false);
              }}
            >
              Start
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
