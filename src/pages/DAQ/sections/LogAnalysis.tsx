// React & Hooks
import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - UI & Icons
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  SectionSkeleton,
  FormSaveDialog,
  CommonButton,
  CommonFormToggle,
  CommonFormInput,
  CommonFormSelect,
} from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Filter, Download, Activity, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/utils/lib/utils";

// Services & Types
import {
  useLogAnalysisData,
  useSaveLogAnalysisData,
  useLogAnalysisOptions,
} from "@/services/api/daq/daq.api";
import type { SaveLogAnalysisPayload, LogEntry } from "@/services/api/daq/daq.types";

// Context
import { useDAQContext } from "../../../context/DAQ/DAQContext";

// Local Components
import { ChartPanel } from "@/components/dashboard/ChartPanel";

// Schema
const logAnalysisFormSchema = z.object({
  logResults: z.object({
    dataFilterLevel: z.string().min(1, "Filter level is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  }),
  trendAnalysis: z.object({
    period: z.string().min(1, "Period is required"),
    plots: z.object({
      sbp: z.boolean().default(true),
      spp: z.boolean().default(true),
      bhp: z.boolean().default(true),
      hlw: z.boolean().default(true),
    }),
  }),
  alertNotifyAnalysis: z.object({
    criticalAlerts: z.object({
      cb: z.number().default(0),
      ch: z.number().default(0),
      spp: z.number().default(0),
      sbpAccepted: z.number().default(0),
      arAlerts: z.number().default(0),
    }),
    alertPlotEnabled: z.boolean().default(true),
  }),
  responseTime: z.object({
    enabled: z.boolean().default(true),
    period: z.string().min(1, "Period is required"),
  }),
});

type LogAnalysisFormValues = z.infer<typeof logAnalysisFormSchema>;

export function LogAnalysis() {
  const { data: logAnalysisResponse, isLoading } = useLogAnalysisData();
  const { data: optionsResponse } = useLogAnalysisOptions();
  const { mutate: saveLogAnalysisData } = useSaveLogAnalysisData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = optionsResponse?.data;

  // Initialize form
  const formMethods = useForm<LogAnalysisFormValues>({
    resolver: zodResolver(logAnalysisFormSchema),
  });

  const { reset, control, handleSubmit } = formMethods;

  // Track if we have set initial data
  const [hasSetInitial, setHasSetInitial] = useState(false);

  useEffect(() => {
    const data = logAnalysisResponse?.data;
    if (data && !hasSetInitial) {
      const { logResults, trendAnalysis, alertNotifyAnalysis, responseTime } = data;
      reset({ logResults, trendAnalysis, alertNotifyAnalysis, responseTime });
      setHasSetInitial(true);
    }
  }, [logAnalysisResponse, hasSetInitial, reset]);

  // Handle save and confirmation
  const saveWithConfirmation = useSaveWithConfirmation<SaveLogAnalysisPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveLogAnalysisData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Log analysis settings saved successfully",
    errorMessage: "Failed to save log analysis settings",
    confirmTitle: "Save Log Analysis Settings",
    confirmDescription: "Are you sure you want to save these log analysis changes?",
  });

  // Attach context's save to RHF handleSubmit
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData as SaveLogAnalysisPayload);
    });

    registerSaveHandler(handleSave);
    return () => {
      unregisterSaveHandler();
    };
  }, [handleSubmit, registerSaveHandler, unregisterSaveHandler, saveWithConfirmation]);

  // Mock trend data - memoized to prevent re-generation on every render
  const mockTrendData = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        time: `${16 + Math.floor(i / 3)}:${(18 + i * 2) % 60}`,
        value: 20 + Math.random() * 20,
      })),
    [],
  );

  if (isLoading || !hasSetInitial || !logAnalysisResponse?.data) {
    return <SectionSkeleton count={6} />;
  }

  const logEntries = logAnalysisResponse.data.logEntries || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium":
        return "bg-warning/20 text-warning border-warning/30";
      case "low":
        return "bg-info/20 text-info border-info/30";
      case "info":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };


  return (
    <>
      <div className="space-y-4">
        {/* Log Results Panel */}
        <PanelCard
          title="Log Results"
          headerAction={
            <div className="flex gap-2">
              <CommonButton variant="outline" size="sm" icon={Filter}>
                Filter Dims
              </CommonButton>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Filter Inputs Row */}
            <div className="flex flex-wrap items-end gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
              <CommonFormInput
                name="logResults.dataFilterLevel"
                control={control}
                label="Data filtered to"
                placeholder="Level All"
                containerClassName="w-40"
              />
              <CommonFormInput
                name="logResults.startTime"
                control={control}
                label="Start time"
                placeholder="06 Feb 2026 | 16:18"
                containerClassName="flex-1"
              />
              <CommonFormInput
                name="logResults.endTime"
                control={control}
                label="End time"
                placeholder="06 Feb 2026 | 16:36"
                containerClassName="flex-1"
              />
              <div className="pb-0.5">
                 <CommonButton variant="secondary" size="sm">
                   Filter Logs
                 </CommonButton>
              </div>
            </div>

            {/* Log Table */}
            <div className="border border-border/50 rounded-md overflow-hidden">
              <div className="grid grid-cols-12 gap-3 bg-muted/50 px-4 py-3 text-sm font-bold text-muted-foreground border-b border-border/50">
                <div className="col-span-2">PROBLEM ID</div>
                <div className="col-span-2">PIGGING</div>
                <div className="col-span-1">TIME</div>
                <div className="col-span-7">MESSAGE</div>
              </div>

              <div className="divide-y divide-border/30 max-h-[300px] overflow-y-auto custom-scrollbar">
                {logEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-12 gap-3 px-4 py-2.5 hover:bg-accent/30 transition-colors items-baseline"
                  >
                    <div className="col-span-2">
                      <span
                        className={cn(
                          "inline-block px-1.5 py-0.5 rounded text-sm uppercase font-bold border",
                          getSeverityColor(entry.severity),
                        )}
                      >
                        {entry.problemId}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm font-medium text-muted-foreground">
                      {entry.pigging || "-"}
                    </div>
                    <div className="col-span-1 text-sm">{entry.time}</div>
                    <div className="col-span-7 text-sm text-foreground/90 leading-relaxed italic">
                      {entry.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Trend Analysis Panel */}
        <PanelCard 
          title="SBP (ps) Trend"
          headerAction={
            <div className="flex items-center gap-2">
              <CommonFormSelect
                name="trendAnalysis.period"
                control={control}
                options={options?.timeRangeOptions || []}
                className="w-48 my-0" // Removed h-8, added my-0
                triggerClassName="mt-0 h-9" // Added mt-0 and h-9 to match button sm size
              />
              <CommonButton variant="outline" size="sm" icon={Download}>
                Export Report
              </CommonButton>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
             <ChartPanel title="SBP (ps)" data={mockTrendData} color="hsl(var(--primary))" />
             <ChartPanel title="SPP (ps)" data={mockTrendData} color="hsl(var(--warning))" />
             <ChartPanel title="BHP (psi)" data={mockTrendData} color="hsl(var(--info))" />
             <ChartPanel title="HLW IN / Out (pp)" data={mockTrendData} color="hsl(var(--destructive))" />
          </div>
        </PanelCard>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-3">
           {/* Alert/Notify Analysis */}
           <div className="xl:col-span-3">
             <PanelCard 
                title="Alert/Notify Analysis"
             >
                <div className="space-y-4">
                   <div className="flex flex-wrap items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/40 min-h-[80px]">
                      {/* Critical Alerts Group */}
                      <div className="flex flex-col gap-2">
                         <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Critical Alerts</span>
                         <div className="flex gap-2.5">
                            <Badge variant="destructive" className="rounded-md gap-1.5 px-3 py-1 text-sm font-bold uppercase shadow-sm">
                               <AlertTriangle className="h-3.5 w-3.5" /> CB / {logAnalysisResponse.data.alertNotifyAnalysis.criticalAlerts.cb}
                            </Badge>
                            <Badge variant="secondary" className="rounded-md gap-1.5 px-3 py-1 text-sm font-bold uppercase border border-border/50">
                               CH / {logAnalysisResponse.data.alertNotifyAnalysis.criticalAlerts.ch}
                            </Badge>
                            <Badge variant="secondary" className="rounded-md gap-1.5 px-3 py-1 text-sm font-bold uppercase border border-border/50">
                               SPP / {logAnalysisResponse.data.alertNotifyAnalysis.criticalAlerts.spp}
                            </Badge>
                         </div>
                      </div>

                      <div className="h-10 w-px bg-border/40 mx-4 hidden lg:block" />

                      {/* SBP Accepted Group */}
                      <div className="flex flex-col gap-1 items-center md:items-start flex-1">
                         <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">SBP Accepted</span>
                         <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-success tracking-tight leading-none">
                               {logAnalysisResponse.data.alertNotifyAnalysis.criticalAlerts.sbpAccepted}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground/80 lowercase italic antialiased">
                               minted
                            </span>
                         </div>
                      </div>

                      <div className="h-10 w-px bg-border/40 mx-4 hidden lg:block" />

                      {/* AR: Alerts Group */}
                      <div className="flex flex-col gap-1 items-center md:items-start flex-1">
                         <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider whitespace-nowrap">AR: Alerts</span>
                         <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-warning tracking-tight leading-none">
                               {logAnalysisResponse.data.alertNotifyAnalysis.criticalAlerts.arAlerts}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground/80 antialiased">
                               Alert
                            </span>
                         </div>
                      </div>
                   </div>

                   <div className="relative">
                      <h4 className="text-sm font-bold mb-2">Alertt</h4>
                       <div className="bg-accent/10 rounded-lg border border-border/30 overflow-hidden relative">
                         <ChartPanel 
                            title="" 
                            data={mockTrendData} 
                            color="hsl(var(--warning))" 
                            threshold={{ value: 35, label: "DLIMIT EXCEEDED: ACTION NEEDED" }}
                             contentClassName="h-[235px]"
                         />
                      </div>
                   </div>
                </div>
             </PanelCard>
           </div>

           {/* Mean Response Time */}
           <div className="xl:col-span-2">
             <PanelCard 
                title="Mean Response Time"
                headerAction={
                   <CommonButton variant="outline" size="sm">
                      Export Timeline (CSV)
                   </CommonButton>
                }
             >
                <div className="flex flex-col h-full space-y-3">
                   <div className="flex-1">
                      <ChartPanel 
                        title="" 
                        data={mockTrendData} 
                        color="hsl(var(--info))" 
                        contentClassName="h-[310px]"
                      />
                   </div>
                   <div className="flex justify-between items-center text-sm text-muted-foreground px-2">
                      <span>History window: {logAnalysisResponse.data.responseTime.period}</span>
                      <span>Average: 30 min</span>
                   </div>
                </div>
             </PanelCard>
           </div>
        </div>
      </div>
      
      {/* FormSaveDialog needs the shape returned by useSaveWithConfirmation */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
