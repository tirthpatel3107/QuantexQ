import { useState, useEffect } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton, SectionSkeleton } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useLogAnalysisData,
  useSaveLogAnalysisData,
  useLogAnalysisOptions,
} from "@/services/api/daq/daq.api";
import type { SaveLogAnalysisPayload } from "@/services/api/daq/daq.types";

interface LogEntry {
  id: string;
  problemId: string;
  pigging: string;
  time: string;
  message: string;
  severity: "high" | "medium" | "low" | "info";
}

export function LogAnalysis() {
  const { data: logAnalysisResponse, isLoading, error } = useLogAnalysisData();
  const { data: optionsResponse } = useLogAnalysisOptions();
  const { mutate: saveLogAnalysisData } = useSaveLogAnalysisData();

  const logAnalysisData = logAnalysisResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<SaveLogAnalysisPayload | null>(null);

  // Initialize form data when logAnalysisData loads
  useEffect(() => {
    if (logAnalysisData) {
      const { logViewer, trendAnalysis, reportGeneration, logArchive } =
        logAnalysisData;
      setFormData({ logViewer, trendAnalysis, reportGeneration, logArchive });
    }
  }, [logAnalysisData]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveLogAnalysisPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveLogAnalysisData(newFormData);
  };

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

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading log analysis data</div>
    );
  }

  if (!logAnalysisData || !formData) {
    return <div className="p-4">No log analysis data available</div>;
  }

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
    </div>
  );
}
