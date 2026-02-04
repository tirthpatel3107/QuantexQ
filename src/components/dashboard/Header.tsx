import { useState, useEffect } from "react";
import { Bell, Gauge, Moon, Sun, UserRound, Filter, Check, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { notifications } from "@/data/mockData";

export function Header() {
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });
  const [filters, setFilters] = useState({
    severity: "all",
    timeframe: "24h",
    system: "all",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const activeFilterCount = [
    filters.severity !== "all",
    filters.timeframe !== "24h",
    filters.system !== "all",
  ].filter(Boolean).length;

  return (
    <header className="fixed top-0 inset-x-0 z-30 min-h-14 h-auto border-b border-border bg-card px-3 sm:px-4 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      {/* Brand */}
      <Link
        to="/"
        className="flex items-center gap-3 hover:text-foreground transition-colors shrink-0 min-w-0 w-full sm:w-auto"
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

      {/* Center - Project Info */}
      <div className="hidden lg:flex items-center gap-6 text-sm min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Project:</span>
          <span className="font-medium text-foreground">Offshore Block A-7</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Well:</span>
          <span className="font-medium text-foreground">DW-0347</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <div className="status-indicator online" />
          <span className="text-success text-xs font-medium">Live</span>
        </div>
      </div>

      {/* Right - Time & Actions */}
      <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3 justify-between sm:justify-end flex-wrap">
        <div className="text-right leading-tight">
          <div className="text-base sm:text-lg font-bold tabular-nums text-primary glow-primary">
            {formatTime(time)}
          </div>
          <div className="hidden sm:block text-[10px] text-muted-foreground -mt-0.5">
            {formatDate(time)}
          </div>
        </div>

        <div className="hidden sm:block h-8 w-px bg-border" />

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="action-btn action-btn-ghost bg-accent text-foreground hover:bg-accent/80"
                aria-label="Dashboard filters"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary/20 text-primary text-[10px] px-1.5 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 space-y-1">
              <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-muted-foreground uppercase">
                Severity
              </div>
              {[
                { key: "all", label: "All" },
                { key: "normal", label: "Normal" },
                { key: "warning", label: "Warnings only" },
                { key: "critical", label: "Critical only" },
              ].map((option) => (
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
              {[
                { key: "1h", label: "Last 1 hour" },
                { key: "6h", label: "Last 6 hours" },
                { key: "24h", label: "Last 24 hours" },
                { key: "7d", label: "Last 7 days" },
              ].map((option) => (
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
              {[
                { key: "all", label: "All systems" },
                { key: "pumps", label: "Pumps" },
                { key: "circulation", label: "Circulation" },
                { key: "pressure", label: "Pressure" },
              ].map((option) => (
                <DropdownMenuItem
                  key={option.key}
                  onSelect={() => setFilters((f) => ({ ...f, system: option.key }))}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {filters.system === option.key && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}

              <div className="px-3 py-2">
                <button
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm font-medium hover:bg-secondary/60 transition-colors"
                  onClick={() =>
                    setFilters({
                      severity: "all",
                      timeframe: "24h",
                      system: "all",
                    })
                  }
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
                aria-label="Profile menu"
              >
                <UserRound className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => navigate("/profile")}
                className="cursor-pointer"
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => navigate("/")}
                className="cursor-pointer text-destructive"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
