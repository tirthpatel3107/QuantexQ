// React & Hooks
import { useParams } from "react-router-dom";

// Components - Common
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  CommonButton,
  SidebarNav,
  CommonTooltip,
} from "@/components/shared";

// Components - Local
import { DaqOverview } from "./DaqOverview";
import { Display } from "./Display";
import { Streaming } from "./Streaming";
import { Notifications } from "./Notifications";
import { LogAnalysis } from "./LogAnalysis";
import { SensorPerms } from "./SensorPerms";
import { Calibration } from "./Calibration";
import { Hydraulics } from "./Hydraulics";
import { SystemSettings } from "./SystemSettings";
import { Downloads } from "./downloads/index";

// Contexts
import { DAQProvider, useDAQContext } from "@/context/daq";

// Constants
import { ROUTES } from "@/services/routes/clientRoutes";
import { DAQ_NAV } from "@/utils/constants";

// Icons
import { Activity, Save, RotateCcw, Upload } from "lucide-react";
/**
 * DAQContent Component
 *
 * The internal layout for the Data Acquisition (DAQ) module.
 * Handles sub-section routing (Notifications, Log Analysis, Hydraulics, etc.)
 * and provides a shared header with module-wide actions.
 *
 * @returns JSX.Element
 */
function DAQContent() {
  // ---- Data & State ----
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
  // ---- Render Helpers ----

  /**
   * Navigates to the active sub-section of the DAQ module.
   */
  const renderSection = () => {
    switch (activeSection) {
      case "display":
        return <Display />;
      case "daq":
        return <DaqOverview />;
      case "streaming":
        return <Streaming />;
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
 * DAQ Module Entry Point
 *
 * Wraps the DAQContent with DAQProvider to enable centralized
 * form saving and data synchronization across different sub-sections.
 *
 * @returns JSX.Element
 */
export default function DAQ() {
  return (
    <DAQProvider>
      <DAQContent />
    </DAQProvider>
  );
}
