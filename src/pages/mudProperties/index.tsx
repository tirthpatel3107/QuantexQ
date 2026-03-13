// React & Hooks
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";

// Components - Layouts
import { PageLayout } from "@/components/layouts/PageLayout";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { PageHeaderLayout } from "@/components/layouts/PageHeaderLayout";
import { SidebarNavLayout } from "@/components/layouts/SidebarNavLayout";

// Components - Common
import { CommonButton, CommonTooltip } from "@/components/shared";

// Components - Local
import { MudPropertiesOverview } from "./MudPropertiesOverview";
import { FluidOverview } from "./fluidOverview";
import { Rheology } from "./Rheology";
import { Density } from "./Density";
import { Temperature } from "./Temperature";
import { GasCompressibility } from "./GasCompressibility";
import { Calibration } from "./Calibration";
import { Summary } from "./Summary";
import { MudPropertiesSidebar } from "@/components/features/mudProperties/MudPropertiesSidebar";

// Services & API

// Types & Schemas
import type { FluidData } from "@/utils/types/mud";

// Contexts
import {
  MudPropertiesProvider,
  useMudPropertiesContext,
} from "@/context/mudProperties";

// Utils & Constants
import { ROUTES } from "@/app/routes/routeEndpoints";
import { MUD_NAV } from "@/utils/constants";

// Icons & Utils
import { Droplets, Save, RotateCcw, Download } from "lucide-react";

/**
 * MudPropertiesContent Component
 *
 * The internal layout for the Mud Properties module.
 * Handles sub-section routing (Fluid, Rheology, Density, etc.) and provides
 * a shared header with module-wide actions like Save and Import.
 *
 * @returns JSX.Element
 */
function MudPropertiesContent() {
  // ---- Data & State ----
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

  // ---- Render Helpers ----

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
      <SidebarNavLayout
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

  /**
   * Navigates to the active sub-section of the Mud Properties module.
   */
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
        // return <Summary />;
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
        <PageHeaderLayout
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

            {/* {activeSection !== "mud-properties" && <MudPropertiesSidebar />} */}
          </div>
        </main>
      </SidebarLayout>
    </PageLayout>
  );
}

/**
 * Mud Properties Module Entry Point
 *
 * Wraps the MudPropertiesContent with MudPropertiesProvider to enable centralized
 * form saving and data synchronization across different sub-sections.
 *
 * @returns JSX.Element
 */
export default function MudProperties() {
  return (
    <MudPropertiesProvider>
      <MudPropertiesContent />
    </MudPropertiesProvider>
  );
}
