// React & Hooks
import { useParams } from "react-router-dom";

// Components - Layouts
import { PageLayout } from "@/components/layouts/PageLayout";
import { PageHeaderLayout } from "@/components/layouts/PageHeaderLayout";

// Components - Common
import { CommonButton, CommonTooltip } from "@/components/shared";

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
import { Downloads } from "./downloads";

// Contexts
import { DAQProvider, useDAQContext } from "@/context/daq";

// Utils & Constants
import { DAQ_NAV } from "@/utils/constants";

// Icons & Utils
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

  // ---- Render Helpers ----

  /**
   * Routing logic for DAQ sub-sections.
   * Dynamically renders the appropriate component based on the 'section' URL parameter.
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
      <div className="flex flex-col flex-1 min-w-0 p-3">
        {/* Page title and metadata bar with contextual actions */}
        <PageHeaderLayout
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
      </div>
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
