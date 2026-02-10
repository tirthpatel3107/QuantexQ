import {
  Settings,
  Network,
  Wrench,
  Info,
  Plus,
  Sliders,
  ChevronDown,
  Gauge,
  LayoutDashboard,
  BarChart3,
  X,
  Droplets,
  Cog,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useState } from "react";
import { cn } from "@/lib/utils";

interface SideDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuSections = [
  {
    id: "monitoring",
    label: "Monitoring",
    icon: LayoutDashboard,
    items: [
      { label: "Dashboard", to: "/", icon: Gauge },
      { label: "Well Info", to: "#", icon: Info },
      { label: "Charts & KPIs", to: "#", icon: BarChart3 },
    ],
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: Settings,
    items: [
      { label: "Mud Properties", to: "/mud-properties", icon: Droplets },
      { label: "Settings", to: "/settings", icon: Cog },
      { label: "Network", to: "#", icon: Network },
      { label: "Valve Config", to: "#", icon: Sliders },
    ],
  },
  {
    id: "equipment",
    label: "Equipment",
    icon: Wrench,
    items: [
      { label: "Equipment", to: "#", icon: Wrench },
      { label: "Create New", to: "#", icon: Plus },
    ],
  },
];

export const SideDrawer = memo(function SideDrawer({ open, onOpenChange }: SideDrawerProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    monitoring: true,
    configuration: true,
    equipment: false,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        hideClose
        className="w-[90vw] max-w-[320px] sm:max-w-[280px] p-0 flex flex-col"
      >
        <SheetHeader className="px-4 py-3 border-b border-border text-left shrink-0">
          <SheetTitle className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shrink-0">
              <Gauge className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold flex-1">QuantexQ</span>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 disabled:pointer-events-none p-1.5 -m-1.5">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 custom-scrollbar">
          <nav className="p-3 space-y-1">
            {menuSections.map((section) => (
              <Collapsible
                key={section.id}
                open={openSections[section.id]}
                onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, [section.id]: open }))}
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    "text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  )}
                >
                  <section.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-left">{section.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      openSections[section.id] && "rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-4 mt-1 pl-3 border-l border-border space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs",
                          "text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5 shrink-0" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
});
