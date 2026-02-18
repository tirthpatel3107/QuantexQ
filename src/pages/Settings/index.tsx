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
  SearchInput,
  CommonButton,
} from "@/components/common";
import { cn } from "@/lib/utils";

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
import { UsersRoles } from "./sections/UsersRoles";
import { AboutDiagnostics } from "./sections/AboutDiagnostics";
import { SETTINGS_NAV } from "./constants";

export default function Settings() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = section || "setting";
  const [search, setSearch] = useState("");

  const [general, setGeneral] = useState({
    defaultWellName: "NFQ-21-6A",
    defaultRigName: "Rig-01",
    defaultScenario: "Static",
    startupScreen1: "Quantum HUD",
    startupScreen2: "Quantum HUD",
  });
  const [safetyConfirmations, setSafetyConfirmations] = useState(true);

  const headerActions = (
    <>
      <CommonButton variant="outline" size="sm" icon={Save}>
        Save
      </CommonButton>
      <CommonButton variant="outline" size="sm" icon={RotateCcw}>
        Discard
      </CommonButton>
      <CommonButton variant="outline" size="sm" icon={Upload}>
        Export
      </CommonButton>
    </>
  );

  const sidebarNav = (
    <nav className="py-3 px-3 space-y-1">
      {SETTINGS_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isOverview = item.isOverview;
        return (
          <div key={item.id}>
            <button
              onClick={() => navigate(`${ROUTES.SETTINGS}/${item.id}`)}
              className={cn(
                "w-full flex items-center gap-3 rounded-md px-3 transition-all duration-200 border-0 shadow-none text-left",
                isOverview
                  ? "py-3 text-base font-semibold"
                  : "py-2.5 text-sm font-medium",
                isActive || isOverview
                  ? "bg-white dark:bg-primary/20 text-primary shadow-sm dark:shadow-none hover:bg-white dark:hover:bg-primary/30 hover:text-primary"
                  : "bg-white/50 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-white/10",
              )}
            >
              <Icon
                className={cn("shrink-0", isOverview ? "h-5 w-5" : "h-4 w-4")}
              />
              {item.label}
            </button>
            {isOverview && (
              <hr className="my-4 border-none h-[3px] bg-white opacity-80 dark:opacity-30" />
            )}
          </div>
        );
      })}
    </nav>
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
              <SearchInput
                placeholder="Search settings..."
                value={search}
                onChange={setSearch}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <CommonButton variant="outline" size="sm" icon={Save}>
                  Save
                </CommonButton>
                <CommonButton variant="outline" size="sm" icon={RotateCcw}>
                  Discard
                </CommonButton>
                <CommonButton variant="outline" size="sm" icon={Upload}>
                  Export
                </CommonButton>
              </div>
            </div>
          </div> */}

          {renderSection()}
        </main>
      </SidebarLayout>
    </PageLayout>
  );
}
