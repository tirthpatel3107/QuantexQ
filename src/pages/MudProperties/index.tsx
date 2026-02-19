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
  SidebarNav,
  CommonTooltip,
} from "@/components/common";

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
      <CommonTooltip content="Save mud properties">
        <CommonButton
          variant="outline"
          size="sm"
          onClick={() => setDirty(false)}
          icon={Save}
        >
          Save
        </CommonButton>
      </CommonTooltip>
      <CommonTooltip content="Discard changes">
        <CommonButton variant="outline" size="sm" icon={RotateCcw}>
          Discard
        </CommonButton>
      </CommonTooltip>
      <CommonTooltip content="Import mud properties">
        <CommonButton variant="outline" size="sm" icon={Download}>
          Import
        </CommonButton>
      </CommonTooltip>
    </>
  );

  const sidebarNav = (
    <SidebarNav
      items={MUD_NAV}
      activeSection={activeSection}
      baseRoute={ROUTES.MUD_PROPERTIES}
    />
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
          <div className="mb-5 shrink-0">
            <div className="w-full flex flex-wrap items-center justify-between gap-3">
              <SearchInput
                placeholder="Search Mud Properties..."
                value={search}
                onChange={setSearch}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <CommonTooltip content="Save mud properties">
                  <CommonButton variant="outline" size="sm" icon={Save}>
                    Save
                  </CommonButton>
                </CommonTooltip>
                <CommonTooltip content="Discard changes">
                  <CommonButton variant="outline" size="sm" icon={RotateCcw}>
                    Discard
                  </CommonButton>
                </CommonTooltip>
                <CommonTooltip content="Load preset configuration">
                  <CommonButton variant="outline" size="sm" icon={FolderOpen}>
                    Load Preset
                  </CommonButton>
                </CommonTooltip>
                <CommonTooltip content="Save as preset">
                  <CommonButton variant="outline" size="sm" icon={FolderPlus}>
                    Save Preset
                  </CommonButton>
                </CommonTooltip>
                <CommonTooltip content="Export mud properties">
                  <CommonButton variant="outline" size="sm" icon={Download}>
                    Export
                  </CommonButton>
                </CommonTooltip>
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
