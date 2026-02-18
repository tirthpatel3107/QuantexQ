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
  Save,
  RotateCcw,
  Download,
  Upload,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  SearchInput,
  RestoreDefaultsButton,
  CommonButton,
  CommonSelect,
  CommonInput,
} from "@/components/common";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const SETTINGS_NAV = [
  { id: "setting", label: "Settings", icon: SettingsIcon, isOverview: true },
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

const SIDEBAR_FOOTER = "Modified by adm.tirth | 06 Feb 2026 | 12:21";

export default function Settings() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = section || "setting";
  const [search, setSearch] = useState("");
  const [general, setGeneral] = useState({
    defaultWellName: "NFQ-21-6A",
    defaultRigName: "Rig-01",
    defaultScenario: "Static",
    startupScreen1: "Quantum HUD",
    startupScreen2: "Quantum HUD",
  });
  const [safetyConfirmations, setSafetyConfirmations] = useState(true);

  const headerActions = (
    <>
      <CommonButton variant="outline" size="sm" icon={Save}>
        Save
      </CommonButton>
      <CommonButton variant="outline" size="sm" icon={RotateCcw}>
        Discard
      </CommonButton>
      <CommonButton variant="outline" size="sm" icon={Download}>
        Export
      </CommonButton>
    </>
  );

  const rigOptions = [
    { label: "Rig-01", value: "Rig-01" },
    { label: "Rig-02", value: "Rig-02" },
  ];

  const scenarioOptions = [
    { label: "Static", value: "Static" },
    { label: "Dynamic", value: "Dynamic" },
  ];

  const screenOptions = [
    { label: "Quantum HUD", value: "Quantum HUD" },
    { label: "Dashboard", value: "Dashboard" },
  ];

  const sidebarNav = (
    <nav className="py-3 px-3 space-y-1">
      {SETTINGS_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isOverview = (item as any).isOverview;
        return (
          <>
            <button
              key={item.id}
              onClick={() => navigate(`${ROUTES.SETTINGS}/${item.id}`)}
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

  const activeNav = SETTINGS_NAV.find((n) => n.id === activeSection);

  return (
    <PageLayout>
      <SidebarLayout
        sidebar={sidebarNav}
        sidebarFooter={
          <p className="text-[11px] text-muted-foreground">{SIDEBAR_FOOTER}</p>
        }
      >
        <PageHeaderBar
          icon={<SettingsIcon className="h-5 w-5" />}
          title={
            activeSection === "setting"
              ? "Settings"
              : `Settings — ${activeNav?.label ?? ""}`
          }
          metadata="Active Profile: Rig-01 / NFQ-21-6A Admin"
          actions={headerActions}
        />

        <main className="flex-1 min-w-0 overflow-auto">
          <div className="mb-4 shrink-0">
            <div className="w-full flex flex-wrap items-center justify-between gap-4">
              <SearchInput
                placeholder="Search settings..."
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
                <CommonButton variant="outline" size="sm" icon={Upload}>
                  Import
                </CommonButton>
              </div>
            </div>
          </div>

          {/* Project / Well Context + Safety side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">
            <PanelCard title="Project / Well Context">
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Default Well Name</Label>
                  <CommonInput
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
                  <CommonSelect
                    options={rigOptions}
                    value={general.defaultRigName}
                    onValueChange={(v) =>
                      setGeneral((g) => ({ ...g, defaultRigName: v }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Scenario</Label>
                  <CommonSelect
                    options={scenarioOptions}
                    value={general.defaultScenario}
                    onValueChange={(v) =>
                      setGeneral((g) => ({ ...g, defaultScenario: v }))
                    }
                  />
                </div>
                <div className="space-y-2 ">
                  <Label>Startup Screen</Label>
                  <CommonSelect
                    options={screenOptions}
                    value={general.startupScreen1}
                    onValueChange={(v) =>
                      setGeneral((g) => ({
                        ...g,
                        startupScreen1: v,
                        startupScreen2: v,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Startup Screen (secondary)</Label>
                  <CommonSelect
                    options={screenOptions}
                    value={general.startupScreen2}
                    onValueChange={(v) =>
                      setGeneral((g) => ({ ...g, startupScreen2: v }))
                    }
                  />
                </div>
              </div>
            </PanelCard>

            {/* Safety */}
            <PanelCard
              title="Safety"
              headerAction={<RestoreDefaultsButton size="sm" />}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                  <Label htmlFor="safety-confirm">
                    Enable safety confirmations
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Confirmations for Auto Control ON, PRC ON, Mode change, and
                    Import settings.
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
                onClick={() => navigate(`${ROUTES.SETTINGS}/${cat.id}`)}
              />
            ))}
          </div>
        </main>
      </SidebarLayout>
    </PageLayout>
  );
}
