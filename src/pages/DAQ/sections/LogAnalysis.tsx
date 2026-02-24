import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  problemId: string;
  pigging: string;
  time: string;
  message: string;
  severity: "high" | "medium" | "low" | "info";
}

export function LogAnalysis() {
  const [logEntries] = useState<LogEntry[]>([
    {
      id: "1",
      problemId: "SBP HIGH-RM",
      pigging: "SBP HIGH - ALARM",
      time: "16:34",
      message:
        "RECOMMEND: circulating or pit-monitoring or pit-monitoring clear",
      severity: "high",
    },
    {
      id: "2",
      problemId: "Cause MMS",
      pigging: "",
      time: "16:34",
      message: "Spit-restriction: ACTION NEEDED",
      severity: "medium",
    },
    {
      id: "3",
      problemId: "SBP D HIGH-HI",
      pigging: "",
      time: "16:36",
      message: "Sp limit-perception: ACTION NEEDED",
      severity: "medium",
    },
    {
      id: "4",
      problemId: "SBP FI: IME",
      pigging: "",
      time: "16:23",
      message: "FRICTIONS within handy thresholds",
      severity: "info",
    },
    {
      id: "5",
      problemId: "Partition Closed",
      pigging: "",
      time: "16:23",
      message: "Alarm history and telemetry idle for 2 hours",
      severity: "low",
    },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-900/40 text-red-300 border-red-500/30";
      case "medium":
        return "bg-amber-900/40 text-amber-300 border-amber-500/30";
      case "low":
        return "bg-blue-900/40 text-blue-300 border-blue-500/30";
      case "info":
        return "bg-slate-700/40 text-slate-300 border-slate-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Log Results Panel */}
      <PanelCard
        title="Log Results"
        headerAction={
          <CommonButton variant="outline" size="sm" icon={Filter}>
            Filter Dims
          </CommonButton>
        }
      >
        <div className="space-y-3">
          {/* Filter Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Data filtered to: Level All</span>
              <span>Start time: 06 Feb 2026 | 16:18</span>
              <span>End time: 06 Feb 2026 | 16:36</span>
            </div>
            <CommonButton variant="secondary" size="sm">
              Filter Logs
            </CommonButton>
          </div>

          {/* Log Table */}
          <div className="border border-border/50 rounded-md overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground border-b border-border/50">
              <div className="col-span-2">PROBLEM ID</div>
              <div className="col-span-2">Pigging</div>
              <div className="col-span-1">Time</div>
              <div className="col-span-7">Message</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border/30">
              {logEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-accent/30 transition-colors"
                >
                  <div className="col-span-2">
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-sm font-medium border",
                        getSeverityColor(entry.severity),
                      )}
                    >
                      {entry.problemId}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {entry.pigging}
                  </div>
                  <div className="col-span-1 text-sm">{entry.time}</div>
                  <div className="col-span-7 text-sm">{entry.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PanelCard>

      {/* Charts Section */}
      <PanelCard title="Charts">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* SBP (psi) Trend */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">SBP (psi) Trend</h3>
            </div>
            <div className="h-48 bg-muted/20 rounded border border-border/30 flex items-center justify-center">
              <div className="text-center text-muted-foreground text-sm">
                <div className="mb-2">Chart visualization</div>
                <div className="text-sm">
                  Period: 06 Feb 2026: 16:18 - 16:36
                </div>
              </div>
            </div>
          </div>

          {/* SPP (psi) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">SPP (psi)</h3>
            </div>
            <div className="h-48 bg-muted/20 rounded border border-border/30 flex items-center justify-center">
              <div className="text-center text-muted-foreground text-sm">
                <div className="mb-2">Chart visualization</div>
                <div className="text-sm">
                  Period: 06 Feb 2026: 16:18 - 16:36
                </div>
              </div>
            </div>
          </div>

          {/* BHP (psi) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">BHP (psi)</h3>
            </div>
            <div className="h-48 bg-muted/20 rounded border border-border/30 flex items-center justify-center">
              <div className="text-center text-muted-foreground text-sm">
                <div className="mb-2">Chart visualization</div>
                <div className="text-sm">
                  Period: 06 Feb 2026: 16:18 - 16:36
                </div>
              </div>
            </div>
          </div>

          {/* HLW In / Out (ppi) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">HLW In / Out (ppi)</h3>
            </div>
            <div className="h-48 bg-muted/20 rounded border border-border/30 flex items-center justify-center">
              <div className="text-center text-muted-foreground text-sm">
                <div className="mb-2">Chart visualization</div>
                <div className="text-sm">
                  Period: 06 Feb 2026: 16:18 - 16:36
                </div>
              </div>
            </div>
          </div>
        </div>
      </PanelCard>

      {/* Alert/Notify Analysis and Mean Response Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alert/Notify Analysis */}
        <PanelCard title="Alert/Notify Analysis">
          <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Critical Alerts:
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                    <span className="mr-1">✕</span> 1 Crit ✓
                  </Badge>
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                    2 Crit2 ✓
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                    2 SPP
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  SBP: ? Acceptable
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 bg-emerald-900/30 text-emerald-300 border-emerald-500/30"
                >
                  <span className="mr-1">✓</span> 2 minted
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  AR: Alerts
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 bg-amber-900/30 text-amber-300 border-amber-500/30"
                >
                  <span className="mr-1">⚠</span> 2 Alert
                </Badge>
              </div>
            </div>

            {/* Alert Chart */}
            <div>
              <h4 className="text-sm font-medium mb-3">Alertt</h4>
              <div className="h-52 bg-muted/20 rounded border border-border/30 relative p-4">
                {/* Y-axis labels */}
                <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-[9px] text-muted-foreground">
                  <span>4</span>
                  <span>30</span>
                  <span>20</span>
                  <span>0</span>
                </div>
                
                {/* Chart content */}
                <div className="ml-6 h-full flex flex-col justify-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    DLIMIT EXCEEDED RI-ACTION NEEDED!
                  </div>
                  
                  {/* Chart visualization placeholder */}
                  <div className="flex-1 flex items-center justify-center border-l border-b border-border/30 relative">
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-muted-foreground px-2 pb-1">
                      <span>10:00</span>
                      <span>10:00</span>
                      <span>20:00</span>
                      <span>10:00</span>
                      <span>20:00</span>
                      <span>20:00</span>
                      <span>30:00</span>
                      <span>30:00</span>
                      <span>30:00</span>
                    </div>
                  </div>
                  
                  {/* Mean Response Time Info */}
                  <div className="mt-2 space-y-0.5">
                    <div className="text-[10px] text-muted-foreground">
                      <span className="font-medium">MEAN Response Time:</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Average: <span className="text-foreground">84 timestamps sync:</span> Rank:
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      SBP HIGH-RI-ALRM Cleared
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Mean Response Time */}
        <PanelCard
          title="Mean Response Time"
          headerAction={
            <CommonButton variant="outline" size="sm" className="text-sm h-8">
              Export Timeline (CSV)
            </CommonButton>
          }
        >
          <div className="h-[400px] bg-muted/20 rounded border border-border/30 relative p-4">
            {/* Radar/Polar Chart Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-sm mb-2">No 1</div>
                <div className="w-48 h-48 rounded-full border-2 border-border/50 flex items-center justify-center mb-4">
                  <div className="text-[10px]">
                    Histogram/region<br />~ 50 mean
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                <span>GBL ECON Sensor Result</span>
                <span>~ 7 region</span>
                <span>Morris stage</span>
                <span>1~1</span>
                <span>Mim increase</span>
              </div>
            </div>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
