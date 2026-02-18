import { useState } from "react";
import {
  Server,
  Globe,
  GitBranch,
  Lock,
  Activity,
  Save,
  RotateCcw,
  Wifi,
  Network as NetworkIcon,
  Cpu,
  Radio,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  Database,
  ArrowLeftRight,
  Layers,
  ScanLine,
  FlaskConical,
  FileText,
  Settings as SettingsIcon,
  Plug,
  Tag,
  Clock,
  TrendingDown,
  MessageSquare,
  Microscope,
  Cable,
  ShieldAlert,
  SearchCode,
  Tally4,
  FileJson,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import {
  PageLayout,
  SidebarLayout,
  PageHeaderBar,
  CommonButton,
} from "@/components/common";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { cn } from "@/lib/utils";

// ─── Sidebar navigation items ────────────────────────────────────────────────
const NETWORK_NAV = [
  { id: "network", label: "Network", icon: NetworkIcon, isOverview: true },
  { id: "sources", label: "Sources", icon: Server },
  { id: "protocols", label: "Protocols", icon: Cable },
  { id: "routing", label: "Routing", icon: GitBranch },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "diagnostics", label: "Diagnostics", icon: Microscope },
];

// ─── Cards per section ────────────────────────────────────────────────────────
const SECTION_CARDS: Record<
  string,
  { id: string; title: string; description: string; icon: React.ElementType }[]
