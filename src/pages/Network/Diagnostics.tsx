// React & Hooks
import { useState, useEffect } from "react";

// Form & Validation
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - UI
import { Badge } from "@/components/ui/badge";
import ReactECharts from "echarts-for-react";

// Components - Common
import {
  CommonButton,
  SectionSkeleton,
  FormSaveDialog,
  CommonFormToggle,
  CommonFormSelect,
} from "@/components/shared";

// Components - Local
import { HealthMonitoringPanel } from "./common/HealthMonitoringPanel";
import { PanelCard } from "@/components/dashboard/PanelCard";

// Services & API
import {
  useDiagnosticsData,
  useSaveDiagnosticsData,
  useDiagnosticsOptions,
} from "@/services/api/network/network.api";

// Types & Schemas
import {
  diagnosticsFormSchema,
  MOCK_CHART_DATA,
  type DiagnosticsFormValues,
} from "@/utils/schemas/diagnostics";
import type { SaveDiagnosticsPayload } from "@/services/api/network/network.types";
import type { EChartsOption } from "echarts";

// Contexts
import { useNetworkContext } from "@/context/network";

// Icons & Utils
import { Play, FileDown } from "lucide-react";
import { cn } from "@/utils/lib/utils";

/**
 * Diagnostics Component
 *
 * Provides network diagnostic tools including ping tests, jitter/latency analysis,
 * packet capture, and data integrity summaries.
 *
 * @returns JSX.Element
 */
