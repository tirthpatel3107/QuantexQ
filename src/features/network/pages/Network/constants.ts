import {
  Server,
  Cable,
  GitBranch,
  ShieldCheck,
  Microscope,
  Lock,
  Activity,
  Network as NetworkIcon,
} from "lucide-react";

export const NETWORK_NAV = [
  { id: "network", label: "Network", icon: NetworkIcon, isOverview: true },
  { id: "sources", label: "Sources", icon: Server },
  { id: "protocols", label: "Protocols", icon: Cable },
  { id: "routing", label: "Routing", icon: GitBranch },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "diagnostics", label: "Diagnostics", icon: Microscope },
];

import {
  Wifi,
  Cpu,
  Radio,
  ShieldAlert,
  CheckCircle,
  Zap,
  Database,
  ArrowLeftRight,
  Layers,
  ScanLine,
  MessageSquare,
  SearchCode,
  FileJson,
} from "lucide-react";

export const SECTION_CARDS: Record<
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
      title: "Rig PLC (Primary Source)",
      description:
        "Type: MODBUS TCP, IP: 192.168.1.50, Port: 502, Scan Rate: 100ms. Status: Connected.",
      icon: Server,
    },
    {
      id: "pwd-service",
      title: "PWD / LWD Service",
      description:
        "Type: WITSML 1.4.1, Endpoint: https://witsml.rig-01.com/server. Status: Validating.",
      icon: Wifi,
    },
    {
      id: "internal-sim",
      title: "Internal Simulator",
      description:
        "Virtual Rig Environment for training and testing. Status: Idle.",
      icon: Cpu,
    },
    {
      id: "custom-endpoint",
      title: "Custom UDP Stream",
      description: "Port: 4001, Mode: Listener. Status: Waiting for packet...",
      icon: Radio,
    },
  ],
  protocols: [
    {
      id: "p-modbus",
      title: "Modbus TCP",
      description:
        "Master/Slave config, register maps, byte ordering (Little/Big Endian).",
      icon: Cable,
    },
    {
      id: "p-witsml",
      title: "WITSML / ETP",
      description:
        "Store queries, object mapping (Well, Wellbore, Log, Rig, Trajectory).",
      icon: Database,
    },
    {
      id: "p-opcua",
      title: "OPC-UA",
      description:
        "Node discovery, subscription management, security policy (Sign & Encrypt).",
      icon: Zap,
    },
    {
      id: "p-mqtt",
      title: "MQTT / Sparkplug B",
      description:
        "Broker settings, Topic structure, Birth/Death certificates, Payload encoding.",
      icon: MessageSquare,
    },
  ],
  routing: [
    {
      id: "tag-mapping",
      title: "Tag Mapping",
      description:
        "Map source register tags to internal system variables (SBP, MW_IN, etc).",
      icon: ArrowLeftRight,
    },
    {
      id: "dualq-control",
      title: "DualQ Control",
      description:
        "Primary/Backup source switching logic with auto-failover thresholds.",
      icon: Layers,
    },
    {
      id: "slc-logic",
      title: "Single Loop Control",
      description:
        "Direct PID routing from sensor input to valve output with low latency.",
      icon: ScanLine,
    },
  ],
  security: [
    {
      id: "tls-mgmt",
      title: "TLS / SSL Management",
      description:
        "Install certificates, manage CA bundles, enforce minimum TLS 1.2/1.3.",
      icon: ShieldCheck,
    },
    {
      id: "auth-profiles",
      title: "Authentication Profiles",
      description:
        "Radius, LDAP, Local User/Pass, or JWT token-based source auth.",
      icon: Lock,
    },
    {
      id: "firewall-rules",
      title: "Internal Firewall",
      description:
        "IP Whitelisting, Port filtering, and Rate limiting per data source.",
      icon: ShieldAlert,
    },
  ],
  diagnostics: [
    {
      id: "jitter-analysis",
      title: "Jitter & Latency",
      description:
        "Real-time packet arrival analysis, dropped frame detection, and round-trip time.",
      icon: Activity,
    },
    {
      id: "integrity-check",
      title: "Data Integrity Summary",
      description:
        "Check sum validation, range clamping status, and stale data detection.",
      icon: CheckCircle,
    },
    {
      id: "adv-tools",
      title: "Advanced Tools",
      description:
        "Enable Packet Capture (90 sec duration), Start capture, Export PCAP for deep network analysis.",
      icon: SearchCode,
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