> = {
  network: [
    {
      id: "ov-sources",
      title: "Sources",
      description:
        "Manage data sources — Rig PLC (Primary), PWD, and custom endpoints with live health monitoring.",
      icon: Server,
    },
    {
      id: "ov-protocols",
      title: "Protocols",
      description:
        "Configure Modbus TCP, OPC-UA, WITSML, Direct WITS, TCP/UDP, and MQTT protocol settings.",
      icon: Cable,
    },
    {
      id: "ov-routing",
      title: "Routing",
      description:
        "Define input-to-output routing rules — tag mapping, Single Loop Control, DualQ Control.",
      icon: GitBranch,
    },
    {
      id: "ov-security",
      title: "Security",
      description:
        "Authentication per source — None, User/Pass, Certificate (SSL) with TLS management.",
      icon: ShieldCheck,
    },
    {
      id: "ov-diagnostics",
      title: "Diagnostics",
      description:
        "Quick Tests, Data Integrity Summary, Jitter/Drop Analysis, Critical Tags Watchlist, and Diagnostic Reports.",
      icon: Microscope,
    },
  ],
  sources: [
    {
      id: "rig-plc",
      title: "Rig PLC (Primary)",
      description:
        "PRIMARY (PLC) source — Chokes, Flow Meter, PWD (optional). Endpoint, data rate, and tag map configuration.",
      icon: Cpu,
    },
    {
      id: "pwd-source",
      title: "PWD Source",
      description:
        "SECONDARY (PWD) source via WITS (TCP). Endpoint 10.1.0.250, data rate 1x/sec, tag map PWD_WITSTags.ctg.",
      icon: Radio,
    },
    {
      id: "devices-plc",
      title: "Devices (from PLC)",
      description:
        "Chokes (A/B) — Tags: ChokeA_Pos, ChokeB_Pos, Choke_SP. Flow Meter — Tags: Flow_In, Flow_Out, Aux_Flow.",
      icon: Plug,
    },
    {
      id: "live-health",
      title: "Live Health (PLC)",
      description:
        "Last packet time, Latency, Drop rate, Messages/sec, Clock drift — real-time PLC connection health.",
      icon: Wifi,
    },
    {
      id: "device-health",
      title: "Device Health",
      description:
        "Chokes OK 100%, Flow Meter 95%, PWD WARN — per-device health with tag count badges.",
      icon: CheckCircle,
    },
    {
      id: "connection-log",
      title: "Connection Log",
      description:
        "Timestamped log of source connections, tag coverage events, and failover activity.",
      icon: FileText,
    },
    {
      id: "failover-sim",
      title: "Failover Simulation",
      description:
        "Toggle PLC offline / simulated data mode. Force failover (test) for redundancy validation.",
      icon: ArrowLeftRight,
    },
    {
      id: "add-source",
      title: "Add Source",
      description:
        "Add a new data source — PLC, PWD, WITS, OPC-UA, Modbus TCP, or custom endpoint.",
      icon: NetworkIcon,
    },
  ],

  protocols: [
    {
      id: "rig-plc-proto",
      title: "Rig PLC Protocol",
      description:
        "PRIMARY (PLC) — Modbus TCP (10.1.0.13:502), OPC-UA (UA-TCP), Ethernet/IP protocol selection.",
      icon: Cpu,
    },
    {
      id: "pwd-proto",
      title: "PWD Protocol",
      description:
        "SECONDARY (PWD) — Direct WITS (0.0.0.9:155), WITSML (3.0), TCP/UDP (10.2.4:35000), MQTT (Password, CA).",
      icon: Radio,
    },
    {
      id: "modbus-config",
      title: "Modbus TCP Config",
      description:
        "Slave ID, register map, polling interval, and timeout settings for Modbus TCP connections.",
      icon: SettingsIcon,
    },
    {
      id: "opc-ua-config",
      title: "OPC-UA Config",
      description:
        "OPC-UA server endpoint, security mode, certificate management, and subscription settings.",
      icon: Globe,
    },
    {
      id: "witsml-config",
      title: "WITSML Config",
      description:
        "WITSML 3.0 server URL, credentials, well/wellbore UID, and log object mapping.",
      icon: Database,
    },
    {
      id: "live-health-proto",
      title: "Live Health (PLC)",
      description:
        "Latency 20 ms, Drop rate 1%, Messages/sec 75/sec, Clock drift +11 ms ahead.",
      icon: Wifi,
    },
    {
      id: "device-health-proto",
      title: "Device Health",
      description:
        "Per-device health status — Chokes OK 100%, Flow Meter 95%, PWD WARN with badge counts.",
      icon: CheckCircle,
    },
    {
      id: "connection-log-proto",
      title: "Connection Log",
      description:
        "Protocol-level connection events — Modbus TCP connect, tag coverage, WITS reading status.",
      icon: FileText,
    },
  ],

  routing: [
    {
      id: "rig-plc-routing",
      title: "Rig PLC Routing",
      description:
        "PRIMARY (PLC) input data routing — Input Data: 10.1.0.113, Port 502, Modbus TCP toggle.",
      icon: Cpu,
    },
    {
      id: "output-channels",
      title: "Output Channels",
      description:
        "Single Loop Control with Tag Map — ChokeA_Pos → MPD SBP SS, ChokeB_PS, Choke_SP. SBIb Coop [End] → SBP_SSP.",
      icon: ArrowLeftRight,
    },
    {
      id: "dualq-control",
      title: "DualQ Control",
      description:
        "MPD Q in, iChoke_Q_0 Ga, SigmMemocer — Flow_Q-In, MPD Q in, Flow_Q_Out, Aux_Flow, MPD Q ux, MPD Q Set, MPD Q aex.",
      icon: Layers,
    },
    {
      id: "pwd-routing",
      title: "PWD Routing",
      description:
        "SECONDARY (PWD) routing — Snccon (Oy): WITS (TCP), Taj.1.0.33S, AFINSE output mapping.",
      icon: Radio,
    },
    {
      id: "add-routing-rule",
      title: "Add Routing Rule",
      description:
        "Create new input-to-output routing rules for tag mapping between sources and control channels.",
      icon: GitBranch,
    },
    {
      id: "live-health-routing",
      title: "Live Health (PLC)",
      description:
        "Last packet time 3 seconds ago, Latency 20 ms, Drop rate 1%, Messages/sec 75/sec.",
      icon: Wifi,
    },
    {
      id: "device-health-routing",
      title: "Device Health",
      description:
        "Chokes OK 100%, Flow Meter 99%/95%, PWD WARN — per-device health monitoring.",
      icon: CheckCircle,
    },
    {
      id: "connection-log-routing",
      title: "Connection Log",
      description:
        "Routing-level connection events — Chokes via Modbus TCP, Flow Meter tag coverage, PWD tag masking.",
      icon: FileText,
    },
  ],

  security: [
    {
      id: "rig-plc-auth",
      title: "Rig PLC Authentication",
      description:
        "PRIMARY (PLC) — EndPoint 10.1.0.113:502. Authentication: None, User/Pass, or Certificate (SSL).",
      icon: Cpu,
    },
    {
      id: "pwd-auth",
      title: "PWD Authentication",
      description:
        "SECONDARY (PWD) — EndOp authentication (Pnd). None, User/Pass, Certificate (SSL) with TGb/Eq aix options.",
      icon: Radio,
    },
    {
      id: "ssl-certificates",
      title: "SSL Certificates",
      description:
        "Manage TLS/SSL certificates for secure source connections — upload, renew, and revoke certificates.",
      icon: ShieldCheck,
    },
    {
      id: "user-pass-mgmt",
      title: "User / Password Management",
      description:
        "Configure per-source credentials, password rotation policies, and access control lists.",
      icon: Lock,
    },
    {
      id: "live-health-sec",
      title: "Live Health (PLC)",
      description:
        "Last packet time 3 seconds ago, Latency 20 ms, Drop rate 1%, Messages/sec 75/sec.",
      icon: Wifi,
    },
    {
      id: "device-health-sec",
      title: "Device Health",
      description:
        "Chokes OK 100%, Flow Meter 95%, PWD WARN — per-device health with tag count badges.",
      icon: CheckCircle,
    },
    {
      id: "connection-log-sec",
      title: "Connection Log",
      description:
        "Security-level events — Chokes connected via Modbus TCP, tag coverage, masking alerts.",
      icon: FileText,
    },
    {
      id: "failover-sim-sec",
      title: "Failover Simulation",
      description:
        "Toggle PLC offline / simulated data mode for security failover testing.",
      icon: ArrowLeftRight,
    },
  ],

  diagnostics: [
    {
      id: "quick-tests",
      title: "Quick Tests",
      description:
        "Ping PLC, TCP Port Test, Protocol Handshake Test, Tag Read Test, Clock Sync Check — one-click connectivity tests.",
      icon: Zap,
    },
    {
      id: "data-integrity",
      title: "Data Integrity Summary",
      description:
        "Tag coverage 95% (17/18), Missing tags: 1, Out-of-range tags: 3, Frozen signals: 2, Data rate: 94/100 ms.",
      icon: ScanLine,
    },
    {
      id: "jitter-drop",
      title: "Jitter / Drop Analysis",
      description:
        "Latency, Drop Rate (Bt8), Messages/sec charts with WARN/BIAS indicators and Show node toggle.",
      icon: TrendingDown,
    },
    {
      id: "advanced-tools",
      title: "Advanced Tools",
      description:
        "Enable Packet Capture (90 sec duration), Start capture, Export PCAP for deep network analysis.",
      icon: SearchCode,
    },
    {
      id: "critical-tags",
      title: "Critical Tags Watchlist",
      description:
        "Flow_In, Flow_Out, SBP, SPP, ChokeA_Pos, ChokeB_Pos, PWD_BHP — last value, timestamp, and status.",
      icon: Tag,
    },
    {
      id: "connection-log-diag",
      title: "Connection Log",
      description:
        "JPY Ø reachable Port 502, Modbus connected, Flow Meter out of range, WARN Shibul pessare vesk, PWD WITS reading.",
      icon: MessageSquare,
    },
    {
      id: "last-diag-results",
      title: "Last Diagnostic Results",
      description:
        "FAIL — PLC Modbus unresponsive, 5 critical lags missing, ChokeB_Pos out of range. Suggested actions.",
      icon: AlertTriangle,
    },
    {
      id: "suggested-actions",
      title: "Suggested Actions",
      description:
        "Check PLC port 502 reachable, Tag Rop retment: Flow_Fr_Flow_Out missing, Check PLC clock drift (+674 ms).",
      icon: CheckCircle,
    },
    {
      id: "diag-report",
      title: "Diagnostic Report",
      description:
        "Run Full Diagnostic and Export Report (PDF/CSV) — Report ID: DIAG-000128, last run: 06 Feb 2026 16:41.",
      icon: FileJson,
    },
  ],
};

