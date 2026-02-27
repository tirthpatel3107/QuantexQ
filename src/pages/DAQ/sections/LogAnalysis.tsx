import { useState, useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  CommonButton,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/common";
import { Filter } from "lucide-react";
import { cn } from "@/utils/lib/utils";
import {
  useLogAnalysisData,
  useSaveLogAnalysisData,
} from "@/services/api/daq/daq.api";
import type { SaveLogAnalysisPayload } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../../../context/DAQ/DAQContext";

interface LogEntry {
  id: string;
  problemId: string;
  pigging: string;
  time: string;
  message: string;
  severity: "high" | "medium" | "low" | "info";
}

export function LogAnalysis() {
  const { data: logAnalysisResponse, isLoading } = useLogAnalysisData();
  const { mutate: saveLogAnalysisData } = useSaveLogAnalysisData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const initialData = useMemo(() => {
    if (!logAnalysisResponse?.data) return undefined;
    const { logViewer, trendAnalysis, reportGeneration, logArchive } =
      logAnalysisResponse.data;
    return { logViewer, trendAnalysis, reportGeneration, logArchive };
  }, [logAnalysisResponse?.data]);

  const form = useSectionForm<SaveLogAnalysisPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveLogAnalysisData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Log analysis settings saved successfully",
    errorMessage: "Failed to save log analysis settings",
    confirmTitle: "Save Log Analysis Settings",
    confirmDescription:
      "Are you sure you want to save these log analysis changes?",
  });

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

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

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
    <>
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

      <FormSaveDialog form={form} />
    </>
  );
}
