import { useState, useEffect, useMemo, useContext } from "react";
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
import { StatRow } from "@/components/dashboard/StatRow";
import { SystemStatePanel } from "@/components/dashboard/SystemStatePanel";
import { LiveSensorStrip } from "./LiveSensorStrip";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Context
import { ThemeProviderContext } from "@/context/Theme";

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
  const { theme } = useContext(ThemeProviderContext);

  const [hasSetInitial, setHasSetInitial] = useState(false);

  // Determine if we're in dark mode
  const isDark = theme === "dark" || theme === "midnight";

  // Get accent color from CSS variable
  const [accentColor, setAccentColor] = useState("#10b981");

  useEffect(() => {
    const updateAccentColor = () => {
      const root = document.documentElement;
      const accentHsl = getComputedStyle(root)
        .getPropertyValue("--accent-color")
        .trim();
      if (accentHsl) {
        // Convert HSL to hex for ECharts
        const hslValues = accentHsl.split(" ");
        const h = parseFloat(hslValues[0]);
        const s = parseFloat(hslValues[1]) / 100;
        const l = parseFloat(hslValues[2]) / 100;

        // HSL to RGB conversion
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0,
          g = 0,
          b = 0;

        if (h >= 0 && h < 60) {
          r = c;
          g = x;
          b = 0;
        } else if (h >= 60 && h < 120) {
          r = x;
          g = c;
          b = 0;
        } else if (h >= 120 && h < 180) {
          r = 0;
          g = c;
          b = x;
        } else if (h >= 180 && h < 240) {
          r = 0;
          g = x;
          b = c;
        } else if (h >= 240 && h < 300) {
          r = x;
          g = 0;
          b = c;
        } else if (h >= 300 && h < 360) {
          r = c;
          g = 0;
          b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        setAccentColor(hex);
      }
    };

    updateAccentColor();

    // Listen for theme changes
    const observer = new MutationObserver(updateAccentColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });

    return () => observer.disconnect();
  }, [theme]);

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
      pressures: generateMockData(30, 1288, 50),
      pressuresLower: generateMockData(30, 800, 30),
      flow: generateMockData(30, 600, 30),
      outFlow: generateMockData(30, 515, 20),
      turbing: generateMockData(30, 210, 5),
      largeTrend: generateMockData(60, 400, 60),
    }),
    [],
  );

  // ---- Premium Chart Components ----
  const PremiumChart = ({
    data,
    color = accentColor,
    height = 80,
    showArea = true,
    lineType = "solid" as "solid" | "dashed" | "dotted",
    secondaryData,
    secondaryColor = "#f59e0b",
  }: {
    data: any[];
    color?: string;
    height?: number | string;
    showArea?: boolean;
    lineType?: "solid" | "dashed" | "dotted";
    secondaryData?: any[];
    secondaryColor?: string;
  }) => {
    const option = {
      animation: false,
      grid: { top: 10, right: 5, bottom: 10, left: 5 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        show: false,
      },
      yAxis: {
        type: "value",
        show: false,
        min: "dataMin",
        max: "dataMax",
      },
      series: [
        {
          data: data.map((d) => d.value),
          type: "line",
          smooth: true,
          symbol: "none",
          lineStyle: {
            width: 2.5,
            color: color,
            type: lineType,
            shadowBlur: 10,
            shadowColor: color + "66",
          },
          areaStyle: showArea
            ? {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: color + "4D" }, // 30% opacity
                    { offset: 1, color: color + "00" }, // 0% opacity
                  ],
                },
              }
            : undefined,
        },
        ...(secondaryData
          ? [
              {
                data: secondaryData.map((d) => d.value),
                type: "line",
                smooth: true,
                symbol: "none",
                lineStyle: {
                  width: 1.5,
                  color: secondaryColor,
                  type: "dashed",
                },
              },
            ]
          : []),
      ],
    };

    return (
      <ReactECharts
        option={option}
        style={{ height: height, width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    );
  };

  const LegendItem = ({
    color,
    label,
    value,
    unit,
  }: {
    color: string;
    label: string;
    value?: string | number;
    unit?: string;
  }) => (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="w-1.5 h-1.5 rounded-sm shrink-0 shadow-[0_0_5px_rgba(255,255,255,0.1)]"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-muted-foreground/80 uppercase tracking-tighter truncate font-bold">
        {label}
      </span>
      {value !== undefined && (
        <span className="ml-auto text-sm font-mono font-bold text-foreground/70">
          {value} {unit}
        </span>
      )}
    </div>
  );

  // ---- Loading State ----
  if (isLoading || !hasSetInitial) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="space-y-4 ">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {/* Row 1, Col 1: Pressures */}
            <PanelCard
              title={<span>Pressures </span>}
              headerAction={
                <div>
                  <span className="main-value">1,288</span>
                  <span className="text-sm text-muted-foreground ml-1 font-bold uppercase tracking-widest">
                    psi
                  </span>
                </div>
              }
            >
              <div className="chart-bg">
                <div className="flex justify-between items-start pt-1 px-1">
                  <div>
                    <h4 className="text-sm font-bold text-foreground/80 tracking-tight">
                      SBP
                    </h4>
                  </div>
                </div>

                <div className="h-36 mt-2 relative">
                  <PremiumChart
                    data={chartData.pressures}
                    secondaryData={chartData.pressuresLower}
                    color={accentColor}
                    secondaryColor="#f97316"
                    height="100%"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 px-1 py-2 mt-auto chart-border">
                  <LegendItem color={accentColor} label="HP High" />
                  <LegendItem color="#f97316" label="HP High / Low" />
                  <LegendItem color="#6b7280" label="Primure" />
                </div>
              </div>
            </PanelCard>

            {/* Row 3, Col 1: Turbing */}
            <PanelCard
              title={<span>Turbing</span>}
              headerAction={
                <div>
                  <span className="main-value">210</span>
                  <span className="text-sm text-muted-foreground ml-1 font-bold uppercase tracking-widest">
                    °F
                  </span>
                </div>
              }
            >
              <div className="chart-bg">
                <div className="flex justify-between items-start pt-1 px-1">
                  <h4 className="text-sm font-black text-muted-foreground uppercase tracking-tighter">
                    Temperature
                  </h4>
                </div>

                <div className="h-36 mt-2">
                  <PremiumChart
                    data={chartData.turbing}
                    color={accentColor}
                    height="100%"
                  />
                </div>

                <div className="flex items-center justify-between px-1 py-2 mt-auto chart-border">
                  <LegendItem color={accentColor} label="GFection" />
                  <span className="text-sm font-black text-foreground/50 tracking-tighter font-mono">
                    + 0.61 °F /100ft
                  </span>
                </div>
              </div>
            </PanelCard>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {/* Row 1, Col 2: Flow */}
            <PanelCard
              title={<span>Flow </span>}
              headerAction={
                <div>
                  <span className="main-value">515</span>
                  <span className="text-sm text-muted-foreground ml-1 font-bold uppercase tracking-widest">
                    gpm & ft/min
                  </span>
                </div>
              }
            >
              <div className="chart-bg">
                {/* <div className="flex justify-between items-start pt-1 px-1">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-foreground drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]">
                        600
                      </span>
                      <span className="text-sm text-muted-foreground font-bold uppercase">
                        gpm
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground uppercase font-black tracking-tighter mt-1">
                      HP High
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white tabular-nums drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)] leading-none">
                      515
                    </span>
                    <span className="text-sm text-muted-foreground ml-1 font-bold uppercase tracking-widest">
                      gpm
                    </span>
                  </div>
                </div> */}

                <div className="h-36 mt-2 relative">
                  <PremiumChart
                    data={chartData.flow}
                    color={accentColor}
                    height="100%"
                  />
                </div>

                <div className="px-1 py-2 mt-auto chart-border">
                  <LegendItem color={accentColor} label="Set Point" />
                </div>
              </div>
            </PanelCard>

            {/* Row 2, Col 1: Flow (In) */}
            <PanelCard
              title={<span>IN Flow </span>}
              headerAction={
                <div>
                  <span className="main-value">600</span>
                  <span className="text-sm text-muted-foreground ml-1 font-bold uppercase tracking-widest">
                    gpm & ft/min
                  </span>
                </div>
              }
            >
              <div className="chart-bg">
                <div className="h-36 mt-2">
                  <PremiumChart
                    data={chartData.flow}
                    color={accentColor}
                    height="100%"
                  />
                </div>

                <div className="flex items-center justify-between px-1 py-2 mt-auto chart-border">
                  <LegendItem color={accentColor} label="Set Point" />
                  <span className="text-sm font-black text-muted-foreground/60 uppercase tracking-tighter">
                    HP gpm
                  </span>
                </div>
              </div>
            </PanelCard>

            {/* Row 2, Col 2: OUT Flow */}
            <PanelCard
              title={<span>OUT Flow</span>}
              headerAction={
                <div>
                  <span className="main-value">515</span>
                  <span className="text-sm text-muted-foreground ml-1 font-bold uppercase tracking-widest">
                    gpm & ft/min
                  </span>
                </div>
              }
            >
              <div className="chart-bg">
                <div className="h-36 mt-2">
                  <PremiumChart
                    data={chartData.outFlow}
                    color={accentColor}
                    height="100%"
                  />
                </div>

                <div className="px-1 py-2 mt-auto chart-border">
                  <LegendItem color={accentColor} label="Set Point" />
                </div>
              </div>
            </PanelCard>

            {/* Row 3, Col 2: Large Chart */}
            <PanelCard
              title={
                <span className="uppercase tracking-tighter">
                  Live Trend Analysis
                </span>
              }
              className="lg:col-span-1"
            >
              <div className="chart-bg-light">
                <div className="h-36 mt-1 relative">
                  <ReactECharts
                    option={{
                      backgroundColor: "transparent",
                      grid: { top: 15, right: 15, bottom: 25, left: 35 },
                      xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: Array.from({ length: 50 }, (_, i) => {
                          const hour = Math.floor(i / 6);
                          return i % 6 === 0 ? `${1000 + hour * 200}` : "";
                        }),
                        axisLabel: {
                          fontSize: 11,
                          color: isDark
                            ? "rgba(255, 255, 255, 0.7)"
                            : "rgba(0, 0, 0, 0.6)",
                          fontFamily: "monospace",
                          interval: 5,
                        },
                        axisLine: {
                          lineStyle: {
                            color: isDark
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.2)",
                          },
                        },
                        axisTick: { show: false },
                      },
                      yAxis: {
                        type: "value",
                        min: 0,
                        max: 800,
                        interval: 200,
                        splitLine: {
                          lineStyle: {
                            color: isDark
                              ? "rgba(255, 255, 255, 0.15)"
                              : "rgba(0, 0, 0, 0.1)",
                            type: "dashed",
                          },
                        },
                        axisLabel: {
                          fontSize: 11,
                          color: isDark
                            ? "rgba(255, 255, 255, 0.7)"
                            : "rgba(0, 0, 0, 0.6)",
                          fontFamily: "monospace",
                        },
                      },
                      series: [
                        {
                          data: chartData.largeTrend.map((d) => d.value),
                          type: "line",
                          smooth: 0.4,
                          symbol: "none",
                          lineStyle: {
                            width: 3,
                            color: accentColor,
                            shadowBlur: 12,
                            shadowColor: `${accentColor}66`,
                          },
                          areaStyle: {
                            color: {
                              type: "linear",
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [
                                { offset: 0, color: `${accentColor}40` },
                                { offset: 1, color: `${accentColor}00` },
                              ],
                            },
                          },
                        },
                      ],
                    }}
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
                <div className="text-sm font-black text-muted-foreground/60 text-center mt-2 uppercase tracking-widest depth-info-bg py-1 rounded">
                  Connected Depth:{" "}
                  <span className="text-foreground">6,140</span> ft
                </div>
              </div>
            </PanelCard>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-3">
            {/* Visual Live Strip Chart (Mockup Ref) */}
            <LiveSensorStrip />

            {/* System State Panel */}
            <SystemStatePanel />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {/* Row 1, Col 3: MW In & Out */}
          <PanelCard title="MW In & Out (ppg)">
            <div className="space-y-2.5">
              <StatRow
                label="MW In"
                value="12.4"
                unit="ppg"
                valueClassName="text-lg"
              />
              <StatRow
                label="MW Out"
                value="12.4"
                unit="ppg"
                valueClassName="text-lg"
              />
              <StatRow
                label="BHP"
                value="6,186"
                unit="psi"
                valueClassName="text-lg"
              />
            </div>
          </PanelCard>

          {/* Row 2, Col 3: Rotary / Drilling */}
          <PanelCard title="Rotary / Drilling">
            <div className="space-y-3">
              <StatRow label="Mean Rotary RPM" value="125" unit="psi" />
              <StatRow label="Weight on Bit" value="28.5" unit="kbf" />
              <StatRow label="ROP" value="135" unit="ft/hr" />
              <StatRow label="Methane" value="0.00" unit="%" />
              <StatRow label="LGS" value="8.3" unit="%" />
              <StatRow label="HGS" value="9.5" unit="%" />
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
              <StatRow
                label="Calculated PB"
                value="6,186"
                unit="psi"
                labelClassName="text-sm"
              />
              <StatRow
                label="Annular Friction"
                value="492"
                unit="psi"
                labelClassName="text-sm"
              />
              <StatRow
                label="Circulating Flow in/Out"
                value="600 / 515"
                unit="gpm"
                labelClassName="text-sm"
              />
            </div>
          </PanelCard>

          <PanelCard title="Sensor Validation">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase mb-1.5">
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
                <p className="text-sm text-muted-foreground uppercase mb-1.5">
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
                <p className="text-sm text-muted-foreground uppercase mb-1.5">
                  Depth
                </p>
                <p className="text-xl font-bold">
                  66,140{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    ft
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase mb-1.5">
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
                <p className="text-sm text-muted-foreground uppercase mb-1.5">
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
