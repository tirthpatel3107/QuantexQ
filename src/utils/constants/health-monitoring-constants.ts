export const DEFAULT_HEALTH_METRICS = [
  { label: "Last packet time:", value: "2 seconds ago" },
  { label: "Latency:", value: "19 ms" },
  { label: "Drop rate:", value: "0 %" },
  { label: "Uptime:", value: "99.9 %" },
  { label: "Clock drift:", value: "+10 ms ahead" },
];

export const DEFAULT_DEVICE_HEALTH = [
  {
    name: "Chokes",
    status: "OK",
    statusColor: "green" as const,
    badge: "Primary",
  },
  {
    name: "Flow Meter",
    status: "OK",
    statusColor: "green" as const,
    badge: "Secondary",
  },
  {
    name: "PWD",
    status: "OK",
    statusColor: "green" as const,
    badge: "Tertiary",
  },
  {
    name: "Network Interface",
    status: "WARNING",
    statusColor: "yellow" as const,
    badge: "Critical",
  },
];

export const DEFAULT_CONNECTION_LOGS = [
  {
    timestamp: "23 Apr | 14:56",
    message: "Chokes connected via Modbus TCP",
    badge: "Success",
  },
  {
    timestamp: "23 Apr | 14:55",
    message: "Flow meter initialized",
    badge: "Info",
  },
  {
    timestamp: "23 Apr | 14:54",
    message: "Network interface reset",
    badge: "Warning",
  },
];

export interface HealthMetric {
  label: string;
  value: string;
}

export interface DeviceHealthItem {
  name: string;
  status: string;
  statusColor: "green" | "yellow" | "orange" | "red";
  badge: string;
}

export interface ConnectionLogEntry {
  timestamp: string;
  message: string;
  badge?: string;
}

export interface HealthMonitoringPanelProps {
  connectionStatus?: "CONNECTED" | "DISCONNECTED" | "WARNING";
  liveHealthMetrics?: HealthMetric[];
  deviceHealthItems?: DeviceHealthItem[];
  connectionLogs?: ConnectionLogEntry[];
  onDeviceSettingsClick?: () => void;
  onRefreshClick?: () => void;
  onExportLogsClick?: () => void;
}
