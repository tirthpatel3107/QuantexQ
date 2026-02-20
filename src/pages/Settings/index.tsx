import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Upload,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  CommonSearchInput,
  CommonButton,
  SidebarNav,
  CommonTooltip,
} from "@/components/common";

import { SettingsOverview } from "./sections/SettingsOverview";
import { GeneralSettings } from "./sections/General";
import { Units } from "./sections/Units";
import { DataTime } from "./sections/DataTime";
import { Signals } from "./sections/Signals";
import { Alarms } from "./sections/Alarms";
import { AutoControl } from "./sections/AutoControl";
import { ChokePumps } from "./sections/ChokePumps";
import { HydraulicsModel } from "./sections/HydraulicsModel";
import { UiDisplay } from "./sections/UiDisplay";
import { UsersRoles } from "./sections/userRoles";
import { AboutDiagnostics } from "./sections/AboutDiagnostics";
import { SETTINGS_NAV } from "./constants";
import { GeneralSettingsData } from "@/types/settings";

export default function Settings() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = section || "setting";
  const [search, setSearch] = useState("");
  const [general, setGeneral] = useState<GeneralSettingsData>({
    defaultWellName: "NFQ-21-6A",
    defaultRigName: "Rig-01",
    defaultScenario: "Static",
    startupScreen1: "Quantum HUD",
    startupScreen2: "Quantum HUD",
  });
  const [safetyConfirmations, setSafetyConfirmations] = useState(true);

  const headerActions = (
    <>
      <CommonTooltip content="Save settings">
        <CommonButton variant="outline" size="sm" icon={Save}>
          Save
        </CommonButton>
      </CommonTooltip>
      <CommonTooltip content="Discard changes">
        <CommonButton variant="outline" size="sm" icon={RotateCcw}>
          Discard
        </CommonButton>
      </CommonTooltip>
      <CommonTooltip content="Export settings">
        <CommonButton variant="outline" size="sm" icon={Upload}>
          Export
        </CommonButton>
      </CommonTooltip>
    </>
  );

  const sidebarNav = (
    <SidebarNav
      items={SETTINGS_NAV}
      activeSection={activeSection}
      baseRoute={ROUTES.SETTINGS}
    />
  );

  const activeNav = SETTINGS_NAV.find((n) => n.id === activeSection);

  const renderSection = () => {
    switch (activeSection) {
      case "setting":
        return (
          <>
            <GeneralSettings
              general={general}
              setGeneral={setGeneral}
              safetyConfirmations={safetyConfirmations}
              setSafetyConfirmations={setSafetyConfirmations}
            />
            <SettingsOverview />
          </>
        );
      case "general":
        return (
          <GeneralSettings
            general={general}
            setGeneral={setGeneral}
            safetyConfirmations={safetyConfirmations}
            setSafetyConfirmations={setSafetyConfirmations}
          />
        );
      case "units":
        return <Units />;
      case "data-time":
        return <DataTime />;
      case "signals":
        return <Signals />;
      case "alarms":
        return <Alarms />;
      case "auto-control":
        return <AutoControl />;
      case "choke-pumps":
        return <ChokePumps />;
      case "hydraulics":
        return <HydraulicsModel />;
      case "ui":
        return <UiDisplay />;
      case "users":
        return <UsersRoles />;
      case "about":
        return <AboutDiagnostics />;
      default:
        return <SettingsOverview />;
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
              <SettingsIcon className="h-5 w-5" />
            )
          }
          title={activeNav?.label ?? ""}
          metadata="Active Profile: Rig-01 / NFQ-21-6A Admin"
          actions={headerActions}
        />

        <main className="flex-1 min-w-0 overflow-auto">
          {/* <div className="mb-4 shrink-0">
            <div className="w-full flex flex-wrap items-center justify-between gap-4">
              <CommonSearchInput
                placeholder="Search settings..."
                value={search}
                onChange={setSearch}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <CommonTooltip content="Save settings">
                  <CommonButton variant="outline" size="sm" icon={Save}>
                    Save
                  </CommonButton>
                </CommonTooltip>
                <CommonTooltip content="Discard changes">
                  <CommonButton variant="outline" size="sm" icon={RotateCcw}>
                    Discard
                  </CommonButton>
                </CommonTooltip>
                <CommonTooltip content="Export settings">
                  <CommonButton variant="outline" size="sm" icon={Upload}>
                    Export
                  </CommonButton>
                </CommonTooltip>
              </div>
            </div>
          </div> */}

          {renderSection()}
        </main>
      </SidebarLayout>
    </PageLayout>
  );
}