export function Diagnostics() {
  // ---- Data & State ----
  const { data: diagnosticsResponse, isLoading } = useDiagnosticsData();
  const { data: optionsResponse } = useDiagnosticsOptions();
  const { mutate: saveDiagnosticsData } = useSaveDiagnosticsData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const options = optionsResponse?.data;

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<DiagnosticsFormValues>({
    resolver: zodResolver(diagnosticsFormSchema),
    defaultValues: {
      packetCapture: {
        enabled: false,
        duration: "",
      },
      jitterAnalysis: {
        showMask: false,
      },
    },
  });

  const { reset, control, handleSubmit } = formMethods;
  const showMask = useWatch({ control, name: "jitterAnalysis.showMask" });

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded.
   */
  useEffect(() => {
    if (diagnosticsResponse?.data && !hasSetInitial) {
      const advTools = diagnosticsResponse.data.diagnosticTools.find(
        (t) => t.id === "adv-tools",
      );

      // Extract duration from description if present (MOCK data mapping)
      let duration = "90";
      if (advTools?.description) {
        const match = advTools.description.match(/(\d+) sec duration/);
        if (match) duration = match[1];
      }

      reset({
        packetCapture: {
          enabled: advTools?.status === "running",
          duration: duration,
        },
        jitterAnalysis: {
          showMask: false,
        },
      });
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setHasSetInitial(true), 0);
    }
  }, [diagnosticsResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   * Logic shared across network pages for consistent experience.
   */
  const saveWithConfirmation = useSaveWithConfirmation<DiagnosticsFormValues>({
    onSave: (data) => {
      // Map form values to API payload structure
      const payload: SaveDiagnosticsPayload = {
        diagnosticTools: [
          {
            id: "jitter-analysis",
            name: "Jitter & Latency",
            type: "jitter",
            description:
              "Real-time packet arrival analysis, dropped frame detection, and round-trip time.",
            status: "idle",
          },
          {
            id: "integrity-check",
            name: "Data Integrity Summary",
            type: "integrity",
            description:
              "Check sum validation, range clamping status, and stale data detection.",
            status: "idle",
          },
          {
            id: "adv-tools",
            name: "Advanced Tools",
            type: "advanced",
            description: `Enable Packet Capture (${data.packetCapture.duration} sec duration), Start capture, Export PCAP for deep network analysis.`,
            status: data.packetCapture.enabled ? "running" : "idle",
          },
          {
            id: "diag-report",
            name: "Diagnostic Report",
            type: "report",
            description:
              "Run Full Diagnostic and Export Report (PDF/CSV) — Report ID: DIAG-000128, last run: 06 Feb 2026 16:41.",
            status: "completed",
          },
        ],
      };

      return new Promise<void>((resolve, reject) => {
        saveDiagnosticsData(payload, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Diagnostics settings saved successfully",
    errorMessage: "Failed to save diagnostics settings",
    confirmTitle: "Save Diagnostics Settings",
    confirmDescription:
      "Are you sure you want to save these diagnostics changes?",
  });

  /**
   * Register the save handler with the NetworkContext.
   * Allows the global 'Save' button in the layout to trigger this form's submission.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData);
    });

    registerSaveHandler(handleSave);
    return () => {
      unregisterSaveHandler();
    };
  }, [
    handleSubmit,
    registerSaveHandler,
    unregisterSaveHandler,
    saveWithConfirmation,
  ]);

  if (isLoading || !hasSetInitial) {
    return <SectionSkeleton count={3} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-3 items-start">
        <div className="grid grid-cols-1 gap-3 items-start">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
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
                <QuickTestItem
                  label="Protocol Handshake Test"
                  status="default"
                />
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
                <DataIntegrityRow
                  label="Out-of-range tags:"
                  value="3"
                  badge="--"
                />
                <DataIntegrityRow label="Frozen signals:" value="2" />
                <DataIntegrityRow
                  label="Data rate (current):"
                  value="94 / 100 ms"
                  badge="IDEAL"
                  badgeVariant="success"
                />
              </div>
            </PanelCard>

            {/* Advanced Tools */}
            <PanelCard title="Advanced Tools">
              <div className="space-y-4">
                <div className="space-y-4">
                  <CommonFormToggle
                    name="packetCapture.enabled"
                    control={control}
                    label="Enable Packet Capture"
                  />
                  <div className="flex flex-col gap-1">
                    <CommonFormSelect
                      name="packetCapture.duration"
                      control={control}
                      label="Duration"
                      options={options?.durationOptions || []}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3 items-start">
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

            {/* Jitter / Drop Analysis (Consolidated) */}
            <PanelCard
              title="Jitter / Drop Analysis"
              headerAction={
                <CommonFormToggle
                  name="jitterAnalysis.showMask"
                  control={control}
                  label="Show mask"
                />
              }
            >
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <MetricChart
                    label="Latency"
                    value="5 MIN"
                    badge="WARN"
                    badgeVariant="warning"
                  />
                  <MetricChart
                    label="Latency"
                    value="0.5 s"
                    badge="WARN"
                    badgeVariant="warning"
                  />
                </div>
                <div className="space-y-4">
                  <MetricChart
                    label="Drop Rate (RB)"
                    value="13 / sec"
                    badge="WARN"
                    badgeVariant="warning"
                  />
                  <MetricChart
                    label="Drop Rate"
                    value="<0%"
                    badge="WARN"
                    badgeVariant="warning"
                  />
                </div>
                <div className="space-y-4 col-span-2">
                  <MetricChart
                    label="Messages/sec: (RSS)"
                    badge="GOOD"
                    badgeVariant="success"
                  />
                </div>
              </div>

              {/* Detailed Charts */}
              <div className="pt-4 border-t border-border/50">
                <div className="grid grid-cols-2 gap-4">
                  {/* Latency Chart */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground uppercase font-medium">
                        Latency
                      </span>
                      <Badge
                        variant="secondary"
                        className="h-4 px-1 text-[10px]"
                      >
                        500 MIN
                      </Badge>
                    </div>
                    <div className="h-[140px] bg-muted/5 rounded-md border border-border/10 overflow-hidden relative">
                      {showMask ? (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground bg-background/40 backdrop-blur-[2px]">
                          [Masked Chart View]
                        </div>
                      ) : (
                        <DiagnosticChart
                          color="hsl(var(--warning))"
                          data={MOCK_CHART_DATA.latency}
                        />
                      )}
                    </div>
                  </div>

                  {/* Drop Rate Chart */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground uppercase font-medium">
                        Drop Rate
                      </span>
                      <Badge
                        variant="secondary"
                        className="h-4 px-1 text-[10px]"
                      >
                        {"<0%"}
                      </Badge>
                    </div>
                    <div className="h-[140px] bg-muted/5 rounded-md border border-border/10 overflow-hidden relative">
                      {showMask ? (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground bg-background/40 backdrop-blur-[2px]">
                          [Masked Chart View]
                        </div>
                      ) : (
                        <DiagnosticChart
                          color="hsl(var(--warning))"
                          data={MOCK_CHART_DATA.dropRate}
                        />
                      )}
                    </div>
                  </div>

                  {/* Messages/sec Chart */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground uppercase font-medium">
                        Messages/sec
                      </span>
                      <Badge
                        variant="outline"
                        className="h-4 px-1 text-[10px] bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        GOOD
                      </Badge>
                    </div>
                    <div className="h-[140px] bg-muted/5 rounded-md border border-border/10 overflow-hidden relative">
                      {showMask ? (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground bg-background/40 backdrop-blur-[2px]">
                          [Masked Chart View]
                        </div>
                      ) : (
                        <DiagnosticChart
                          color="hsl(var(--success))"
                          data={MOCK_CHART_DATA.messages}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </PanelCard>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <HealthMonitoringPanel showDiagnosticsResults />
        </div>
      </div>

      {/* FormSaveDialog needs the shape returned by useSaveWithConfirmation */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
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
        <div className="flex gap-2 items-center">
          {value && <span className="text-xs">{value}</span>}
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

// --- Chart Support ---

function DiagnosticChart({
  data,
  color,
}: {
  data: { time: string; value: number }[];
  color: string;
}) {
  const option: EChartsOption = {
    grid: { top: 5, right: 10, bottom: 5, left: 10, containLabel: false },
    xAxis: {
      type: "category",
      show: false,
      data: data.map((d) => d.time),
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        data: data.map((d) => d.value),
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 1.5, color },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color },
              { offset: 1, color: "transparent" },
            ],
          },
          opacity: 0.1,
        },
      },
    ],
    animation: false,
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      opts={{ renderer: "svg" }}
    />
  );
}
