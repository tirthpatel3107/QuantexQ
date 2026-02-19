import {
  Monitor,
  Radio,
  Bell,
  BarChart3,
  Shield,
  Sliders,
  Droplets,
  Settings as SettingsIcon,
  Download,
  Activity,
} from "lucide-react";

export const DAQ_NAV = [
  { id: "daq", label: "DAQ", icon: Activity, isOverview: true },
  { id: "display", label: "Display", icon: Monitor },
  { id: "streaming", label: "Streaming & Logging", icon: Radio },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "log-analysis", label: "Log Analysis", icon: BarChart3 },
  { id: "sensor-perms", label: "Sensor Perms", icon: Shield },
  { id: "calibration", label: "Calibration", icon: Sliders },
  { id: "hydraulics", label: "Hydraulics Models", icon: Droplets },
  { id: "system-settings", label: "System Settings", icon: SettingsIcon },
  { id: "downloads", label: "Downloads", icon: Download },
];

import {
  Gauge,
  Waves,
  Thermometer,
  TrendingUp,
  Network,
  Database,
  Upload,
  AlertTriangle,
  Clock,
  Filter,
  FileText,
  Archive,
  Layers,
  CheckCircle,
  HardDrive,
} from "lucide-react";

export const SECTION_CARDS: Record<
  string,
  { id: string; title: string; description: string; icon: React.ElementType }[]
