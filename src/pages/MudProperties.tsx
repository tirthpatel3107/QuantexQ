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
  Timer,
  Droplets,
  FolderPlus,
  Ruler,
  ExternalLink,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  SearchInput,
  RestoreDefaultsButton,
  LabeledInputWithUnit,
  CommonButton,
  CommonSelect,
  CommonInput,
} from "@/components/common";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const MUD_NAV = [
  { id: "mud-properties", label: "Mud Properties", icon: Droplets, isOverview: true },
  { id: "overview", label: "Fluid Overview", icon: Timer },
  { id: "rheology", label: "Rheology", icon: Beaker },
  { id: "density", label: "Density & Solids", icon: Layers },
  { id: "temperature", label: "Temperature", icon: Thermometer },
  { id: "gas", label: "Gas / Compressibility", icon: FlaskConical },
  { id: "calibration", label: "Calibration", icon: Ruler },
  { id: "summary", label: "Summary", icon: FileBarChart },
];

export default function MudProperties() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = section || "mud-properties";
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
      <CommonButton
        variant="outline"
        size="sm"
        onClick={() => setDirty(false)}
        icon={Save}
      >
        Save
      </CommonButton>
      <CommonButton variant="outline" size="sm" icon={RotateCcw}>
        Discard
      </CommonButton>
      <CommonButton variant="outline" size="sm" icon={Upload}>
        Import
      </CommonButton>
    </>
  );

  const typeOptions = [
    { label: "OBM", value: "OBM" },
    { label: "WBM", value: "WBM" },
  ];

  const baseFluidOptions = [
    { label: "Diesel", value: "Diesel" },
    { label: "Synthetic", value: "Synthetic" },
  ];

  const tempOptions = [
    { label: "85 °F", value: "85" },
    { label: "90 °F", value: "90" },
  ];

  const sidebarNav = (
    <nav className="py-3 px-3 space-y-1">
      {MUD_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isOverview = (item as any).isOverview;
        return (
          <>
            <button
              key={item.id}
              onClick={() => navigate(`${ROUTES.MUD_PROPERTIES}/${item.id}`)}
              className={cn(
                "w-full flex items-center gap-3 rounded-md px-3 transition-all duration-200 border-0 shadow-none text-left",
                isOverview
                  ? "py-3 text-base font-semibold"
                  : "py-2.5 text-sm font-medium",
                isActive
                  ? "bg-white dark:bg-primary/20 text-primary shadow-sm dark:shadow-none hover:bg-white dark:hover:bg-primary/30 hover:text-primary"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <Icon className={cn("shrink-0", isOverview ? "h-5 w-5" : "h-4 w-4")} />
              {item.label}
            </button>
            {isOverview && (
              <div className="mx-3 my-1 border-t border-border" />
            )}
          </>
        );
      })}
    </nav>
  );

  const sidebarFooter = (
    <p className="text-[11px] text-muted-foreground">
      Modified by adm.tirth | 06 Feb 2026 | 12:21
    </p>
  );

  const activeNav = MUD_NAV.find((n) => n.id === activeSection);
  
  return (
    <PageLayout>
      <SidebarLayout sidebar={sidebarNav} sidebarFooter={sidebarFooter}>
        <PageHeaderBar
          icon={<Droplets className="h-5 w-5" />}
          title={
            activeSection === "mud-properties"
              ? "Mud Properties"
              : `Mud Properties — ${activeNav?.label ?? ""}`
          }
          metadata={
            <>
              Active Well/Profile: NFQ-21-6A
              <span className="hidden md:inline"> · Mud System: OBM</span>
            </>
          }
          actions={headerActions}
        />

        <main className="flex-1 min-w-0 overflow-auto flex flex-col">
          <div className="mb-4 shrink-0">
            <div className="w-full flex flex-wrap items-center justify-between gap-4">
              <SearchInput
                placeholder="Search Mud Properties..."
                value={search}
                onChange={setSearch}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <CommonButton variant="outline" size="sm" icon={Save}>
                  Save
                </CommonButton>
                <CommonButton variant="outline" size="sm" icon={RotateCcw}>
                  Discard
                </CommonButton>
                <CommonButton variant="outline" size="sm" icon={FolderOpen}>
                  Load Preset
                </CommonButton>
                <CommonButton variant="outline" size="sm" icon={FolderPlus}>
                  Save Preset
                </CommonButton>
                <CommonButton variant="outline" size="sm" icon={Download}>
                  Export
                </CommonButton>
              </div>
            </div>
          </div>

          <div className="flex flex-1 min-w-0 gap-4 overflow-auto">
            <div className="flex-1 min-w-0 space-y-4">
              <div>
                {/* Mud Properties overview tab */}
                {activeSection === "mud-properties" && (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 items-start mb-4">
                    {[
                      { id: "overview", title: "Fluid Overview", description: "Fluid system type, base fluid, active pits volume, flowline temperature, and rheology source.", icon: Timer },
                      { id: "rheology", title: "Rheology", description: "PV, YP, Gel 10s/10m — derive from viscometer or enter manually.", icon: Beaker },
                      { id: "density", title: "Density & Solids", description: "Oil/Water ratio, salinity, solids content, and density inputs.", icon: Layers },
                      { id: "temperature", title: "Temperature", description: "Surface temp, bottomhole temp, and temperature gradient.", icon: Thermometer },
                      { id: "gas", title: "Gas / Compressibility", description: "Gas solubility, compressibility factor, and gas/oil ratio.", icon: FlaskConical },
                      { id: "calibration", title: "Calibration", description: "Viscometer cal. date, density cal. date, and temperature sensor offset.", icon: Ruler },
                      { id: "summary", title: "Summary", description: "Read-only overview of all mud properties — mud system, PV/YP, gel, oil/water, surface/BHT.", icon: FileBarChart },
                    ].map((card) => (
                      <CategoryCard
                        key={card.id}
                        title={card.title}
                        description={card.description}
                        icon={card.icon}
                        onClick={() => navigate(`${ROUTES.MUD_PROPERTIES}/${card.id}`)}
                      />
                    ))}
                  </div>
                )}

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
                      <PanelCard
                        title="Fluid System"
                        headerAction={<RestoreDefaultsButton />}
                      >
                        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Type
                            </Label>
                            <CommonSelect
                              options={typeOptions}
                              value={fluid.type}
                              onValueChange={(v) =>
                                setFluid((f) => ({ ...f, type: v }))
                              }
                            />
                          </div>
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Base Fluid
                            </Label>
                            <CommonSelect
                              options={baseFluidOptions}
                              value={fluid.baseFluid}
                              onValueChange={(v) =>
                                setFluid((f) => ({ ...f, baseFluid: v }))
                              }
                            />
                          </div>
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Active pits volume (bbl)
                            </Label>
                            <CommonInput
                              value={fluid.activePitsVolume}
                              onChange={(e) =>
                                setFluid((f) => ({
                                  ...f,
                                  activePitsVolume: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Flowline temperature
                            </Label>
                            <CommonSelect
                              options={tempOptions}
                              value={fluid.flowlineTemp}
                              onValueChange={(v) =>
                                setFluid((f) => ({ ...f, flowlineTemp: v }))
                              }
                            />
                          </div>
                        </div>
                      </PanelCard>
                    )}

                    {/* Rheology */}
                    {(activeSection === "overview" ||
                      activeSection === "rheology") && (
                      <PanelCard
                        title="Rheology"
                        headerAction={<RestoreDefaultsButton />}
                      >
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
                          <LabeledInputWithUnit
                            label="PV"
                            value={fluid.pv}
                            onChange={(v) => setFluid((f) => ({ ...f, pv: v }))}
                            unit="cP"
                          />
                          <LabeledInputWithUnit
                            label="YP"
                            value={fluid.yp}
                            onChange={(v) => setFluid((f) => ({ ...f, yp: v }))}
                            unit="lb/100ft²"
                          />
                          <LabeledInputWithUnit
                            label="Gel 10s"
                            value={fluid.gel10s}
                            onChange={(v) => setFluid((f) => ({ ...f, gel10s: v }))}
                            unit="lb/100ft²"
                          />
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Gel 10m
                            </Label>
                            <CommonInput
                              value={fluid.gel10m}
                              onChange={(e) =>
                                setFluid((f) => ({
                                  ...f,
                                  gel10m: e.target.value,
                                }))
                              }
                              suffix="lb/100ft²"
                            />
                          </div>
                        </div>
                      </PanelCard>
                    )}

                    {/* Density & Solids */}
                    {(activeSection === "overview" ||
                      activeSection === "density") && (
                      <PanelCard
                        title="Density & Solids"
                        headerAction={<RestoreDefaultsButton />}
                      >
                        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
                          <LabeledInputWithUnit
                            label="PV"
                            value={fluid.pv}
                            onChange={(v) => setFluid((f) => ({ ...f, pv: v }))}
                            unit="cP"
                          />
                          <LabeledInputWithUnit
                            label="YP"
                            value={fluid.yp}
                            onChange={(v) => setFluid((f) => ({ ...f, yp: v }))}
                            unit="lb/100ft²"
                          />
                          <LabeledInputWithUnit
                            label="Gel 10s"
                            value={fluid.gel10s}
                            onChange={(v) => setFluid((f) => ({ ...f, gel10s: v }))}
                            unit="lb/100ft²"
                          />
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Oil/Water
                            </Label>
                            <CommonInput
                              value={fluid.oilWater}
                              readOnly
                              suffix={
                                <div className="flex items-center gap-1">
                                  <Lock className="h-3 w-3" />
                                  <ExternalLink className="h-3 w-3" />
                                </div>
                              }
                            />
                          </div>
                          <div className="space-y-2 min-w-0">
                            <Label className="h-5 flex items-center text-sm">
                              Salinity
                            </Label>
                            <CommonInput
                              value={fluid.salinity}
                              onChange={(e) =>
                                setFluid((f) => ({
                                  ...f,
                                  salinity: e.target.value,
                                }))
                              }
                              suffix="ppk"
                            />
                          </div>
                        </div>
                      </PanelCard>
                    )}

                    {/* Temperature */}
                    {(activeSection === "overview" ||
                      activeSection === "temperature") && (
                      <PanelCard
                        title="Temperature"
                        headerAction={<RestoreDefaultsButton />}
                      >
                        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
                          <LabeledInputWithUnit
                            label="Surface temp"
                            value={fluid.surfaceTemp}
                            onChange={(v) => setFluid((f) => ({ ...f, surfaceTemp: v }))}
                            unit="°F"
                          />
                          <LabeledInputWithUnit
                            label="Bottomhole temp"
                            value={fluid.bottomholeTemp}
                            unit="°F"
                            readOnly
                          />
                          <LabeledInputWithUnit
                            label="Temperature gradient"
                            value={fluid.tempGradient}
                            onChange={(v) => setFluid((f) => ({ ...f, tempGradient: v }))}
                            unit="°F/100 ft"
                            className="sm:col-span-2"
                          />
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
                      <div className="grid grid-cols-[140px_120px_auto] gap-3 items-center">
                        <Label className="text-xs text-muted-foreground text-left">
                          Gas solubility
                        </Label>
                        <CommonInput
                          value={fluid.gasSolubility}
                          onChange={(e) =>
                            setFluid((f) => ({
                              ...f,
                              gasSolubility: e.target.value,
                            }))
                          }
                          placeholder="—"
                        />
                        <span className="text-[11px] text-muted-foreground">
                          scf/bbl
                        </span>
                        <Label className="text-xs text-muted-foreground text-left">
                          Compressibility factor
                        </Label>
                        <CommonInput
                          value={fluid.compressibilityFactor}
                          onChange={(e) =>
                            setFluid((f) => ({
                              ...f,
                              compressibilityFactor: e.target.value,
                            }))
                          }
                          placeholder="—"
                        />
                        <span className="text-[11px] text-muted-foreground">
                          —
                        </span>
                        <Label className="text-xs text-muted-foreground text-left">
                          Gas/oil ratio
                        </Label>
                        <CommonInput
                          value={fluid.gasOilRatio}
                          onChange={(e) =>
                            setFluid((f) => ({
                              ...f,
                              gasOilRatio: e.target.value,
                            }))
                          }
                          placeholder="—"
                        />
                        <span className="text-[11px] text-muted-foreground">
                          scf/stb
                        </span>
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
                      <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
                        <Label className="text-xs text-muted-foreground text-left">
                          Viscometer cal. date
                        </Label>
                        <CommonInput
                          value={fluid.viscometerCalDate}
                          onChange={(e) =>
                            setFluid((f) => ({
                              ...f,
                              viscometerCalDate: e.target.value,
                            }))
                          }
                          placeholder="—"
                          type="date"
                        />
                        <Label className="text-xs text-muted-foreground text-left">
                          Density cal. date
                        </Label>
                        <CommonInput
                          value={fluid.densityCalDate}
                          onChange={(e) =>
                            setFluid((f) => ({
                              ...f,
                              densityCalDate: e.target.value,
                            }))
                          }
                          placeholder="—"
                          type="date"
                        />
                        <Label className="text-xs text-muted-foreground text-left">
                          Temp. sensor offset
                        </Label>
                        <CommonInput
                          value={fluid.tempSensorOffset}
                          onChange={(e) =>
                            setFluid((f) => ({
                              ...f,
                              tempSensorOffset: e.target.value,
                            }))
                          }
                          placeholder="°F"
                        />
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
                          <span className="font-medium">{fluid.baseFluid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">PV / YP</span>
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
                          <span className="font-medium">{fluid.oilWater}</span>
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
            {activeSection !== "mud-properties" && (
              <aside className="w-72 shrink-0 hidden xl:block space-y-4">
                <PanelCard title="Calculated Outputs" className="h-auto">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Calculated ECD @ Bit
                    </span>
                    <span className="font-medium tabular-nums">12.98 ppg</span>
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
                    <span className="text-muted-foreground">Estimated BHP</span>
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
                      <span className="text-muted-foreground">{row.label}</span>
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
                          <span className="text-muted-foreground">{label}</span>
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
            )}
          </div>
        </main>
      </SidebarLayout>
    </PageLayout>
  );
}
