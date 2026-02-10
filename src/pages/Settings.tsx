import { useState } from "react";
import {
  Settings as SettingsIcon,
  Layers,
  Clock,
  Radio,
  AlertTriangle,
  Network,
  Gauge,
  Monitor,
  Users,
  Info,
  Search,
  Save,
  RotateCcw,
  Download,
  ChevronDown,
  MoreHorizontal,
  GripVertical,
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  { id: "hydraulics", label: "Hydraulics Model", icon: Gauge },
  { id: "ui", label: "UI & Display", icon: Monitor },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "about", label: "About / Diagnostics", icon: Info },
];

const CATEGORY_CARDS = [
  {
    id: "units",
    title: "Units",
    description: "Unit system for depth, pressure, flow, density, temperature.",
  },
  {
    id: "data-time",
    title: "Data & Time",
    description: "Timezone, format, sampling rate, data source.",
  },
  {
    id: "ui",
    title: "UI & Display",
    description: "Themes, chart/animation style, density, layout options.",
  },
  {
    id: "signals",
    title: "Signals / Tags",
    description: "Tag mapping to WITS / EDR systems, scaling, validation status.",
  },
  {
    id: "alarms",
    title: "Alarms & Limits",
    description: "Thresholds, alarm logic, notification options for kick/loss, SPP/SPP/etc.",
  },
  {
    id: "auto-control",
    title: "Auto Display",
    description: "Choke configs, response profiles, main/aux pump logic.",
  },
  {
    id: "choke-pumps",
    title: "Chokes & Pumps",
    description: "Choke configs, response profiles.",
  },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [search, setSearch] = useState("");
  const [projectOpen, setProjectOpen] = useState(true);
  const [safetyOpen, setSafetyOpen] = useState(true);
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

      {/* Page bar */}
      <div className="fixed top-14 left-0 right-0 z-20 border-b border-border bg-card/95 backdrop-blur px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shrink-0">
              <SettingsIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-base font-bold tracking-tight">Settings</h1>
          </div>
          <span className="hidden sm:inline text-sm text-muted-foreground">|</span>
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

      <div className="flex flex-1 pt-[7rem]">
        {/* Left nav */}
        <aside className="w-56 border-r border-border bg-card/50 shrink-0 hidden lg:block">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <nav className="p-2 space-y-0.5">
              {SETTINGS_NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    activeSection === item.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="px-3 py-4 mt-4 border-t border-border text-[10px] text-muted-foreground">
              Modified by adm.tirth | 06 Feb 2026 | 12:21
            </div>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search settings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
              Discard
            </Button>
            <Button variant="outline" size="sm">
              Import
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              Restore defaults
            </Button>
          </div>

          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <SettingsIcon className="h-5 w-5" />
            General
          </h2>

          {/* Project / Well Context */}
          <Collapsible open={projectOpen} onOpenChange={setProjectOpen}>
            <Card className="mb-4">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", projectOpen && "rotate-180")}
                  />
                  <CardTitle className="text-base">Project / Well Context</CardTitle>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0 px-4 pb-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Default Well Name</Label>
                      <Input
                        value={general.defaultWellName}
                        onChange={(e) =>
                          setGeneral((g) => ({ ...g, defaultWellName: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Rig name</Label>
                      <Select
                        value={general.defaultRigName}
                        onValueChange={(v) => setGeneral((g) => ({ ...g, defaultRigName: v }))}
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
                        onValueChange={(v) => setGeneral((g) => ({ ...g, defaultScenario: v }))}
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
                    <div className="space-y-2">
                      <Label>Startup Screen</Label>
                      <Select
                        value={general.startupScreen1}
                        onValueChange={(v) =>
                          setGeneral((g) => ({ ...g, startupScreen1: v, startupScreen2: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quantum HUD">Quantum HUD</SelectItem>
                          <SelectItem value="Dashboard">Dashboard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="sm:w-48">
                    <Label>Startup Screen (secondary)</Label>
                    <Select
                      value={general.startupScreen2}
                      onValueChange={(v) => setGeneral((g) => ({ ...g, startupScreen2: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quantum HUD">Quantum HUD</SelectItem>
                        <SelectItem value="Dashboard">Dashboard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Safety */}
          <Collapsible open={safetyOpen} onOpenChange={setSafetyOpen}>
            <Card className="mb-6">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", safetyOpen && "rotate-180")}
                  />
                  <CardTitle className="text-base">Safety</CardTitle>
                </CollapsibleTrigger>
                <Button variant="ghost" size="sm">
                  Restore defaults
                </Button>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0 px-4 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="safety-confirm">Enable safety confirmations</Label>
                      <p className="text-xs text-muted-foreground">
                        Confirmations for Auto Control ON, PRC ON, Mode change, and Import settings.
                      </p>
                    </div>
                    <Switch
                      id="safety-confirm"
                      checked={safetyConfirmations}
                      onCheckedChange={setSafetyConfirmations}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Category cards grid */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {CATEGORY_CARDS.map((cat) => (
              <Card
                key={cat.id}
                className="cursor-pointer transition-colors hover:bg-accent/30 border-border/80"
                onClick={() => setActiveSection(cat.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <button
                    type="button"
                    className="p-1 rounded text-muted-foreground hover:text-foreground shrink-0"
                    aria-label="Options"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-warning/10 px-4 py-2 flex items-center gap-2 text-sm text-warning">
        <span className="inline-block w-4 h-4 rounded-full bg-warning/80 shrink-0" aria-hidden />
        Apply & Restart — Restart required to apply certain changes
      </footer>
    </div>
  );
}