const SIDEBAR_FOOTER = "Modified by adm.tirth | 06 Feb 2026 | 16:40";

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
      <CommonButton variant="outline" size="sm" icon={Activity}>
        Test Connections
      </CommonButton>
    </>
  );

  const activeNav = NETWORK_NAV.find((n) => n.id === activeSection);

  const sidebarNav = (
    <nav className="py-3 px-3 space-y-1">
      {NETWORK_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isOverview = (item as any).isOverview;
        return (
          <>
            <button
              key={item.id}
              onClick={() => navigate(`${ROUTES.NETWORK}/${item.id}`)}
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
              <Icon className={cn("shrink-0", isOverview ? "h-5 w-5" : "h-4 w-4")} />
              {item.label}
            </button>
            {isOverview && (
              <div className="mx-3 my-1 border-t border-border" />
            )}
          </>
        );
      })}
    </nav>
  );

  const cards = SECTION_CARDS[activeSection] ?? [];

  return (
    <PageLayout>
      <SidebarLayout
        sidebar={sidebarNav}
        sidebarFooter={
          <p className="text-[11px] text-muted-foreground">{SIDEBAR_FOOTER}</p>
        }
      >
        <PageHeaderBar
          icon={<NetworkIcon className="h-5 w-5" />}
          title={
            activeSection === "network"
              ? "Network"
              : `Network — ${activeNav?.label ?? ""}`
          }
          metadata="MPD: Silator  |  Profile: NFQ-21-6A"
          actions={headerActions}
        />

        <main className="flex-1 min-w-0 overflow-auto">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 items-start">
            {cards.map((card) => (
              <CategoryCard
                key={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon as any}
                onClick={() => {}}
              />
            ))}
          </div>
        </main>
      </SidebarLayout>
    </PageLayout>
  );
}