> = {
  daq: [
    {
      id: "ov-display",
      title: "Display",
      description:
        "Pressures, Flow, Densities, Tubing Temp, Annular Friction Loss, Rotary/Drilling, Sensor Validation.",
      icon: Monitor,
    },
    {
      id: "ov-streaming",
      title: "Streaming & Logging",
      description:
        "WITS Stream, EDR Logging, data rate & sampling, and live CSV/JSON export configuration.",
      icon: Radio,
    },
    {
      id: "ov-notifications",
      title: "Notifications",
      description:
        "Alarm rules, notification channels, escalation policies, and mute/suppression windows.",
      icon: Bell,
    },
    {
      id: "ov-log-analysis",
      title: "Log Analysis",
      description:
        "Log Viewer, Trend Analysis, Report Generation, and Log Archive management.",
      icon: BarChart3,
    },
    {
      id: "ov-sensor-perms",
      title: "Sensor Perms",
      description:
        "Permissions Assignment, Sensor Channel List, Default Permission Lists, Validate & Assign.",
      icon: Shield,
    },
    {
      id: "ov-calibration",
      title: "Calibration",
      description:
        "Sensor Calibration, Calibration History, Permissions, and Export Calibration Data.",
      icon: Sliders,
    },
    {
      id: "ov-hydraulics",
      title: "Hydraulics Models",
      description:
        "Models Used, Hydraulic Parameter Lists, Hydraulics Analysis, Friction Losses Summary.",
      icon: Droplets,
    },
    {
      id: "ov-system-settings",
      title: "System Settings",
      description:
        "DAQ Preset, Control Mode, System State, System Validation, Hardware Configuration.",
      icon: SettingsIcon,
    },
    {
      id: "ov-downloads",
      title: "Downloads",
      description:
        "Download DAQ Preset, View Logs, Quick Filter & Export, and Download History.",
      icon: Download,
    },
  ],
  display: [
    {
      id: "pressures",
      title: "Pressures (psi)",
      description:
        "SBP, CCH, standpipe pressure readings with HP High / Low thresholds and set-point tracking.",
      icon: Gauge,
    },
    {
      id: "flow",
      title: "Flow (gpm / ft/min)",
      description:
        "IN Flow, OUT Flow, BHP Flow with set-point and HP light indicators.",
      icon: Waves,
    },
    {
      id: "densities",
      title: "Densities (ppg)",
      description:
        "MW In, MW Out, LGS density readings with real-time trend charts.",
      icon: Droplets,
    },
    {
      id: "tubing",
      title: "Tubing Temperature",
      description:
        "Tubing temperature (°F) with ECD gradient and surface-to-bottom trend.",
      icon: Thermometer,
    },
    {
      id: "annular-friction",
      title: "Annular Friction Loss / Summary",
      description:
        "Calculated PB, Annular Friction Loss, Circulating Flow In / Out summary.",
      icon: TrendingUp,
    },
    {
      id: "rotary-drilling",
      title: "Rotary / Drilling",
      description:
        "Surface Temp, ROP, Methane %, LGS readings from the rotary drilling system.",
      icon: Activity,
    },
    {
      id: "mw-in-out",
      title: "MW In & Out (ppg)",
      description:
        "MW In, MW Out, BHP values with real-time ppg and psi readouts.",
      icon: Layers,
    },
    {
      id: "validation-status",
      title: "Validation Status",
      description:
        "MW Range, Photology Range, Flow Sync (avg), Gas Cut Status — OK / Warning indicators.",
      icon: CheckCircle,
    },
    {
      id: "sensor-validation",
      title: "Sensor Validation",
      description:
        "Weight on Bit, ROP, Surface Temp, Flow, Depth, Flowline Temp, Turgenets.",
      icon: Shield,
    },
  ],
  streaming: [
    {
      id: "wits-stream",
      title: "WITS Stream",
      description:
        "Configure WITS level 0/1 streaming endpoints, baud rate, and record mapping.",
      icon: Network,
    },
    {
      id: "edr-logging",
      title: "EDR Logging",
      description:
        "Electronic Drilling Recorder logging rate, channel selection, and export format.",
      icon: Database,
    },
    {
      id: "data-rate",
      title: "Data Rate & Sampling",
      description:
        "Set acquisition frequency (reads/s), buffer size, and downsampling rules.",
      icon: Activity,
    },
    {
      id: "live-export",
      title: "Live Export",
      description:
        "Real-time CSV / JSON export targets, FTP push, and cloud relay configuration.",
      icon: Upload,
    },
  ],
  notifications: [
    {
      id: "alarm-rules",
      title: "Alarm Rules",
      description:
        "Define threshold-based alarm triggers for pressure, flow, and density channels.",
      icon: AlertTriangle,
    },
    {
      id: "notification-channels",
      title: "Notification Channels",
      description:
        "Email, SMS, and in-app notification routing for critical and warning events.",
      icon: Bell,
    },
    {
      id: "escalation",
      title: "Escalation Policy",
      description:
        "Time-based escalation rules and on-call schedule integration.",
      icon: Clock,
    },
    {
      id: "mute-rules",
      title: "Mute & Suppression",
      description:
        "Suppress alarms during planned operations or maintenance windows.",
      icon: Filter,
    },
  ],
  "log-analysis": [
    {
      id: "log-viewer",
      title: "Log Viewer",
      description:
        "Browse, filter, and search historical DAQ logs by time range and channel.",
      icon: FileText,
    },
    {
      id: "trend-analysis",
      title: "Trend Analysis",
      description:
        "Multi-channel trend overlays with statistical annotations and anomaly detection.",
      icon: TrendingUp,
    },
    {
      id: "report-gen",
      title: "Report Generation",
      description:
        "Generate PDF / CSV reports for daily, shift, or custom time-range summaries.",
      icon: BarChart3,
    },
    {
      id: "log-archive",
      title: "Log Archive",
      description:
        "Manage archived log files, retention policies, and storage usage.",
      icon: Archive,
    },
  ],
  "sensor-perms": [
    {
      id: "permissions-assignment",
      title: "Permissions Assignment",
      description:
        "Assign Primary, Secondary, and Validation permissions to sensor channels.",
      icon: Shield,
    },
    {
      id: "sensor-list",
      title: "Sensor Channel List",
      description:
        "Depth, Gas Detector HP, SPP, Flowline Temp, Surface Temp, LGS, MW In/Out Density.",
      icon: Layers,
    },
    {
      id: "default-perm-lists",
      title: "Default Permission Lists",
      description:
        "Hydraulic and Perm Group defaults — Auto / Manual assignment rules.",
      icon: Database,
    },
    {
      id: "validate-assign",
      title: "Validate & Assign",
      description:
        "Run sensor permission validation and apply assignments across the active profile.",
      icon: CheckCircle,
    },
  ],
  calibration: [
    {
      id: "sensor-calibration",
      title: "Sensor Calibration",
      description:
        "Zero-point and span calibration for pressure, flow, and density sensors.",
      icon: Sliders,
    },
    {
      id: "calibration-history",
      title: "Calibration History",
      description:
        "View past calibration records, drift trends, and certification timestamps.",
      icon: Clock,
    },
    {
      id: "calibration-perms",
      title: "Calibration Permissions",
      description:
        "Control which users can perform or approve sensor calibration actions.",
      icon: Shield,
    },
    {
      id: "calibration-export",
      title: "Export Calibration Data",
      description:
        "Export calibration certificates and raw data for regulatory compliance.",
      icon: Download,
    },
  ],
  hydraulics: [
    {
      id: "models-used",
      title: "Models Used",
      description:
        "Active MW & Rheological Model (Locke-Milheim), Friction Loss Model, and Standing Pressure Model.",
      icon: Droplets,
    },
    {
      id: "hydraulic-params",
      title: "Hydraulic Parameter Lists",
      description:
        "Named parameter sets with Mud Out, Mud Type, Temp, and BBT values per well profile.",
      icon: Layers,
    },
    {
      id: "hydraulics-analysis",
      title: "Hydraulics Analysis",
      description:
        "EBT analysis charts — FB1, SPD Uses, PF ManUFD, SPN blemines with pressure plots.",
      icon: TrendingUp,
    },
    {
      id: "friction-losses",
      title: "Friction Losses Summary",
      description:
        "Calculated Ps, Circulated Flow, Annular Friction Loss, Circulating Flow In / Out.",
      icon: Activity,
    },
  ],
  "system-settings": [
    {
      id: "daq-preset",
      title: "DAQ Preset",
      description:
        "Active DAQ preset configuration — Master deGas and profile-level overrides.",
      icon: SettingsIcon,
    },
    {
      id: "control-mode",
      title: "Control Mode",
      description:
        "Manual / Auto control mode selection and MPD system state management.",
      icon: Sliders,
    },
    {
      id: "system-state",
      title: "System State",
      description:
        "Flow Control Mode, Depth, Choke Status, Gas Detector HP — real-time status.",
      icon: Activity,
    },
    {
      id: "system-validation",
      title: "System Validation",
      description:
        "DS, KOP, Surface Temp, Flowline Temp validation with OK / Warning indicators.",
      icon: CheckCircle,
    },
    {
      id: "hardware-config",
      title: "Hardware Configuration",
      description:
        "Sensor hardware mapping, I/O channel assignments, and device firmware info.",
      icon: HardDrive,
    },
  ],
  downloads: [
    {
      id: "download-daq-preset",
      title: "Download DAQ Preset",
      description:
        "Download the active DAQ preset XML file (e.g. Downloads_Preset_Master_deGas.xml).",
      icon: Download,
    },
    {
      id: "view-logs",
      title: "View Logs",
      description:
        "Filter and view logs by Last Hour, Last Day, Last Week, or Custom range.",
      icon: FileText,
    },
    {
      id: "quick-filter-export",
      title: "Quick Filter & Export",
      description:
        "Export to Preset, Logfile, or DAQ Summary in CSV / WITSML / IPF format.",
      icon: Filter,
    },
    {
      id: "download-history",
      title: "Download History",
      description:
        "Timestamped list of all previous downloads with filename and file size.",
      icon: Archive,
    },
  ],
};
