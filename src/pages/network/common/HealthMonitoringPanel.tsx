// React & Hooks
import { useState } from "react";

// Form & Validation

// Hooks

// Third-party

// Components - UI
import { Badge } from "@/components/ui/badge";

// Components - Common
import {
  CommonButton,
  CommonToggle,
  CommonCheckbox,
  StatusBadge,
} from "@/components/shared";

// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";

// Services & API

// Types & Schemas

// Contexts

// Utils & Constants
import {
  DEFAULT_HEALTH_METRICS,
  DEFAULT_DEVICE_HEALTH,
  DEFAULT_CONNECTION_LOGS,
  type HealthMonitoringPanelProps,
} from "@/utils/constants/healthMonitoring";

// Icons & Utils
import { Settings } from "lucide-react";


/**
 * HealthMonitoringPanel Component
 *
 * Provides a real-time sidebar/panel for monitoring system health, device status,
 * and connection logs. Supports simulation modes and diagnostic result display.
 *
 * @param props - Monitoring data and event handlers
 * @returns JSX.Element
 */
export function HealthMonitoringPanel({
  connectionStatus = "CONNECTED",
  liveHealthMetrics = DEFAULT_HEALTH_METRICS,
  deviceHealthItems = DEFAULT_DEVICE_HEALTH,
  connectionLogEntries = DEFAULT_CONNECTION_LOGS,
  showFailoverSimulation = true,
  showDiagnosticsResults = false,
  onFailoverChange,
  onDeviceSettingsClick,
}: HealthMonitoringPanelProps) {
  // ---- Data & State ----
  const [failoverSimulation, setFailoverSimulation] = useState(false);

  // ---- Event Handlers ----

  const handleFailoverChange = (checked: boolean) => {
    setFailoverSimulation(checked);
    onFailoverChange?.(checked);
  };

  // ---- Render Helpers ----

  /**
   * Returns Tailwind background color classes based on status string.
   */
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

  /**
   * Returns Tailwind background color classes for the status badges.
   */
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
          <StatusBadge status={connectionStatus} className="text-xs" />
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
            <div key={index} className="flex items-center justify-between py-1">
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
      {showDiagnosticsResults && (
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
              <div className="space-y-3">
                <CommonCheckbox
                  id="check-plc-port"
                  label="Check PLC port 502, reachable"
                />
                <CommonCheckbox
                  id="tag-map-segment"
                  label="Tag Map segment: Flow_Fr~Flow_Out missing"
                />
                <CommonCheckbox
                  id="check-clock-drift"
                  label="Check PLC clock drift (~ 574 ms)"
                />
              </div>
            </div>
          </div>
        </PanelCard>
      )}
    </>
  );
}
