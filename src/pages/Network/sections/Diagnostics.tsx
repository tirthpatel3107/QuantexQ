import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonToggle } from "@/components/common/CommonToggle";
import { Badge } from "@/components/ui/badge";
import { Settings, Play, FileDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function Diagnostics() {
  const [packetCaptureDuration, setPacketCaptureDuration] = useState("90");
  const [failoverSimulation, setFailoverSimulation] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Diagnostics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Profile: NFQ-21-6A
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CommonButton>Run Full Diagnostic</CommonButton>
          <CommonButton variant="outline" icon={FileDown}>
            Export Report
          </CommonButton>
          <CommonButton variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </CommonButton>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Tests */}
        <PanelCard title="Quick Tests">
          <div className="space-y-3">
            <QuickTestItem
              label="Ping PLC"
              detail="(Pg PLC 10.1.0.113:502)"
              status="success"
            />
            <QuickTestItem
              label="TCP Port Test"
              detail="(Pg PLC 10.1.1.13:502)"
              status="success"
            />
            <QuickTestItem label="Protocol Handshake Test" status="default" />
            <QuickTestItem
              label="Tag Read Test"
              detail="(Pg PLC 10.1.0.113)"
              status="fail"
            />
            <QuickTestItem
              label="Clock Sync Check"
              detail="(Pg PLC 16:39)"
              status="default"
            />
          </div>
        </PanelCard>

        {/* Data Integrity Summary */}
        <PanelCard title="Data Integrity Summary">
          <div className="space-y-4">
            <DataIntegrityRow
              label="Tag coverage:"
              value="95%"
              detail="(17 / 18)"
            />
            <DataIntegrityRow label="Missing tags:" value="1" badge="--" />
            <DataIntegrityRow label="Out-of-range tags:" value="3" badge="--" />
            <DataIntegrityRow label="Frozen signals:" value="2" />
            <DataIntegrityRow
              label="Data rate (current):"
              value="94 / 100 ms"
              badge="IDEAL"
              badgeVariant="success"
            />
          </div>
        </PanelCard>

        {/* Connection Log */}
        <PanelCard title="Connection Log">
          <div className="space-y-2 text-xs font-mono">
            <LogEntry
              icon="info"
              text="IPV 0, 10.1.0.113 reachable: Port 502 (succeed)"
              copyable
            />
            <LogEntry
              icon="info"
              text="IPV 0, 10.1.0.113 reachable: Modbus, connected"
            />
            <LogEntry
              icon="warning"
              text="Flow-Meter: 0.0.5, choke was out of range"
            />
            <LogEntry
              icon="warning"
              text="WARN: Sniput pressure was"
              badge="?"
            />
            <LogEntry
              icon="info"
              text="Pg PLC Clock: syncval +16 (inc better)"
              copyable
            />
            <LogEntry
              icon="info"
              text="PWD connected via: WITS, reading OR"
              copyable
            />
          </div>
        </PanelCard>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advanced Tools */}
        <PanelCard title="Advanced Tools">
          <div className="space-y-4">
            <div className="space-y-2">
              <CommonToggle
                id="packet-capture"
                label="Enable Packet Capture"
                checked={false}
                onCheckedChange={() => {}}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <CommonInput
                  type="number"
                  value={packetCaptureDuration}
                  onChange={(e) => setPacketCaptureDuration(e.target.value)}
                  suffix="sec"
                  className="w-24 mb-0"
                />
              </div>
              <div className="flex gap-2">
                <CommonButton size="sm" variant="outline" icon={Play}>
                  Start
                </CommonButton>
                <CommonButton size="sm" variant="outline" icon={FileDown}>
                  Export PCAP
                </CommonButton>
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Jitter / Drop Analysis */}
        <PanelCard
          title="Jitter / Drop Analysis"
          headerAction={
            <CommonButton variant="ghost" size="sm" className="text-xs">
              Show more
            </CommonButton>
          }
        >
          <div className="space-y-4">
            <MetricChart
              label="Latency"
              value="5 MIN"
              badge="WARN"
              badgeVariant="warning"
            />
            <MetricChart
              label="Drop Rate (RB)"
              value="Messages/sec:"
              badge="13 / sec"
            />
            <div className="pt-2">
              <MetricChart
                label="Latency"
                value="0.5 s"
                badge="WARN"
                badgeVariant="warning"
              />
              <MetricChart
                label="Drop Rate"
                value="<0%"
                badge="WARN"
                badgeVariant="warning"
              />
              <MetricChart
                label="Messages/sec: (RSS)"
                badge="GOOD"
                badgeVariant="success"
              />
            </div>
            <div className="flex gap-2 text-xs">
              <CommonButton variant="ghost" size="sm">
                Show more
              </CommonButton>
              <CommonButton variant="ghost" size="sm">
                Show notes
              </CommonButton>
            </div>
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
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Tags Watchlist */}
        <PanelCard title="Critical Tags Watchlist">
          <div className="space-y-2">
            <WatchlistItem
              tag="Flow_In"
              value="84 gpm"
              timestamp="12:42:54"
              status="warning"
            />
            <WatchlistItem
              tag="Flow_Out"
              value="--"
              timestamp="12:42:54"
              status="default"
            />
            <WatchlistItem
              tag="SBP"
              value="654 psi"
              timestamp="12:42:55"
              status="success"
            />
            <WatchlistItem
              tag="SPP"
              value="824 psi"
              timestamp="12:42:54"
              status="success"
            />
            <WatchlistItem
              tag="ChokeA_Pos"
              value="38 %"
              timestamp="12:42:54"
              status="success"
            />
            <WatchlistItem
              tag="ChokeB_Pos"
              value="62 %"
              timestamp="12:42:54"
              status="warning"
            />
            <WatchlistItem
              tag="PWD_BHP"
              value="---"
              timestamp=""
              status="default"
            />
          </div>
        </PanelCard>

        {/* Jitter / Drop Analysis (Second) */}
        <PanelCard
          title="Jitter / Drop Analysis"
          headerAction={
            <CommonButton variant="ghost" size="sm" className="text-xs">
              Show mask
            </CommonButton>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Latency</span>
              <Badge variant="secondary">500 MIN</Badge>
            </div>
            <div className="h-24 bg-muted/20 rounded flex items-center justify-center text-xs text-muted-foreground">
              [Chart Placeholder]
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Drop Rate</span>
              <Badge variant="secondary">&lt;0%</Badge>
            </div>
            <div className="h-24 bg-muted/20 rounded flex items-center justify-center text-xs text-muted-foreground">
              [Chart Placeholder]
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Messages/sec: (RSS)</span>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500 border-green-500/20"
              >
                GOOD
              </Badge>
            </div>
            <div className="flex gap-2 text-xs">
              <CommonButton variant="ghost" size="sm">
                Show more
              </CommonButton>
              <CommonButton variant="ghost" size="sm">
                Show notes
              </CommonButton>
            </div>
          </div>
        </PanelCard>

        {/* Failover Simulation */}
        <PanelCard title="Failover Simulation">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CommonToggle
                id="failover-sim"
                label=""
                checked={failoverSimulation}
                onCheckedChange={setFailoverSimulation}
              />
              <Badge variant={failoverSimulation ? "default" : "secondary"}>
                {failoverSimulation ? "ON" : "OFF"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              PLC Offline ~ Simulated data enabled
            </p>
            <CommonButton variant="outline" size="sm">
              Force Failover (Test)
            </CommonButton>
          </div>
        </PanelCard>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Report ID: DIAG-000128</span>
          <span>|</span>
          <span>Unused range | based at 10:42</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            ⚠ Unsaved changes
          </Badge>
          <span>Last modified at 12:42</span>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function QuickTestItem({
  label,
  detail,
  status = "default",
}: {
  label: string;
  detail?: string;
  status?: "success" | "fail" | "default";
}) {
  const statusColors = {
    success: "bg-green-500",
    fail: "bg-red-500",
    default: "bg-muted",
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
        <div className="flex flex-col">
          <span className="text-sm">{label}</span>
          {detail && (
            <span className="text-xs text-muted-foreground">{detail}</span>
          )}
        </div>
      </div>
      <CommonButton size="sm" variant="outline">
        Run
      </CommonButton>
    </div>
  );
}

function DataIntegrityRow({
  label,
  value,
  detail,
  badge,
  badgeVariant = "secondary",
}: {
  label: string;
  value: string;
  detail?: string;
  badge?: string;
  badgeVariant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "destructive";
}) {
  const getBadgeClassName = () => {
    if (badgeVariant === "success") {
      return "bg-green-500/10 text-green-500 border-green-500/20";
    }
    if (badgeVariant === "warning") {
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }
    return "";
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
        {detail && (
          <span className="text-xs text-muted-foreground">{detail}</span>
        )}
        {badge && (
          <Badge
            variant={
              badgeVariant === "success" || badgeVariant === "warning"
                ? "outline"
                : badgeVariant
            }
            className={cn("text-xs", getBadgeClassName())}
          >
            {badge}
          </Badge>
        )}
      </div>
    </div>
  );
}

function LogEntry({
  icon,
  text,
  badge,
  copyable,
}: {
  icon: "info" | "warning";
  text: string;
  badge?: string;
  copyable?: boolean;
}) {
  const iconColors = {
    info: "text-blue-500",
    warning: "text-orange-500",
  };

  return (
    <div className="flex items-start gap-2 py-1">
      <div className={cn("w-2 h-2 rounded-full mt-1", iconColors[icon])} />
      <span className="flex-1 text-muted-foreground">{text}</span>
      {badge && (
        <Badge variant="secondary" className="text-xs">
          {badge}
        </Badge>
      )}
      {copyable && (
        <button className="text-muted-foreground hover:text-foreground">
          <Copy className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function MetricChart({
  label,
  value,
  badge,
  badgeVariant = "secondary",
}: {
  label: string;
  value?: string;
  badge?: string;
  badgeVariant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "destructive";
}) {
  const getBadgeClassName = () => {
    if (badgeVariant === "success") {
      return "bg-green-500/10 text-green-500 border-green-500/20";
    }
    if (badgeVariant === "warning") {
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }
    return "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        {value && <span className="text-xs">{value}</span>}
      </div>
      {badge && (
        <Badge
          variant={
            badgeVariant === "success" || badgeVariant === "warning"
              ? "outline"
              : badgeVariant
          }
          className={cn("text-xs", getBadgeClassName())}
        >
          {badge}
        </Badge>
      )}
    </div>
  );
}

function WatchlistItem({
  tag,
  value,
  timestamp,
  status,
}: {
  tag: string;
  value: string;
  timestamp: string;
  status: "success" | "warning" | "default";
}) {
  const statusColors = {
    success: "text-green-500",
    warning: "text-orange-500",
    default: "text-muted-foreground",
  };

  const badgeVariants = {
    success: "bg-green-500/10 text-green-500",
    warning: "bg-orange-500/10 text-orange-500",
    default: "bg-muted text-muted-foreground",
  };

  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-mono">{tag}</span>
        <span className={cn("font-medium", statusColors[status])}>{value}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{timestamp}</span>
        <Badge className={cn("text-xs", badgeVariants[status])}>
          {status === "success"
            ? "CALC"
            : status === "warning"
              ? "WARN"
              : "Missing"}
        </Badge>
      </div>
    </div>
  );
}
