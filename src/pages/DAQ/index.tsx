import { useParams, useNavigate } from "react-router-dom";
import { Activity, Save, RotateCcw, Upload } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  CommonButton,
  SidebarNav,
} from "@/components/common";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/context/SidebarContext";

import { DAQ_NAV } from "./constants";
import { DaqOverview } from "./sections/DaqOverview";
import { Display } from "./sections/Display";
import { Streaming } from "./sections/Streaming";
import { Notifications } from "./sections/Notifications";
import { LogAnalysis } from "./sections/LogAnalysis";
import { SensorPerms } from "./sections/SensorPerms";
import { Calibration } from "./sections/Calibration";
import { Hydraulics } from "./sections/Hydraulics";
import { SystemSettings } from "./sections/SystemSettings";
import { Downloads } from "./sections/Downloads";

export default function DAQ() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = section || "daq";

  const headerActions = (
    <>
      <CommonButton variant="outline" size="sm" icon={Save}>
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

  const activeNav = DAQ_NAV.find((n) => n.id === activeSection);

  const { isCollapsed } = useSidebarContext();

  const sidebarNav = (
    <SidebarNav
      items={DAQ_NAV}
      activeSection={activeSection}
      baseRoute={ROUTES.DAQ}
    />
  );

  const renderSection = () => {
    switch (activeSection) {
      case "daq":
        return <DaqOverview />;
      case "display":
        return <Display />;
      case "streaming":
        return <Streaming />;
      case "notifications":
        return <Notifications />;
      case "log-analysis":
        return <LogAnalysis />;
      case "sensor-perms":
        return <SensorPerms />;
      case "calibration":
        return <Calibration />;
      case "hydraulics":
        return <Hydraulics />;
      case "system-settings":
        return <SystemSettings />;
      case "downloads":
        return <Downloads />;
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
