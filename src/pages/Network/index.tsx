import { useParams, useNavigate } from "react-router-dom";
import { Network as NetworkIcon, Save, RotateCcw, Upload } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  CommonButton,
} from "@/components/common";
import { cn } from "@/lib/utils";

import { NETWORK_NAV } from "./constants";
import { NetworkOverview } from "./sections/NetworkOverview";
import { Sources } from "./sections/Sources";
import { Protocols } from "./sections/Protocols";
import { Routing } from "./sections/Routing";
import { Security } from "./sections/Security";
import { Diagnostics } from "./sections/Diagnostics";

export default function Network() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = section || "network";

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

  const activeNav = NETWORK_NAV.find((n) => n.id === activeSection);

  const sidebarNav = (
    <nav className="py-3 px-3 space-y-1">
      {NETWORK_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isOverview = item.isOverview;
        return (
          <div key={item.id}>
            <button
              onClick={() => navigate(`${ROUTES.NETWORK}/${item.id}`)}
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

  const renderSection = () => {
    switch (activeSection) {
      case "network":
        return <NetworkOverview />;
      case "sources":
        return <Sources />;
      case "protocols":
        return <Protocols />;
      case "routing":
        return <Routing />;
      case "security":
        return <Security />;
      case "diagnostics":
        return <Diagnostics />;
      default:
        return <NetworkOverview />;
    }
  };

  return (
    <PageLayout>
      <SidebarLayout
        sidebar={sidebarNav}
        sidebarFooter={
          <p className="text-[11px] text-muted-foreground">
            Modified by adm.tirth | 06 Feb 2026 | 16:40
          </p>
        }
      >
        <PageHeaderBar
          icon={
            activeNav?.icon ? (
              <activeNav.icon className="h-5 w-5" />
            ) : (
              <NetworkIcon className="h-5 w-5" />
            )
          }
          title={activeNav?.label ?? ""}
          metadata="Active Well: NFQ-21-6A  |  Status: System Health OK"
          actions={headerActions}
        />

        <main className="flex-1 min-w-0 overflow-auto">{renderSection()}</main>
      </SidebarLayout>
    </PageLayout>
  );
}
