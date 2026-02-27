import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Droplets, Save, RotateCcw, Download } from "lucide-react";

import { ROUTES } from "@/utils/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  CommonButton,
  SidebarNav,
  CommonTooltip,
} from "@/components/common";

import { MudPropertiesOverview } from "./MudPropertiesOverview";
import { FluidOverview } from "./FluidOverview";
import { Rheology } from "./Rheology";
import { Density } from "./Density";
import { Temperature } from "./Temperature";
import { GasCompressibility } from "./GasCompressibility";
import { Calibration } from "./Calibration";
import { Summary } from "./Summary";
import { MudPropertiesSidebar } from "../../components/mudProperties/MudPropertiesSidebar";
import { MUD_NAV } from "@/utils/constants";
import { FluidData } from "@/utils/types/mud";
import {
  MudPropertiesProvider,
  useMudPropertiesContext,
} from "../../context/MudProperties/MudPropertiesContext";

function MudPropertiesContent() {
  const { section } = useParams();
  const activeSection = section || "mud-properties";
  const [, setDirty] = useState(true);
  const { requestSave } = useMudPropertiesContext();

  // Local fluid state - will be populated by individual tab API calls
  const [fluid] = useState<FluidData>({
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

  const headerActions = useMemo(
    () => (
      <>
        <CommonTooltip content="Save mud properties">
          <CommonButton
            variant="outline"
            size="sm"
            onClick={() => {
              setDirty(false);
              requestSave();
            }}
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
    ),
    [requestSave],
  );

  const sidebarNav = useMemo(
    () => (
      <SidebarNav
        items={MUD_NAV}
        activeSection={activeSection}
        baseRoute={ROUTES.MUD_PROPERTIES}
      />
    ),
    [activeSection],
  );

  const activeNav = useMemo(
    () => MUD_NAV.find((n) => n.id === activeSection),
    [activeSection],
  );

  const renderSection = () => {
    switch (activeSection) {
      case "mud-properties":
        return <MudPropertiesOverview />;
      case "overview":
        return <FluidOverview />;
      case "rheology":
        return <Rheology />;
      case "density":
        return <Density />;
      case "temperature":
        return <Temperature />;
      case "gas":
        return <GasCompressibility />;
      case "calibration":
        return <Calibration />;
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
          <div className="flex flex-1 min-w-0 gap-4 overflow-auto">
            <div className="flex-1 min-w-0 space-y-4">{renderSection()}</div>

            {activeSection !== "mud-properties" && <MudPropertiesSidebar />}
          </div>
        </main>
      </SidebarLayout>
    </PageLayout>
  );
}

export default function MudProperties() {
  return (
    <MudPropertiesProvider>
      <MudPropertiesContent />
    </MudPropertiesProvider>
  );
}
