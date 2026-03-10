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
} from "@/components/common";

// Components - Local
import { NetworkOverview } from "./NetworkOverview";
import { Sources } from "./Sources";
import { Protocols } from "./Protocols";
import { Routing } from "./Routing";
import { Security } from "./Security";
import { Diagnostics } from "./Diagnostics";

// Contexts
import { NetworkProvider, useNetworkContext } from "@/context/Network";

// Constants
import { ROUTES } from "@/services/routes/clientRoutes";
import { NETWORK_NAV } from "@/utils/constants";

// Icons
import { Network as NetworkIcon, Save, RotateCcw, Upload } from "lucide-react";

/**
 * NetworkContent Component
 *
 * The internal layout for the Network module.
 * Handles section-based routing and provides a shared header with global actions (Save, Discard, Import).
 *
 * @returns JSX.Element
 */
function NetworkContent() {
  // ---- Data & State ----
  const { section } = useParams();
  const activeSection = section || "network";
  const { requestSave } = useNetworkContext();

  const headerActions = (
    <>
      <CommonTooltip content="Save network settings">
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

  // ---- Render Helpers ----

  /**
   * Navigates to the active sub-section of the Network module.
   */
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

/**
 * Network Module Entry Point
 *
 * Wraps the NetworkContent with NetworkProvider to enable centralized
 * form saving and data synchronization across different sub-sections.
 *
 * @returns JSX.Element
 */
export default function Network() {
  return (
    <NetworkProvider>
      <NetworkContent />
    </NetworkProvider>
  );
}
