import { useState } from "react";
import {
  Settings as SettingsIcon,
  Layers,
  Clock,
  Radio,
  AlertTriangle,
  Network,
  Gauge,
  Droplets,
  Monitor,
  Users,
  Info,
  Search,
  Save,
  RotateCcw,
  Undo2,
  Download,
  Upload,
  MoreHorizontal,
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const SETTINGS_NAV = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "units", label: "Units", icon: Layers },
  { id: "data-time", label: "Data & Time", icon: Clock },
  { id: "signals", label: "Signals / Tags", icon: Radio },
  { id: "alarms", label: "Alarms & Limits", icon: AlertTriangle },
  { id: "auto-control", label: "Auto Control", icon: Network },
  { id: "choke-pumps", label: "Choke & Pumps", icon: Gauge },
  { id: "hydraulics", label: "Hydraulics Model", icon: Droplets },
  { id: "ui", label: "UI & Display", icon: Monitor },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "about", label: "About / Diagnostics", icon: Info },
];

const CATEGORY_CARDS = [
  {
    id: "units",
    title: "Units",
    description: "Unit system for depth, pressure, flow, density, temperature.",
    icon: Layers,
  },
  {
    id: "data-time",
    title: "Data & Time",
    description: "Timezone, format, sampling rate, data source.",
    icon: Clock,
  },
  {
    id: "ui",
    title: "UI & Display",
    description: "Themes, chart/animation style, density, layout options.",
    icon: Monitor,
  },
  {
    id: "signals",
    title: "Signals / Tags",
    description:
      "Tag mapping to WITS / EDR systems, scaling, validation status.",
    icon: Radio,
  },
  {
    id: "alarms",
    title: "Alarms & Limits",
    description:
      "Thresholds, alarm logic, notification options for kick/loss, SPP/SPP/etc.",
    icon: AlertTriangle,
  },
  {
    id: "auto-control",
    title: "Auto Display",
    description: "Choke configs, response profiles, main/aux pump logic.",
    icon: Network,
  },
  {
    id: "choke-pumps",
    title: "Chokes & Pumps",
    description: "Choke configs, response profiles.",
    icon: Gauge,
  },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [search, setSearch] = useState("");
  const [general, setGeneral] = useState({
    defaultWellName: "NFQ-21-6A",
    defaultRigName: "Rig-01",
    defaultScenario: "Static",
    startupScreen1: "Quantum HUD",
    startupScreen2: "Quantum HUD",
  });
  const [safetyConfirmations, setSafetyConfirmations] = useState(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex flex-1 pt-14">
        {/* Left sidebar: fixed so it doesn't scroll; only inner content scrolls */}
        <div className="hidden lg:block fixed left-0 top-14 bottom-0 z-10 w-[16rem] p-4">
          <aside className="h-full max-h-[calc(100vh-3.5rem)] w-56 border border-border rounded-lg bg-card/50 shadow-sm flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 min-h-0">
              <nav className="py-4 px-3 space-y-0.5">
                {SETTINGS_NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      activeSection === item.id
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </ScrollArea>
            <div className="shrink-0 px-3 pb-3 pt-2 border-t border-border">
              <p className="text-[11px] text-muted-foreground">
                Modified by adm.tirth | 06 Feb 2026 | 12:21
              </p>
            </div>
          </aside>
        </div>

        {/* Right side: margin so content is not under fixed sidebar; Settings header + main content */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0 p-4 pt-4 lg:ml-[16rem]">
          {/* Settings header (normal page flow) */}
          <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shrink-0">
                  <SettingsIcon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-base font-bold tracking-tight">Setting</h1>
              </div>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                |
              </span>
              <span className="text-sm text-muted-foreground">
                Active Profile: Rig-01 / NFQ-21-6A Admin
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" />
                Discard
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0 py-4 overflow-auto">
            <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-4 shrink-0">
              <div className="relative flex-1 min-w-[200px] max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search settings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4" />
                  Discard
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>

            {/* Project / Well Context + Safety side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">
              <PanelCard title="Project / Well Context">
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Default Well Name</Label>
                      <Input
                        value={general.defaultWellName}
                        onChange={(e) =>
                          setGeneral((g) => ({
                            ...g,
                            defaultWellName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Rig name</Label>
                      <Select
                        value={general.defaultRigName}
                        onValueChange={(v) =>
                          setGeneral((g) => ({ ...g, defaultRigName: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rig-01">Rig-01</SelectItem>
                          <SelectItem value="Rig-02">Rig-02</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Default Scenario</Label>
                      <Select
                        value={general.defaultScenario}
                        onValueChange={(v) =>
                          setGeneral((g) => ({ ...g, defaultScenario: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Static">Static</SelectItem>
                          <SelectItem value="Dynamic">Dynamic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 ">
                      <Label>Startup Screen</Label>
                      <Select
                        value={general.startupScreen1}
                        onValueChange={(v) =>
                          setGeneral((g) => ({
                            ...g,
                            startupScreen1: v,
                            startupScreen2: v,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quantum HUD">
                            Quantum HUD
                          </SelectItem>
                          <SelectItem value="Dashboard">Dashboard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Startup Screen (secondary)</Label>
                      <Select
                        value={general.startupScreen2}
                        onValueChange={(v) =>
                          setGeneral((g) => ({ ...g, startupScreen2: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quantum HUD">
                            Quantum HUD
                          </SelectItem>
                          <SelectItem value="Dashboard">Dashboard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
              </PanelCard>

              {/* Safety */}
              <PanelCard
                title="Safety"
                headerAction={
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Restore defaults</p>
                    </TooltipContent>
                  </Tooltip>
                }
              >
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                      <Label htmlFor="safety-confirm">
                        Enable safety confirmations
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Confirmations for Auto Control ON, PRC ON, Mode change,
                        and Import settings.
                      </p>
                    </div>
                    <Switch
                      id="safety-confirm"
                      checked={safetyConfirmations}
                      onCheckedChange={setSafetyConfirmations}
                      className="shrink-0"
                    />
                  </div>
              </PanelCard>
            </div>

            {/* Category cards grid */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 items-start">
              {CATEGORY_CARDS.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  title={cat.title}
                  description={cat.description}
                  icon={cat.icon}
                  onClick={() => setActiveSection(cat.id)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
