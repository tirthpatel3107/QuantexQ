import { useState } from "react";
import {
  Clock,
  Beaker,
  Layers,
  Thermometer,
  FlaskConical,
  Settings,
  FileBarChart,
  Gauge,
  Save,
  RotateCcw,
  Upload,
  Download,
  Lock,
  Check,
  FolderOpen,
  FolderPlus,
  ExternalLink,
  Menu,
} from "lucide-react";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  SearchInput,
  RestoreDefaultsButton,
  LabeledInputWithUnit,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
    oilWater: "70/30",
    salinity: "15.0",
    surfaceTemp: "85",
    bottomholeTemp: "210",
    tempGradient: "+0.62",
    // Gas / Compressibility
    gasSolubility: "",
    compressibilityFactor: "",
    gasOilRatio: "",
    // Calibration
    viscometerCalDate: "",
    densityCalDate: "",
    tempSensorOffset: "",
  });

  const headerActions = (
    <>
      <Button variant="outline" size="sm" onClick={() => setDirty(false)}>
        <Save className="h-4 w-4" />
        <span className="hidden lg:inline">Save</span>
      </Button>
      <Button variant="outline" size="sm">
        <RotateCcw className="h-4 w-4" />
        <span className="hidden lg:inline">Discard</span>
      </Button>
      <Button variant="outline" size="sm">
        <Upload className="h-4 w-4" />
        <span className="hidden lg:inline">Import</span>
      </Button>
    </>
  );

  const sidebarNav = (
    <nav className="py-4 px-3 space-y-0.5">
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
  );

  const sidebarFooter = (
    <p className="text-[11px] text-muted-foreground">
      Modified by adm.tirth | 06 Feb 2026 | 12:21
    </p>
  );

  return (
    <PageLayout>
      <SidebarLayout sidebar={sidebarNav} sidebarFooter={sidebarFooter}>
        <PageHeaderBar
          icon={<Gauge className="h-5 w-5 text-primary-foreground" />}
          title="Mud Properties"
          metadata={
            <>
              Active Well/Profile: NFQ-21-6A
              <span className="hidden md:inline"> · Mud System: OBM</span>
            </>
          }
          actions={headerActions}
          className="max-sm:mt-10"
        />

        <main className="flex-1 min-w-0 py-4 overflow-auto flex flex-col">
          <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-4 shrink-0">
            <div className="flex items-center gap-2 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                   <div className="flex flex-col h-full">
                    <SheetHeader className="p-4 border-b text-left">
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-1">
                      {sidebarNav}
                    </ScrollArea>
                    <div className="p-4 border-t">
                      {sidebarFooter}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <SearchInput
              placeholder="Search Mud Properties..."
              value={search}
              onChange={setSearch}
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4" />
                <span className="max-sm:hidden">Save</span>
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" />
                <span className="max-sm:hidden">Discard</span>
              </Button>
              <Button variant="outline" size="sm">
                <FolderOpen className="h-4 w-4" />
                <span className="max-sm:hidden">Load Preset</span>
              </Button>
              <Button variant="outline" size="sm">
                <FolderPlus className="h-4 w-4" />
                <span className="max-sm:hidden">Save Preset</span>
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                <span className="max-sm:hidden">Export</span>
              </Button>
            </div>
          </div>

            <div className="flex flex-col xl:flex-row flex-1 min-w-0 gap-4">
              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  {/* Section-specific or overview layout */}
                  {(activeSection === "overview" ||
                    activeSection === "rheology" ||
                    activeSection === "density" ||
                    activeSection === "temperature") && (
                    <div
                      className={cn(
                        "grid gap-4 mb-4",
                        activeSection === "overview"
                          ? "grid-cols-1 md:grid-cols-2"
                          : "grid-cols-1 max-w-2xl",
                      )}
                    >
                      {/* Fluid System - overview only */}
                      {activeSection === "overview" && (
                        <PanelCard title="Fluid System" headerAction={<RestoreDefaultsButton />}>
                          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Type
                              </Label>
                              <Select
                                value={fluid.type}
                                onValueChange={(v) =>
                                  setFluid((f) => ({ ...f, type: v }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OBM">OBM</SelectItem>
                                  <SelectItem value="WBM">WBM</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Base Fluid
                              </Label>
                              <Select
                                value={fluid.baseFluid}
                                onValueChange={(v) =>
                                  setFluid((f) => ({ ...f, baseFluid: v }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Diesel">Diesel</SelectItem>
                                  <SelectItem value="Synthetic">
                                    Synthetic
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Active pits volume (bbl)
                              </Label>
                              <Input
                                value={fluid.activePitsVolume}
                                onChange={(e) =>
                                  setFluid((f) => ({
                                    ...f,
                                    activePitsVolume: e.target.value,
                                  }))
                                }
                                className="h-10 text-sm pl-4"
                              />
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Flowline temperature
                              </Label>
                              <Select
                                value={fluid.flowlineTemp}
                                onValueChange={(v) =>
                                  setFluid((f) => ({ ...f, flowlineTemp: v }))
                                }
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
                        </PanelCard>
                      )}

                      {/* Rheology */}
                      {(activeSection === "overview" ||
                        activeSection === "rheology") && (
                        <PanelCard title="Rheology" headerAction={<RestoreDefaultsButton />}>
                          <div className="flex flex-row items-center justify-between gap-2 mb-5">
                            <Label
                              htmlFor="rheo-derive-viscometer"
                              className="font-semibold text-sm tracking-tight shrink-0"
                            >
                              Rheology model. Derive from viscometer
                            </Label>
                            <Switch
                              id="rheo-derive-viscometer"
                              checked={fluid.rheologySource === "viscometer"}
                              onCheckedChange={(checked) =>
                                setFluid((f) => ({
                                  ...f,
                                  rheologySource: checked
                                    ? "viscometer"
                                    : "manual",
                                }))
                              }
                            />
                          </div>

                          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                PV
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.pv}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      pv: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  cP
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                YP
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.yp}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      yp: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  lb/100ft²
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Gel 10s
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.gel10s}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      gel10s: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  lb/100ft²
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Gel 10m
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.gel10m}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      gel10m: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  lb/100ft²
                                </span>
                              </div>
                            </div>
                          </div>
                        </PanelCard>
                      )}

                      {/* Density & Solids */}
                      {(activeSection === "overview" ||
                        activeSection === "density") && (
                        <PanelCard title="Density & Solids" headerAction={<RestoreDefaultsButton />}>
                          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                PV
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.pv}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      pv: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  cP
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                YP
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.yp}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      yp: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  lb/100ft²
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Gel 10s
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.gel10s}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      gel10s: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  lb/100ft²
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Oil/Water
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-muted/30 overflow-hidden">
                                <Input
                                  value={fluid.oilWater}
                                  readOnly
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 rounded-none"
                                />
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-10 w-10 shrink-0"
                                    >
                                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Locked</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-10 w-10 shrink-0"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Open / pop-out</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Salinity
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.salinity}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      salinity: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  ppk
                                </span>
                              </div>
                            </div>
                          </div>
                        </PanelCard>
                      )}

                      {/* Temperature */}
                      {(activeSection === "overview" ||
                        activeSection === "temperature") && (
                        <PanelCard title="Temperature" headerAction={<RestoreDefaultsButton />}>
                          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center text-sm">
                                Surface temp
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.surfaceTemp}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      surfaceTemp: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  °F
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0">
                              <Label className="h-5 flex items-center gap-1.5 text-sm">
                                Bottomhole temp
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-muted/30 overflow-hidden">
                                <Input
                                  value={fluid.bottomholeTemp}
                                  readOnly
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  °F
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2 min-w-0 sm:col-span-2">
                              <Label className="h-5 flex items-center text-sm">
                                Temperature gradient
                              </Label>
                              <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                                <Input
                                  value={fluid.tempGradient}
                                  onChange={(e) =>
                                    setFluid((f) => ({
                                      ...f,
                                      tempGradient: e.target.value,
                                    }))
                                  }
                                  className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                                />
                                <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                  °F/100 ft
                                </span>
                              </div>
                            </div>
                          </div>
                        </PanelCard>
                      )}
                    </div>
                  )}

                  {/* Gas / Compressibility - dedicated section */}
                  {activeSection === "gas" && (
                    <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
                      <PanelCard
                        title="Gas / Compressibility"
                        headerAction={<RestoreDefaultsButton />}
                      >
                        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Gas solubility
                            </Label>
                            <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                              <Input
                                value={fluid.gasSolubility}
                                onChange={(e) =>
                                  setFluid((f) => ({
                                    ...f,
                                    gasSolubility: e.target.value,
                                  }))
                                }
                                placeholder="—"
                                className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                              />
                              <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                scf/bbl
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Compressibility factor
                            </Label>
                            <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                              <Input
                                value={fluid.compressibilityFactor}
                                onChange={(e) =>
                                  setFluid((f) => ({
                                    ...f,
                                    compressibilityFactor: e.target.value,
                                  }))
                                }
                                placeholder="—"
                                className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                              />
                              <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                —
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Gas/oil ratio
                            </Label>
                            <div className="flex h-10 items-center rounded-md border border-border/30 bg-accent/10 overflow-hidden focus-within:border-primary/50">
                              <Input
                                value={fluid.gasOilRatio}
                                onChange={(e) =>
                                  setFluid((f) => ({
                                    ...f,
                                    gasOilRatio: e.target.value,
                                  }))
                                }
                                placeholder="—"
                                className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                              />
                              <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
                                scf/stb
                              </span>
                            </div>
                          </div>
                        </div>
                      </PanelCard>
                    </div>
                  )}

                  {/* Calibration - dedicated section */}
                  {activeSection === "calibration" && (
                    <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
                      <PanelCard
                        title="Calibration"
                        headerAction={<RestoreDefaultsButton />}
                      >
                        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Viscometer cal. date
                            </Label>
                            <Input
                              value={fluid.viscometerCalDate}
                              onChange={(e) =>
                                setFluid((f) => ({
                                  ...f,
                                  viscometerCalDate: e.target.value,
                                }))
                              }
                              placeholder="—"
                              type="date"
                              className="h-10 bg-accent/10 border-border/30 text-left text-sm pl-4"
                            />
                          </div>
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Density cal. date
                            </Label>
                            <Input
                              value={fluid.densityCalDate}
                              onChange={(e) =>
                                setFluid((f) => ({
                                  ...f,
                                  densityCalDate: e.target.value,
                                }))
                              }
                              placeholder="—"
                              type="date"
                              className="h-10 bg-accent/10 border-border/30 text-left text-sm pl-4"
                            />
                          </div>
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Temp. sensor offset
                            </Label>
                            <Input
                              value={fluid.tempSensorOffset}
                              onChange={(e) =>
                                setFluid((f) => ({
                                  ...f,
                                  tempSensorOffset: e.target.value,
                                }))
                              }
                              placeholder="°F"
                              className="h-10 bg-accent/10 border-border/30 text-left text-sm pl-4"
                            />
                          </div>
                        </div>
                      </PanelCard>
                    </div>
                  )}

                  {/* Summary - read-only overview */}
                  {activeSection === "summary" && (
                    <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
                      <PanelCard title="Summary" className="h-auto">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Mud system
                            </span>
                            <span className="font-medium">{fluid.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Base fluid
                            </span>
                            <span className="font-medium">
                              {fluid.baseFluid}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              PV / YP
                            </span>
                            <span className="font-medium">
                              {fluid.pv} cP / {fluid.yp} lb/100ft²
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Gel 10s / 10m
                            </span>
                            <span className="font-medium">
                              {fluid.gel10s} / {fluid.gel10m} lb/100ft²
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Oil/Water
                            </span>
                            <span className="font-medium">
                              {fluid.oilWater}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Surface / BHT
                            </span>
                            <span className="font-medium">
                              {fluid.surfaceTemp} °F / {fluid.bottomholeTemp} °F
                            </span>
                          </div>
                        </div>
                      </PanelCard>
                    </div>
                  )}
                </div>
              </div>

              {/* Right sidebar - Calculated outputs & Preset summary */}
              <aside className="w-full xl:w-72 shrink-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                <PanelCard title="Calculated Outputs" className="h-auto">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Calculated ECD @ Bit
                      </span>
                      <span className="font-medium tabular-nums">
                        12.98 ppg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Annular friction loss
                      </span>
                      <span className="font-medium tabular-nums">512 psi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Pipe friction loss
                      </span>
                      <span className="font-medium tabular-nums">339 psi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Estimated BHP
                      </span>
                      <span className="font-medium tabular-nums">6194 psi</span>
                    </div>
                  </div>
                </PanelCard>
                <PanelCard title="Preset Summary" className="h-auto">
                  <div className="space-y-3 text-sm">
                    {[
                      { label: "Mud system", value: "OBM" },
                      { label: "MW in", value: "12.4 ppg" },
                      { label: "PV", value: "30 cP" },
                      { label: "Gel 10s/10m", value: "12/20" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-muted-foreground">
                          {row.label}
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium text-success">
                          <Check className="h-4 w-4" />
                          {row.value} OK
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border space-y-1">
                      {["OW range", "Rheology range", "Temp correction"].map(
                        (label) => (
                          <div
                            key={label}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="text-muted-foreground">
                              {label}
                            </span>
                            <span className="inline-flex items-center gap-1 text-success">
                              <Check className="h-4 w-4" />
                              OK
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </PanelCard>
              </aside>
            </div>
          </main>
        </SidebarLayout>
    </PageLayout>
  );
}
