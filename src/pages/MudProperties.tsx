import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  Beaker,
  Layers,
  Thermometer,
  FlaskConical,
  Settings,
  FileBarChart,
  Gauge,
  Menu,
  Search,
  Save,
  RotateCcw,
  Upload,
  Download,
  MoreHorizontal,
  Lock,
  ChevronDown,
  Check,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MUD_NAV = [
  { id: "overview", label: "Fluid Overview", icon: Clock },
  { id: "rheology", label: "Rheology", icon: Beaker },
  { id: "density", label: "Density & Solids", icon: Layers },
  { id: "temperature", label: "Temperature", icon: Thermometer },
  { id: "gas", label: "Gas / Compressibility", icon: FlaskConical },
  { id: "calibration", label: "Calibration", icon: Settings },
  { id: "summary", label: "Summary", icon: FileBarChart },
];

export default function MudProperties() {
  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");
  const [dirty, setDirty] = useState(true);
  const [fluid, setFluid] = useState({
    type: "OBM",
    baseFluid: "Diesel",
    activePitsVolume: "600",
    flowlineTemp: "85",
    rheologySource: "viscometer",
    pv: "20",
    yp: "15",
    gel10s: "12",
    gel10m: "20",
    mwIn: "",
    oilWater: "70/30",
    salinity: "15.0",
    surfaceTemp: "85",
    bottomholeTemp: "210",
    tempGradient: "+0.62",
  });

  const openSections = { fluid: true, rheology: true, density: true, temperature: true };
  const [sectionsOpen, setSectionsOpen] = useState(openSections);

  const toggleSection = (key: keyof typeof openSections) =>
    setSectionsOpen((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Page bar: title + context + actions */}
      <div className="fixed top-14 left-0 right-0 z-20 border-b border-border bg-card/95 backdrop-blur px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-90">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shrink-0">
              <Gauge className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">
                QuantexQ<span className="text-primary">™</span> Mud Properties
              </h1>
            </div>
          </Link>
          <span className="hidden sm:inline text-sm text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">Active Well/Profile: NFQ-21-6A</span>
          <span className="hidden md:inline text-sm text-muted-foreground">Mud System: OBM</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDirty(false)}>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Load preset</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 pt-[7rem]">
        {/* Left nav */}
        <aside className="w-56 border-r border-border bg-card/50 shrink-0 hidden lg:block">
          <nav className="p-2 space-y-0.5">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Mud Properties
            </div>
            {MUD_NAV.map((item) => (
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
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 flex gap-4">
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
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
                Load Preset
              </Button>
              <Button variant="outline" size="sm">
                Save Preset
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5" />
                Fluid Overview
              </h2>

              {/* Fluid System */}
              <Collapsible open={sectionsOpen.fluid} onOpenChange={() => toggleSection("fluid")}>
                <Card className="mb-3">
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", sectionsOpen.fluid && "rotate-180")}
                      />
                      <CardTitle className="text-base">Fluid System</CardTitle>
                    </CollapsibleTrigger>
                    <Button variant="ghost" size="sm">
                      Restore defaults
                    </Button>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-4 pb-4 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={fluid.type} onValueChange={(v) => setFluid((f) => ({ ...f, type: v }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OBM">OBM</SelectItem>
                              <SelectItem value="WBM">WBM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Base Fluid</Label>
                          <Select
                            value={fluid.baseFluid}
                            onValueChange={(v) => setFluid((f) => ({ ...f, baseFluid: v }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Diesel">Diesel</SelectItem>
                              <SelectItem value="Synthetic">Synthetic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Active pits volume (bbl)</Label>
                          <Input
                            value={fluid.activePitsVolume}
                            onChange={(e) => setFluid((f) => ({ ...f, activePitsVolume: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Flowline temperature</Label>
                          <Select
                            value={fluid.flowlineTemp}
                            onValueChange={(v) => setFluid((f) => ({ ...f, flowlineTemp: v }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="85">85 °F</SelectItem>
                              <SelectItem value="90">90 °F</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Rheology */}
              <Collapsible open={sectionsOpen.rheology} onOpenChange={() => toggleSection("rheology")}>
                <Card className="mb-3">
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", sectionsOpen.rheology && "rotate-180")}
                      />
                      <CardTitle className="text-base">Rheology</CardTitle>
                    </CollapsibleTrigger>
                    <Button variant="ghost" size="sm">
                      Restore defaults
                    </Button>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-4 pb-4 space-y-3">
                      <div className="space-y-2">
                        <Label>Rheology model.</Label>
                        <RadioGroup
                          value={fluid.rheologySource}
                          onValueChange={(v) => setFluid((f) => ({ ...f, rheologySource: v }))}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="viscometer" id="rheo-visco" />
                            <Label htmlFor="rheo-visco" className="font-normal">
                              Derive from viscometer
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                          <Label>PV</Label>
                          <div className="flex gap-1">
                            <Input
                              value={fluid.pv}
                              onChange={(e) => setFluid((f) => ({ ...f, pv: e.target.value }))}
                            />
                            <span className="flex items-center text-sm text-muted-foreground">cP</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>YP</Label>
                          <div className="flex gap-1">
                            <Input
                              value={fluid.yp}
                              onChange={(e) => setFluid((f) => ({ ...f, yp: e.target.value }))}
                            />
                            <span className="flex items-center text-sm text-muted-foreground">lb/100ft²</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Gel 10s</Label>
                          <div className="flex gap-1">
                            <Input
                              value={fluid.gel10s}
                              onChange={(e) => setFluid((f) => ({ ...f, gel10s: e.target.value }))}
                            />
                            <span className="flex items-center text-sm text-muted-foreground">lb/100ft²</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Gel 10m</Label>
                          <div className="flex gap-1">
                            <Input
                              value={fluid.gel10m}
                              onChange={(e) => setFluid((f) => ({ ...f, gel10m: e.target.value }))}
                            />
                            <span className="flex items-center text-sm text-muted-foreground">lb/100ft²</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Density & Solids */}
              <Collapsible open={sectionsOpen.density} onOpenChange={() => toggleSection("density")}>
                <Card className="mb-3">
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", sectionsOpen.density && "rotate-180")}
                      />
                      <CardTitle className="text-base">Density & Solids</CardTitle>
                    </CollapsibleTrigger>
                    <Button variant="ghost" size="sm">
                      Restore defaults
                    </Button>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-4 pb-4 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1">
                            MW In
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </Label>
                          <div className="flex gap-1">
                            <Input value={fluid.mwIn} placeholder="—" className="flex-1" />
                            <span className="flex items-center text-sm text-muted-foreground">ppg/SG</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1">
                            Oil/Water
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </Label>
                          <Input value={fluid.oilWater} readOnly className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Salinity</Label>
                          <div className="flex gap-1">
                            <Input
                              value={fluid.salinity}
                              onChange={(e) => setFluid((f) => ({ ...f, salinity: e.target.value }))}
                            />
                            <span className="flex items-center text-sm text-muted-foreground">ppk</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Temperature */}
              <Collapsible open={sectionsOpen.temperature} onOpenChange={() => toggleSection("temperature")}>
                <Card className="mb-3">
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          sectionsOpen.temperature && "rotate-180"
                        )}
                      />
                      <CardTitle className="text-base">Temperature</CardTitle>
                    </CollapsibleTrigger>
                    <Button variant="ghost" size="sm">
                      Restore defaults
                    </Button>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-4 pb-4 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Surface temp</Label>
                          <Input
                            value={fluid.surfaceTemp}
                            onChange={(e) => setFluid((f) => ({ ...f, surfaceTemp: e.target.value }))}
                          />
                          <span className="text-xs text-muted-foreground">°F</span>
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1">
                            Bottomhole temp
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </Label>
                          <Input value={fluid.bottomholeTemp} readOnly className="bg-muted/50" />
                          <span className="text-xs text-muted-foreground">°F</span>
                        </div>
                        <div className="space-y-2">
                          <Label>Temperature gradient</Label>
                          <Input
                            value={fluid.tempGradient}
                            onChange={(e) => setFluid((f) => ({ ...f, tempGradient: e.target.value }))}
                          />
                          <span className="text-xs text-muted-foreground">°F/100 ft</span>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          </div>

          {/* Right sidebar - Calculated outputs & Preset summary */}
          <aside className="w-72 shrink-0 hidden xl:block space-y-4">
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Calculated Outputs</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calculated ECD @ Bit</span>
                  <span className="font-medium tabular-nums">12.98 ppg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annular friction loss</span>
                  <span className="font-medium tabular-nums">512 psi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pipe friction loss</span>
                  <span className="font-medium tabular-nums">339 psi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated BHP</span>
                  <span className="font-medium tabular-nums">6194 psi</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Preset Summary</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2 text-sm">
                {[
                  { label: "Mud system", value: "OBM" },
                  { label: "MW in", value: "12.4 ppg" },
                  { label: "PV", value: "30 cP" },
                  { label: "Gel 10s/10m", value: "12/20" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="inline-flex items-center gap-1 font-medium text-success">
                      <Check className="h-4 w-4" />
                      {row.value} OK
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border space-y-1">
                  {["OW range", "Rheology range", "Temp correction"].map((label) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="inline-flex items-center gap-1 text-success">
                        <Check className="h-4 w-4" />
                        OK
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Modified by adm.tirth | 06 Feb 2026 | 12:24</span>
        {dirty && (
          <span className="inline-flex items-center gap-1 text-warning">
            <span className="inline-block w-3 h-3 rounded-full bg-warning/80" aria-hidden />
            Unsaved changes: Last modified at 12:24
          </span>
        )}
      </footer>
    </div>
  );
}
