import { useParams, useNavigate } from "react-router-dom";
import { Activity, Save, RotateCcw, Upload } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  CommonButton,
} from "@/components/common";
import { cn } from "@/lib/utils";

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

  const sidebarNav = (
    <nav className="py-3 px-3 space-y-1">
      {DAQ_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isOverview = item.isOverview;
        return (
          <div key={item.id}>
            <button
              onClick={() => navigate(`${ROUTES.DAQ}/${item.id}`)}
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
              <Icon
                className={cn("shrink-0", isOverview ? "h-5 w-5" : "h-4 w-4")}
              />
              {item.label}
            </button>
            {isOverview && <div className="mx-3 my-1 border-t border-border" />}
          </div>
        );
      })}
    </nav>
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
          icon={<Activity className="h-5 w-5" />}
          title={
            activeSection === "daq" ? "DAQ" : `DAQ — ${activeNav?.label ?? ""}`
          }
          metadata="Active Well/Profile: NFQ-21-6A  |  Mud System: OBM"
          actions={headerActions}
        />

        <main className="flex-1 min-w-0 overflow-auto">
          {renderSection()}
        </main>
      </SidebarLayout>
    </PageLayout>
  );
}
