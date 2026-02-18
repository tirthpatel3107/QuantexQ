import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Droplets,
  Save,
  RotateCcw,
  FolderOpen,
  FolderPlus,
  Download,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  SearchInput,
  CommonButton,
} from "@/components/common";
import { cn } from "@/lib/utils";

import { MudPropertiesOverview } from "./sections/MudPropertiesOverview";
import { FluidOverview } from "./sections/FluidOverview";
import { Rheology } from "./sections/Rheology";
import { Density } from "./sections/Density";
import { Temperature } from "./sections/Temperature";
import { GasCompressibility } from "./sections/GasCompressibility";
import { Calibration } from "./sections/Calibration";
import { Summary } from "./sections/Summary";
import { MudPropertiesSidebar } from "./components/MudPropertiesSidebar";
import {
  MUD_NAV,
  TYPE_OPTIONS,
  BASE_FLUID_OPTIONS,
  TEMP_OPTIONS,
} from "./constants";
import { FluidData } from "@/types/mud";

export default function MudProperties() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = section || "mud-properties";
  const [search, setSearch] = useState("");
  const [, setDirty] = useState(true);

  const [fluid, setFluid] = useState<FluidData>({
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
    gasSolubility: "",
    compressibilityFactor: "",
    gasOilRatio: "",
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
      <CommonButton variant="outline" size="sm" icon={Download}>
        Import
      </CommonButton>
    </>
  );

  const sidebarNav = (
    <nav className="py-3 px-3 space-y-1">
      {MUD_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isOverview = item.isOverview;
        return (
          <div key={item.id}>
            <button
              onClick={() => navigate(`${ROUTES.MUD_PROPERTIES}/${item.id}`)}
              className={cn(
                "w-full flex items-center gap-3 rounded-md px-3 transition-all duration-200 border-0 shadow-none text-left",
                isOverview
                  ? "py-3 text-base font-semibold"
                  : "py-2.5 text-sm font-medium",
                isActive || isOverview
                  ? "bg-white dark:bg-primary/20 text-primary shadow-sm dark:shadow-none hover:bg-white dark:hover:bg-primary/30 hover:text-primary"
                  : "bg-white/50 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-white/10",
              )}
            >
              <Icon
                className={cn("shrink-0", isOverview ? "h-5 w-5" : "h-4 w-4")}
              />
              {item.label}
            </button>
            {isOverview && (
              <hr className="my-4 border-none h-[3px] bg-white opacity-80 dark:opacity-30" />
            )}
          </div>
        );
      })}
    </nav>
  );

  const activeNav = MUD_NAV.find((n) => n.id === activeSection);

  const renderSection = () => {
    switch (activeSection) {
      case "mud-properties":
        return <MudPropertiesOverview />;
      case "overview":
        return (
          <FluidOverview
            fluid={fluid}
            setFluid={setFluid}
            typeOptions={TYPE_OPTIONS}
            baseFluidOptions={BASE_FLUID_OPTIONS}
            tempOptions={TEMP_OPTIONS}
          />
        );
      case "rheology":
        return <Rheology fluid={fluid} setFluid={setFluid} />;
      case "density":
        return <Density fluid={fluid} setFluid={setFluid} />;
      case "temperature":
        return <Temperature fluid={fluid} setFluid={setFluid} />;
      case "gas":
        return <GasCompressibility fluid={fluid} setFluid={setFluid} />;
      case "calibration":
        return <Calibration fluid={fluid} setFluid={setFluid} />;
      case "summary":
        return <Summary fluid={fluid} />;
      default:
        return <MudPropertiesOverview />;
    }
  };

  return (
    <PageLayout>
      <SidebarLayout
        sidebar={sidebarNav}
        sidebarFooter={
          <p className="text-[11px] text-muted-foreground">
            Modified by adm.tirth | 06 Feb 2026 | 12:21
          </p>
        }
      >
        <PageHeaderBar
          icon={
            activeNav?.icon ? (
              <activeNav.icon className="h-5 w-5" />
            ) : (
              <Droplets className="h-5 w-5" />
            )
          }
          title={activeNav?.label ?? ""}
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
            <div className="flex-1 min-w-0 space-y-4">{renderSection()}</div>

            {activeSection !== "mud-properties" && <MudPropertiesSidebar />}
          </div>
        </main>
      </SidebarLayout>
    </PageLayout>
  );
}
