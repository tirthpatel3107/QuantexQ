import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactECharts from "echarts-for-react";

// Components - Common
import {
  SectionSkeleton,
  FormSaveDialog,
  StatusBadge,
  CommonFormToggle,
} from "@/components/common";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { LiveSensorStrip } from "./LiveSensorStrip";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Services & API
import { useDisplayData, useSaveDisplayData } from "@/services/api/daq/daq.api";

// Types & Schemas
import {
  displayFormSchema,
  type DisplayFormValues,
} from "@/utils/schemas/display-schema";
import type { SaveDisplayPayload } from "@/services/api/daq/daq.types";

// Context
import { useDAQContext } from "@/context/DAQ";

/**
 * Display Component
 *
 * Main dashboard for real-time monitoring of DAQ sensors and parameters.
 * Features customizable panels with charts and validation statuses.
 *
 * @returns JSX.Element
 */
export function Display() {
  // ---- Data & State ----
  const { data: displayResponse, isLoading } = useDisplayData();
  const { mutate: saveDisplayData } = useSaveDisplayData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues: {
      sections: [],
    },
  });

  const { reset, control, handleSubmit } = formMethods;

  // ---- Sync form with fetched data ----
  useEffect(() => {
    if (displayResponse?.data && !hasSetInitial) {
      reset({ sections: displayResponse.data.sections });
      setHasSetInitial(true);
    }
  }, [displayResponse, hasSetInitial, reset]);

  // ---- Save Management ----
  const saveWithConfirmation = useSaveWithConfirmation<SaveDisplayPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveDisplayData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Display configuration saved",
    errorMessage: "Failed to save display configuration",
    confirmTitle: "Save Display Configuration",
    confirmDescription: "Accept changes to display panel visibility?",
  });

  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData as SaveDisplayPayload);
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

  // ---- Mock Chart Data ----
  const generateMockData = (count: number, base: number, variance: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      time: `${10 + i}:00`,
      value: base + (Math.random() - 0.5) * variance,
    }));
  };

  const chartData = useMemo(
    () => ({
      pressures: generateMockData(20, 1288, 50),
      flow: generateMockData(20, 600, 30),
      outFlow: generateMockData(20, 515, 20),
      turbing: generateMockData(20, 210, 5),
      largeTrend: generateMockData(50, 40, 60),
    }),
    [],
  );

  // ---- Loading State ----
  if (isLoading || !hasSetInitial) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="space-y-4 ">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {/* Row 1, Col 1: Pressures */}
            <PanelCard
              title="Pressures (psi)"
              headerAction={
                <CommonFormToggle
                  name="sections.0.enabled"
                  control={control}
                  label=""
                />
              }
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-2">SBP</p>
                    <div className="h-6 bg-slate-800/50 rounded-sm flex items-center px-2 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"
                        style={{ width: "75%" }}
                      />
                      <div className="h-0.5 w-full bg-slate-700/50 relative">
                        <div
                          className="absolute inset-y-0 left-0 bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]"
                          style={{ width: "75%" }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 text-[14px] text-muted-foreground uppercase tracking-wide">
                      HP High
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      1,288
                    </p>
                    <p className="text-[12px] text-muted-foreground uppercase font-semibold tracking-wider">
                      psi
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[14px] text-muted-foreground uppercase pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>HP High / Low</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Pressure</span>
                  </div>
                </div>
              </div>
            </PanelCard>

            {/* Row 1, Col 2: Flow */}
            <PanelCard
              title="Flow (gpm & ft/min)"
              headerAction={
                <CommonFormToggle
                  name="sections.1.enabled"
                  control={control}
                  label=""
                />
              }
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-2xl font-bold">600</p>
                    <p className="text-[14px] text-muted-foreground uppercase">
                      gpm
                    </p>
                    <div className="mt-2 text-[14px] text-muted-foreground uppercase">
                      HP High
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      515
                    </p>
                    <p className="text-[12px] text-muted-foreground uppercase font-semibold tracking-wider">
                      gpm
                    </p>
                  </div>
                </div>

                <div className="h-16 -mx-2">
                  <ReactECharts
                    option={{
                      grid: { top: 5, right: 10, bottom: 5, left: 10 },
                      xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: chartData.flow.map((d) => d.time),
                        show: false,
                      },
                      yAxis: { type: "value", show: false },
                      series: [
                        {
                          data: chartData.flow.map((d) => d.value),
                          type: "line",
                          smooth: true,
                          symbol: "none",
                          lineStyle: { width: 2, color: "#10b981" },
                          areaStyle: {
                            color: {
                              type: "linear",
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [
                                { offset: 0, color: "rgba(16,185,129,0.2)" },
                                { offset: 1, color: "rgba(16,185,129,0)" },
                              ],
                            },
                          },
                        },
                      ],
                    }}
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>

                <div className="flex items-center justify-between text-[14px] text-muted-foreground uppercase pt-1 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Set Point</span>
                  </div>
                </div>
              </div>
            </PanelCard>

            {/* Row 2, Col 1: Flow (In) */}
            <PanelCard title="Flow (gpm & ft/min)">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[14px] text-muted-foreground uppercase">
                    IN Flow
                  </span>
                  <span className="text-sm font-mono">600 gpm</span>
                </div>
                <div className="h-20 -mx-2">
                  <ReactECharts
                    option={{
                      grid: { top: 8, right: 15, bottom: 8, left: 15 },
                      xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: chartData.flow.map((_, i) => i),
                        axisLabel: { show: false },
                        axisLine: {
                          lineStyle: { color: "rgba(255,255,255,0.1)" },
                        },
                        splitLine: { show: false },
                      },
                      yAxis: {
                        type: "value",
                        axisLabel: { show: false },
                        axisLine: { show: false },
                        splitLine: { show: false },
                      },
                      series: [
                        {
                          data: chartData.flow.map((d) => d.value),
                          type: "line",
                          smooth: true,
                          symbol: "none",
                          lineStyle: { width: 2, color: "#06b6d4" },
                        },
                      ],
                    }}
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[14px] text-muted-foreground uppercase pt-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Set Point</span>
                  <span className="ml-auto">HP gpm</span>
                </div>
              </div>
            </PanelCard>

            {/* Row 2, Col 2: OUT Flow */}
            <PanelCard title="OUT Flow">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[14px] text-muted-foreground uppercase">
                    HP High
                  </span>
                  <span className="text-sm font-mono">515 gpm</span>
                </div>
                <div className="h-20 -mx-2">
                  <ReactECharts
                    option={{
                      grid: { top: 8, right: 15, bottom: 8, left: 15 },
                      xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: chartData.outFlow.map((_, i) => i),
                        axisLabel: { show: false },
                        axisLine: {
                          lineStyle: { color: "rgba(255,255,255,0.1)" },
                        },
                        splitLine: { show: false },
                      },
                      yAxis: {
                        type: "value",
                        axisLabel: { show: false },
                        axisLine: { show: false },
                        splitLine: { show: false },
                      },
                      series: [
                        {
                          data: chartData.outFlow.map((d) => d.value),
                          type: "line",
                          smooth: true,
                          symbol: "none",
                          lineStyle: { width: 2, color: "#6366f1" },
                        },
                      ],
                    }}
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[14px] text-muted-foreground uppercase pt-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Set Point</span>
                </div>
              </div>
            </PanelCard>

            {/* Row 3, Col 1: Turbing */}
            <PanelCard title="Turbing">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold mb-1">Temperature</p>
                    <p className="text-2xl font-bold">210</p>
                    <p className="text-[14px] text-muted-foreground uppercase">
                      °F
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                      210
                    </p>
                    <p className="text-[12px] text-muted-foreground uppercase font-semibold tracking-wider">
                      °F
                    </p>
                  </div>
                </div>
                <div className="h-16 -mx-2">
                  <ReactECharts
                    option={{
                      grid: { top: 5, right: 10, bottom: 5, left: 10 },
                      xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: chartData.turbing.map((_, i) => i),
                        show: false,
                      },
                      yAxis: { type: "value", show: false },
                      series: [
                        {
                          data: chartData.turbing.map((d) => d.value),
                          type: "line",
                          smooth: true,
                          symbol: "none",
                          lineStyle: { width: 2, color: "#ef4444" },
                        },
                      ],
                    }}
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[14px] text-muted-foreground uppercase pt-1 border-t border-border/50">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>GFection</span>
                  <span className="ml-auto">+ 0.61 °F /100ft</span>
                </div>
              </div>
            </PanelCard>

            {/* Row 3, Col 2: Large Chart */}
            <PanelCard
              title={
                <div className="flex items-center gap-2">
                  <span>Live Trend Analysis</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>
                </div>
              }
              className="lg:col-span-1"
            >
              <div className="h-40 -mx-2">
                <ReactECharts
                  option={{
                    grid: { top: 15, right: 15, bottom: 25, left: 35 },
                    xAxis: {
                      type: "category",
                      boundaryGap: false,
                      data: Array.from({ length: 50 }, (_, i) => {
                        const hour = Math.floor(i / 6);
                        return i % 6 === 0 ? `${1000 + hour * 200}` : "";
                      }),
                      axisLabel: {
                        fontSize: 9,
                        color: "rgba(255,255,255,0.4)",
                        interval: 5,
                      },
                      axisLine: {
                        lineStyle: { color: "rgba(255,255,255,0.1)" },
                      },
                      axisTick: { show: false },
                    },
                    yAxis: {
                      type: "value",
                      min: 0,
                      max: 800,
                      interval: 200,
                      splitLine: {
                        lineStyle: { color: "rgba(255,255,255,0.05)" },
                      },
                      axisLabel: {
                        fontSize: 9,
                        color: "rgba(255,255,255,0.4)",
                      },
                    },
                    series: [
                      {
                        data: chartData.largeTrend.map((d) => d.value),
                        type: "line",
                        smooth: true,
                        symbol: "none",
                        lineStyle: { width: 2, color: "#10b981" },
                        areaStyle: {
                          color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                              { offset: 0, color: "rgba(16,185,129,0.25)" },
                              { offset: 1, color: "rgba(16,185,129,0)" },
                            ],
                          },
                        },
                      },
                    ],
                  }}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
              <div className="text-[14px] text-muted-foreground text-center mt-1">
                Connected Depth: 6,140 ft
              </div>
            </PanelCard>
          </div>
          {/* Visual Live Strip Chart (Mockup Ref) */}
          <LiveSensorStrip />
        </div>
        <div className="grid grid-cols-1 gap-3">
          {/* Row 1, Col 3: MW In & Out */}
          <PanelCard title="MW In & Out (ppg)">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">MW In</span>
                <div className="text-right">
                  <span className="text-xl font-bold">12.4</span>
                  <span className="text-[14px] text-muted-foreground ml-1">
                    ppg
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">MW Out</span>
                <div className="text-right">
                  <span className="text-xl font-bold">12.4</span>
                  <span className="text-[14px] text-muted-foreground ml-1">
                    ppg
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/50">
                <span className="text-sm font-medium">BHP</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-cyan-400">6,186</span>
                  <span className="text-[14px] text-muted-foreground ml-1">
                    psi
                  </span>
                </div>
              </div>
            </div>
          </PanelCard>

          {/* Row 2, Col 3: Rotary / Drilling */}
          <PanelCard title="Rotary / Drilling">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Mean Rotary RPM
                </span>
                <div className="text-right">
                  <span className="text-base font-bold">125</span>
                  <span className="text-[14px] text-muted-foreground ml-1">
                    psi
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Weight on Bit
                </span>
                <div className="text-right">
                  <span className="text-base font-bold">28.5</span>
                  <span className="text-[14px] text-muted-foreground ml-1">
                    kbf
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ROP</span>
                <div className="text-right">
                  <span className="text-base font-bold">135</span>
                  <span className="text-[14px] text-muted-foreground ml-1">
                    ft/hr
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Methane</span>
                <div className="text-right">
                  <span className="text-base font-bold">0.00</span>
                  <span className="text-[14px] text-muted-foreground ml-1">
                    %
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">LGS</span>
                <div className="text-right">
                  <span className="text-base font-bold">8.3</span>
                  <span className="text-[14px] text-muted-foreground ml-1">
                    %
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">HGS</span>
                <div className="text-right">
                  <span className="text-base font-bold">9.5</span>
                  <span className="text-[14px] text-muted-foreground ml-1">
                    %
                  </span>
                </div>
              </div>
            </div>
          </PanelCard>

          {/* Row 3, Col 3: Validation Status */}
          <PanelCard title="Validation Status">
            <div className="space-y-3">
              {[
                { label: "MW Range", index: 3 },
                { label: "Phoology Range", index: 4 },
                { label: "Flow Sync (avg)", index: 5 },
                { label: "Gas Cut Status", index: 6 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>

                  <CommonFormToggle
                    name={`sections.${item.index}.enabled` as const}
                    control={control}
                    label=""
                  />
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Annular Friction Loss">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Calculated PB
                </span>
                <div className="text-right">
                  <span className="text-[14px] font-bold">6,186</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    psi
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Annular Friction
                </span>
                <div className="text-right">
                  <span className="text-[14px] font-bold">492</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    psi
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Circulating Flow in/Out
                </span>
                <div className="text-right">
                  <span className="text-[14px] font-bold">600 / 515</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    gpm
                  </span>
                </div>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Sensor Validation">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <p className="text-[14px] text-muted-foreground uppercase mb-1.5">
                  Surface Temp
                </p>
                <p className="text-xl font-bold">
                  85{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    °F
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[14px] text-muted-foreground uppercase mb-1.5">
                  Flowline Temp
                </p>
                <p className="text-xl font-bold">
                  85{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    °F
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[14px] text-muted-foreground uppercase mb-1.5">
                  Depth
                </p>
                <p className="text-xl font-bold text-green-400">
                  66,140{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    ft
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[14px] text-muted-foreground uppercase mb-1.5">
                  Turpanet
                </p>
                <p className="text-xl font-bold">
                  12.2{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    F/100ft
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[14px] text-muted-foreground uppercase mb-1.5">
                  CalcHzp Out
                </p>
                <p className="text-xl font-bold">
                  432{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    ft
                  </span>
                </p>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Save Dialog */}
      <FormSaveDialog form={saveWithConfirmation} />
    </div>
  );
}
