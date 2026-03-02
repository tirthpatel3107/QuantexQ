import { useParams } from "react-router-dom";
import { Activity, Save, RotateCcw, Upload } from "lucide-react";

import { ROUTES } from "@/utils/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  CommonButton,
  SidebarNav,
  CommonTooltip,
} from "@/components/common";

import { DAQ_NAV } from "@/utils/constants";
import { DaqOverview } from "./DaqOverview";
// import { Display } from "./Display";
// import { Streaming } from "./Streaming";
import { Notifications } from "./Notifications";
import { LogAnalysis } from "./LogAnalysis";
import { SensorPerms } from "./SensorPerms";
import { Calibration } from "./Calibration";
import { Hydraulics } from "./Hydraulics";
import { SystemSettings } from "./SystemSettings";
import { Downloads } from "./downloads/index";
import { DAQProvider, useDAQContext } from "../../context/DAQ/DAQContext";

/**
 * DAQ (Data Acquisition) Dashboard Content
 *
 * This component manages the sub-navigation within the DAQ module.
 * It uses the URL path to determine which configuration sub-section to render.
 */
function DAQContent() {
  const { section } = useParams();
  const activeSection = section || "daq";
  const { requestSave } = useDAQContext();

  /**
   * Action buttons for the page header.
   * These provide global module-level controls (Save, Discard, Import).
   */
  const headerActions = (
    <>
      <CommonTooltip content="Save DAQ settings">
        <CommonButton
          variant="outline"
          size="sm"
          icon={Save}
          onClick={requestSave}
        >
          Save
        </CommonButton>
      </CommonTooltip>
      <CommonTooltip content="Discard changes">
        <CommonButton variant="outline" size="sm" icon={RotateCcw}>
          Discard
        </CommonButton>
      </CommonTooltip>
      <CommonTooltip content="Import DAQ configuration">
        <CommonButton variant="outline" size="sm" icon={Upload}>
          Import
        </CommonButton>
      </CommonTooltip>
    </>
  );

  // Find the active navigation item metadata based on the current URL
  const activeNav = DAQ_NAV.find((n) => n.id === activeSection);

  // Sidebar navigation component for switching between DAQ sub-modules
  const sidebarNav = (
    <SidebarNav
      items={DAQ_NAV}
      activeSection={activeSection}
      baseRoute={ROUTES.DAQ}
    />
  );

  /**
   * Routing logic for DAQ sub-sections.
   * Dynamically renders the appropriate component based on the 'section' URL parameter.
   */
  const renderSection = () => {
    switch (activeSection) {
      case "daq":
        return <DaqOverview />;
      case "notifications":
        return <Notifications />;
      case "log-analysis":
        return <LogAnalysis />;
      case "hydraulics":
        return <Hydraulics />;
      case "sensor-perms":
        return <SensorPerms />;
      case "system-settings":
        return <SystemSettings />;
      case "downloads":
        return <Downloads />;
      case "calibration":
      return <Calibration />;
      case "display":
      // return <Display />;
      case "streaming":
      // return <Streaming />;
      default:
        return <DaqOverview />;
    }
  };

  return (
    <PageLayout>
      <SidebarLayout
        sidebar={sidebarNav}
        sidebarFooter={
          <p className="text-[11px] text-muted-foreground">
            Modified by adm.tirth | 06 Feb 2026 | 12:30
          </p>
        }
      >
        {/* Page title and metadata bar with contextual actions */}
        <PageHeaderBar
          icon={
            activeNav?.icon ? (
              <activeNav.icon className="h-5 w-5" />
            ) : (
              <Activity className="h-5 w-5" />
            )
          }
          title={activeNav?.label ?? ""}
          metadata="Active Well/Profile: NFQ-21-6A  |  Mud System: OBM"
          actions={headerActions}
        />

        <main className="flex-1 min-w-0 overflow-auto">{renderSection()}</main>
      </SidebarLayout>
    </PageLayout>
  );
}

/**
 * Main DAQ (Data Acquisition) Module.
 * Wraps the content in a DAQProvider to provide shared state across all sub-sections.
 */
export default function DAQ() {
  return (
    <DAQProvider>
      <DAQContent />
    </DAQProvider>
  );
}
