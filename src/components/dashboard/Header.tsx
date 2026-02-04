import { useState, useEffect } from "react";
import { Bell, Gauge, UserRound } from "lucide-react";
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
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
