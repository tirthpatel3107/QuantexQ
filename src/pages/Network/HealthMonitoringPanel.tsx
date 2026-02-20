import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonToggle } from "@/components/common/CommonToggle";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

export interface HealthMetric {
  label: string;
  value: string;
}

export interface DeviceHealthItem {
  name: string;
  status: string;
  statusColor: "green" | "yellow" | "orange" | "red";
  percentage: string;
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
  connectionLogEntries?: ConnectionLogEntry[];
  showFailoverSimulation?: boolean;
  onFailoverChange?: (enabled: boolean) => void;
  onDeviceSettingsClick?: () => void;
}

export function HealthMonitoringPanel({
  connectionStatus = "CONNECTED",
  liveHealthMetrics = [
    { label: "Last packet time:", value: "2 seconds ago" },
    { label: "Latency:", value: "19 ms" },
    { label: "Drop rate:", value: "0 %" },
    { label: "Messages/sec:", value: "74 / sec" },
    { label: "Clock drift:", value: "+10 ms ahead" },
  ],
  deviceHealthItems = [
    {
      name: "Chokes",
      status: "OK",
      statusColor: "green",
      percentage: "100%",
      badge: "≤ 3",
    },
    {
      name: "Flow_Meter",
      status: "95%",
      statusColor: "yellow",
      percentage: "95%",
      badge: "≤ 3",
    },
    {
      name: "PWD",
      status: "WARN",
      statusColor: "orange",
      percentage: "PWD_BHP",
      badge: "≤ 1",
    },
  ],
  connectionLogEntries = [
    {
      timestamp: "23 Apr | 14:56",
      message: "Chokes connected via Modbus TCP",
    },
    { timestamp: "23 Apr | 14:47", message: "Flow Meter: Tag coverage 95%" },
    {
      timestamp: "23 Apr | 14:41",
      message: "Tag coverage 96% (1 missing):",
      badge: "PWD",
    },
  ],
  showFailoverSimulation = true,
  onFailoverChange,
  onDeviceSettingsClick,
}: HealthMonitoringPanelProps) {
  const [failoverSimulation, setFailoverSimulation] = useState(false);

  const handleFailoverChange = (checked: boolean) => {
    setFailoverSimulation(checked);
    onFailoverChange?.(checked);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return "bg-green-600";
      case "WARNING":
        return "bg-yellow-600";
      case "DISCONNECTED":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getDeviceStatusColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "orange":
        return "bg-orange-500";
      case "red":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDeviceBadgeColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-700/80";
      case "yellow":
        return "bg-yellow-700/80";
      case "orange":
        return "bg-orange-800/80";
      case "red":
        return "bg-red-700/80";
      default:
        return "bg-gray-700/80";
    }
  };

  return (
    <>
      {/* Live Health Card */}
      <PanelCard
        title="Live Health (PLC)"
        headerAction={
          <Badge
            variant="default"
            className={`text-xs ${getStatusBadgeColor(connectionStatus)}`}
          >
            {connectionStatus}
          </Badge>
        }
      >
        <div className="space-y-4">
          {liveHealthMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {metric.label}
              </span>
              <span className="text-sm font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      </PanelCard>

      {/* Device Health */}
      <PanelCard
        title="Device Health"
        headerAction={
          <CommonButton
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDeviceSettingsClick}
          >
            <Settings className="h-4 w-4" />
          </CommonButton>
        }
      >
        <div className="space-y-1">
          {deviceHealthItems.map((device, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${getDeviceStatusColor(device.statusColor)}`}
                />
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-medium">{device.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {device.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {device.percentage}
                </span>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded ${getDeviceBadgeColor(device.statusColor)}`}
                >
                  <div className="w-3 h-3 bg-white/20 rounded-sm" />
                  <span className="text-sm font-semibold text-white">
                    {device.badge.replace("≤ ", "")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PanelCard>

      {/* Connection Log */}
      <PanelCard title="Connection Log">
        <div className="space-y-3">
          {connectionLogEntries.map((entry, index) => (
            <div
              key={index}
              className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap"
            >
              <span>
                {entry.timestamp} · {entry.message}
              </span>
              {entry.badge && <Badge variant="secondary">{entry.badge}</Badge>}
            </div>
          ))}

          {showFailoverSimulation && (
            <>
              <hr className="my-4 border-border" />

              {/* Failover Simulation */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Failover Simulation</span>

                <CommonToggle
                  label={failoverSimulation ? "ON" : "OFF"}
                  checked={failoverSimulation}
                  onCheckedChange={handleFailoverChange}
                />
              </div>
            </>
          )}
        </div>
      </PanelCard>

      {/* Last Diagnostic Results */}
      <PanelCard title="Last Diagnostic Results">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-lg font-semibold text-red-500">FAIL</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>PLC Modbus unresponsive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>5 critical tags missing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>ChokeB_Pos out of range</span>
            </div>
          </div>

          <hr className="my-4" />

          <div>
            <h4 className="text-sm font-semibold mb-2">Suggested actions</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Check PLC port 502, reachable</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Tag Map segment: Flow_Fr~Flow_Out missing</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Check PLC clock drift (~ 574 ms)</span>
              </div>
            </div>
          </div>
        </div>
      </PanelCard>
    </>
  );
}
