import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Upload,
} from "lucide-react";

import { ROUTES } from "@/app/routes/clientRoutes";
import { PageLayout } from "@/components/layouts/PageLayout";
import { SidebarLayout } from "@/components/layouts/SidebarLayout";
import { PageHeaderLayout } from "@/components/layouts/PageHeaderLayout";
import { SidebarNavLayout } from "@/components/layouts/SidebarNavLayout";
import { CommonButton, CommonTooltip } from "@/components/shared";

import { SettingsOverview } from "./SettingsOverview";
import { GeneralSettings } from "./General";
import { Units } from "./Units";
import { DataTime } from "./DataTime";
import { Signals } from "./Signals";
import { Alarms } from "./Alarms";
import { AutoControl } from "./AutoControl";
import { ChokePumps } from "./ChokePumps";
import { HydraulicsModel } from "./HydraulicsModel";
import { UiDisplay } from "./UiDisplay";
import { UsersRoles } from "./userAndRoles";
import { AboutDiagnostics } from "./AboutDiagnostics";
import { SETTINGS_NAV } from "@/utils/constants";
// import { GeneralSettingsData } from "@/utils/types/settings";
import { SettingsProvider, useSettingsContext } from "@/context/settings";

function SettingsContent() {
  const { section } = useParams();
  const activeSection = section || "setting";
  const { requestSave } = useSettingsContext();

  // const [general, setGeneral] = useState<GeneralSettingsData>({
  //   defaultWellName: "NFQ-21-6A",
  //   defaultRigName: "Rig-01",
  //   defaultScenario: "Static",
  //   startupScreen1: "Quantum HUD",
  //   startupScreen2: "Quantum HUD",
  // });
  // const [safetyConfirmations, setSafetyConfirmations] = useState(true);

  const headerActions = useMemo(
    () => (
      <>
        <CommonTooltip content="Save settings">
          <CommonButton variant="outline" icon={Save} onClick={requestSave}>
            Save
          </CommonButton>
        </CommonTooltip>
        <CommonTooltip content="Discard changes">
          <CommonButton variant="outline" icon={RotateCcw}>
            Discard
          </CommonButton>
        </CommonTooltip>
        <CommonTooltip content="Export settings">
          <CommonButton variant="outline" icon={Upload}>
            Export
          </CommonButton>
        </CommonTooltip>
      </>
    ),
    [requestSave],
  );

  const sidebarNav = useMemo(
    () => (
      <SidebarNavLayout
        items={SETTINGS_NAV}
        activeSection={activeSection}
        baseRoute={ROUTES.SETTINGS}
      />
    ),
    [activeSection],
  );

  const activeNav = useMemo(
    () => SETTINGS_NAV.find((n) => n.id === activeSection),
    [activeSection],
  );

  const renderSection = () => {
    switch (activeSection) {
      case "setting":
        return (
          <>
            <SettingsOverview />
          </>
        );
      case "general":
        return <GeneralSettings />;
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
        <PageHeaderLayout
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

        <main className="flex-1 min-w-0 overflow-auto">{renderSection()}</main>
      </SidebarLayout>
    </PageLayout>
  );
}

export default function Settings() {
  return (
    <SettingsProvider>
      <SettingsContent />
    </SettingsProvider>
  );
}
