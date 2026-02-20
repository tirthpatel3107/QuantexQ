import { useParams } from "react-router-dom";
import { Network as NetworkIcon, Save, RotateCcw, Upload } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  CommonButton,
  SidebarNav,
  CommonTooltip,
} from "@/components/common";

import { NETWORK_NAV } from "./constants";
import { NetworkOverview } from "./sections/NetworkOverview";
import { Sources } from "./sections/Sources";
import { Protocols } from "./sections/Protocols";
import { Routing } from "./sections/Routing";
import { Security } from "./sections/Security";
import { Diagnostics } from "./sections/Diagnostics";

export default function Network() {
  const { section } = useParams();
  const activeSection = section || "network";

  const headerActions = (
    <>
      <CommonTooltip content="Save network settings">
        <CommonButton variant="outline" size="sm" icon={Save}>
          Save
        </CommonButton>
      </CommonTooltip>
      <CommonTooltip content="Discard changes">
        <CommonButton variant="outline" size="sm" icon={RotateCcw}>
          Discard
        </CommonButton>
      </CommonTooltip>
      <CommonTooltip content="Import network configuration">
        <CommonButton variant="outline" size="sm" icon={Upload}>
          Import
        </CommonButton>
      </CommonTooltip>
    </>
  );

  const activeNav = NETWORK_NAV.find((n) => n.id === activeSection);

  const sidebarNav = (
    <SidebarNav
      items={NETWORK_NAV}
      activeSection={activeSection}
      baseRoute={ROUTES.NETWORK}
    />
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
