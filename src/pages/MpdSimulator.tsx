import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Database,
  RotateCw,
  Play,
  Thermometer,
  Triangle,
  Menu,
  Maximize2,
  Ship,
  Monitor,
  LayoutTemplate,
  Minus,
  Plus,
  Gauge,
  Printer,
  Copy,
  Expand,
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PageHeaderBar,
  PageLayout,
  SidebarLayout,
  CommonButton,
  CommonDialog,
  CommonTooltip,
} from "@/components/common";
import { SegmentedBar } from "@/components/dashboard/SegmentedBar";
import { FlowControlStack } from "@/components/dashboard/FlowControlStack";
import { StatRow } from "@/components/dashboard/StatRow";

function Sidebar() {
  const icons = [
    { icon: Lock, label: "Lock" },
    { icon: Database, label: "Database" },
    { icon: RotateCw, label: "Refresh" },
    { icon: Play, label: "Play" },
    { icon: Thermometer, label: "Temperature" },
    { icon: Triangle, label: "Alert" },
    { icon: Triangle, label: "Warning" },
  ];

  return (
    <aside className="w-20 bg-[#0a0f1a] flex flex-col shrink-0">
      {/* Icon Buttons */}
      <div className="flex-1 flex flex-col items-start py-4 gap-2">
        {icons.map((item, i) => (
          <CommonTooltip key={i} content={item.label}>
            <CommonButton
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              icon={item.icon}
            />
          </CommonTooltip>
        ))}
      </div>
    </aside>
  );
}

// --- Specialized Charts ---

function SetpointTransitionChart({
  color = "#3b82f6",
  label,
}: {
  color: string;
  label: string;
}) {
  const option: EChartsOption = useMemo(
    () => ({
      grid: { top: 18, right: 10, bottom: 2, left: 24 },
      xAxis: {
        type: "category",
        show: false,
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        show: false,
        min: 0,
        max: 100,
      },
      series: [
        {
          data: [
            [0, 20],
            [30, 20],
          ],
          type: "line",
          smooth: false,
          symbol: "none",
          lineStyle: { width: 2, color, type: "dashed", opacity: 0.7 },
        },
        {
          data: [
            [30, 20],
            [50, 80],
          ],
          type: "line",
          smooth: true,
          symbol: "none",
          lineStyle: { width: 2, color },
        },
        {
          data: [
            [50, 80],
            [100, 80],
          ],
          type: "line",
          smooth: false,
          symbol: "none",
          lineStyle: { width: 2, color, type: "dashed", opacity: 0.7 },
          markPoint: {
            symbol: "rect",
            symbolSize: [4, 4],
            data: [{ coord: [100, 80] }],
            itemStyle: { color },
          },
        },
      ],
      animation: false,
    }),
    [color],
  );

  return (
    <div className="w-full h-[60px] relative">
      <div className="absolute top-0 left-0 text-[11px] font-semibold text-foreground/80 z-10">
        {label}
      </div>
      <div className="absolute bottom-2 left-0 text-[10px] text-muted-foreground font-mono z-10 w-8 text-right opacity-60">
        SP -
      </div>
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}

function SimulatorChart({
  color = "#3b82f6",
  dataPoints = 20,
  minY = 0,
  maxY = 1000,
  showRefLine = false,
  refLineValue = 500,
  seriesColors,
  seriesLabels,
  valueUnit,
  currentValues,
}: {
  color?: string;
  dataPoints?: number;
  minY?: number;
  maxY?: number;
  showRefLine?: boolean;
  refLineValue?: number;
  seriesColors?: string[];
  seriesLabels?: string[];
  valueUnit?: string;
  currentValues?: number[];
}) {
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined"
      ? !document.documentElement.classList.contains("light")
      : true,
  );

  useEffect(() => {
    if (
      typeof document === "undefined" ||
      typeof MutationObserver === "undefined"
    )
      return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "class") {
          setIsDark(!document.documentElement.classList.contains("light"));
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const times = useMemo(() => {
    const labels = [];
    const now = new Date();
    for (let i = 0; i < dataPoints; i++) {
      const time = new Date(now.getTime() - (dataPoints - i - 1) * 60000);
      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      labels.push(`${hours}:${minutes}`);
    }
    return labels;
  }, [dataPoints]);

  // Effective series colors and mock multi-series wave data (two traces resembling live signals)
  const effectiveSeriesColors = useMemo(
    () => (seriesColors && seriesColors.length > 0 ? seriesColors : [color]),
    [seriesColors, color],
  );

  const waveSeries = useMemo(() => {
    const totalRange = maxY - minY || 1;
    const count = Math.min(2, effectiveSeriesColors.length); // cap at 2 lines
    const allSeries: number[][] = [];

    for (let s = 0; s < count; s++) {
      const baseline = minY + ((s + 1) * totalRange) / (count + 1);
      const amplitude = totalRange * 0.12; // 12% of range around baseline
      const seriesData: number[] = [];

      for (let i = 0; i < dataPoints; i++) {
        const angle = (i / dataPoints) * Math.PI * (3 + s); // slightly different frequency per series
        const noise = Math.sin(i * 0.7 + s) * 0.03 * amplitude; // subtle pseudo-random variation
        const value = baseline + Math.sin(angle) * amplitude + noise;
        seriesData.push(Math.round(value));
      }

      allSeries.push(seriesData);
    }

    return allSeries.map((series, index) => {
      // If currentValues are provided, force the last point to match the specific series value
      if (currentValues && typeof currentValues[index] === "number") {
        series[series.length - 1] = currentValues[index];
      }
      return series;
    });
  }, [dataPoints, minY, maxY, effectiveSeriesColors, currentValues]);

  const axisColor = isDark ? "#E5E7EB" : "#111827";
  const gridColor = isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.06)";
  const tooltipBg = isDark ? "rgba(15,23,42,0.98)" : "#ffffff";
  const tooltipText = isDark ? "#F9FAFB" : "#020617";

  const option: EChartsOption = useMemo(
    () => ({
      grid: {
        top: 8,
        right: 12,
        bottom: 8,
        left: 36,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
          lineStyle: { color: axisColor, width: 1 },
        },
        backgroundColor: tooltipBg,
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        padding: [6, 10],
        textStyle: {
          color: tooltipText,
          fontSize: 11,
          fontFamily: "inherit",
        },
        renderMode: "html",
        formatter: (params: unknown) => {
          if (!Array.isArray(params) || params.length === 0) return "";
          const firstParam = params[0] as { axisValueLabel: string };
          const time = firstParam.axisValueLabel;
          let content = `<div style="font-weight:600;margin-bottom:4px;color:${tooltipText};font-size:12px;">${time}</div>`;

          (
            params as Array<{
              seriesIndex: number;
              seriesName: string;
              color: string;
              value: string | number;
            }>
          ).forEach((p) => {
            const idx = p.seriesIndex ?? 0;
            const label =
              seriesLabels?.[idx] ?? p.seriesName ?? `Series ${idx + 1}`;
            const colorDot = p.color;
            const unitSuffix = valueUnit ? ` ${valueUnit}` : "";

            content += `
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;color:${tooltipText};margin-bottom:2px;">
                <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                  <span style="display:inline-block;width:8px;height:8px;border-radius:999px;background:${colorDot};"></span>
                  <span style="opacity:0.85;white-space:nowrap;">${label}</span>
                </div>
                <span style="font-family:monospace;font-weight:600;white-space:nowrap;">${p.value}${unitSuffix}</span>
              </div>
            `;
          });

          return content;
        },
      },
      dataZoom: [
        {
          type: "inside",
          yAxisIndex: 0,
          filterMode: "none",
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
        },
      ],
      // Horizontal axis now represents the value, matching vertical charts on the main dashboard
      xAxis: {
        type: "value",
        min: minY,
        max: maxY,
        axisLine: { show: false },
        axisTick: { show: true, length: 3, lineStyle: { color: axisColor } },
        axisLabel: {
          show: true,
          color: axisColor,
          fontSize: 10,
          fontFamily: "Inter, system-ui, sans-serif",
          margin: 6,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: gridColor,
            width: 1,
            type: "solid" as const,
          },
        },
        scale: true,
      },
      // Vertical axis is time (categories), inverted so latest time is at the bottom
      yAxis: {
        type: "category",
        data: times,
        inverse: true,
        show: true,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: axisColor,
          fontSize: 10,
          fontFamily: "Inter, system-ui, sans-serif",
          margin: 6,
          interval: Math.max(1, Math.floor(dataPoints / 8)),
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: gridColor,
            width: 1,
            type: "solid" as const,
          },
        },
      },
      series: waveSeries.map((seriesData, index) => ({
        name: seriesLabels?.[index] ?? (index === 0 ? "Primary" : "Secondary"),
        type: "line",
        data: seriesData,
        symbol: "none",
        itemStyle: {
          color: effectiveSeriesColors[index] ?? color,
        },
        lineStyle: {
          color: effectiveSeriesColors[index] ?? color,
          width: 1.8,
        },
        smooth: 0.45,
        markLine:
          showRefLine && index === 1
            ? {
                symbol: ["none", "none"],
                animation: false,
                silent: true,
                lineStyle: {
                  type: "dashed" as const,
                  color: "#fff",
                  opacity: 0.6,
                  width: 1,
                },
                label: { show: false },
                data: [
                  {
                    xAxis: refLineValue,
                    label: { show: false },
                  },
                ],
              }
            : undefined,
      })),
      animation: false,
    }),
    [
      times,
      waveSeries,
      minY,
      maxY,
      showRefLine,
      refLineValue,
      color,
      axisColor,
      gridColor,
      tooltipBg,
      tooltipText,
      seriesLabels,
      valueUnit,
      dataPoints,
      effectiveSeriesColors,
    ],
  );

  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      opts={{ renderer: "svg" }}
    />
  );
}

// Custom Helper Components for Control Panel

function ArcGauge({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string;
}) {
  // 220 degree arc, opening downwards
  // radius 16
  const r = 16;
  const c = 2 * Math.PI * r;
  const arc = c * 0.6; // ~216 degrees
  const offset = arc - (value / 100) * arc;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-10 w-12 flex items-center justify-center">
        {/* Background Track */}
        <svg className="w-full h-full" viewBox="0 0 44 40">
          <circle
            cx="22"
            cy="22"
            r={r}
            fill="none"
            stroke="#1f2937"
            strokeWidth="3"
            strokeDasharray={`${arc} ${c}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(162 22 22)"
          />
          {/* Value Arc */}
          <circle
            cx="22"
            cy="22"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${arc} ${c}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(162 22 22)"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center -mt-2">
        <span className="text-[9px] font-bold text-slate-500 leading-tight">
          {label}
        </span>
        <span
          className={cn(
            "text-xs font-bold leading-tight",
            value === 0 ? "text-slate-500" : "text-white",
          )}
        >
          {value}%
        </span>
      </div>
    </div>
  );
}

function ControlPanel({
  showFlowControls,
  setShowFlowControls,
}: {
  showFlowControls: boolean;
  setShowFlowControls: (v: boolean) => void;
}) {
  return (
    <div className="h-[72px] bg-[#0C111F] border border-border/30 rounded-lg px-4 flex items-center shrink-0 backdrop-blur-sm z-10 font-sans shadow-[0_-4px_20px_rgba(0,0,0,0.4)] overflow-hidden select-none">
      {/* 1. Toggle & Flow Difference (Left) */}
      <div className="flex h-full items-center pl-2 pr-6 gap-4 bg-[#0C111F] border-r border-white/5 relative group shrink-0">
        {/* Toggle Button - Absolute left or flex */}
        <button
          onClick={() => setShowFlowControls(!showFlowControls)}
          className="h-full w-5 flex items-center justify-center hover:bg-white/5 transition-colors -ml-2 mr-1"
        >
          <div className="h-8 w-4 bg-[#0C1322] border border-white/10 rounded-r-md flex items-center justify-center">
            {showFlowControls ? (
              <Minus className="h-3 w-3 text-slate-500" />
            ) : (
              <Plus className="h-3 w-3 text-slate-500" />
            )}
          </div>
        </button>

        {/* Flow Difference Component */}
        <div className="flex items-center gap-4 w-[360px]">
          {/* Icon */}
          <div className="h-10 w-10 rounded-full bg-[#111] flex items-center justify-center border-2 border-[#1f2128] shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0 box-content">
            <div className="h-3 w-3 bg-slate-300 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
          </div>

          {/* Text & Bar */}
          <div className="flex-1 flex flex-col justify-center gap-1.5 pt-1">
            <div className="flex items-baseline justify-between w-full px-1">
              <span className="panel-title text-sm font-bold text-slate-400 tracking-wide">
                Flow Difference
              </span>
              {/* <span className="text-lg font-bold tabular-nums text-white leading-none antialiased"> */}
              <span className="font-bold tabular-nums text-primary flex-shrink-0 antialiased">
                0{" "}
                <span className="text-[14px] text-primary font-medium ml-0.5 antialiased">
                  gpm
                </span>
              </span>
            </div>
            {/* Bar */}
            <div className="h-2 w-full bg-[#0a0a0a] rounded-sm overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-white/5 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-500 z-10 shadow-[0_0_4px_rgba(255,255,255,0.2)]"></div>
              {/* Mock Indicator range */}
              <div className="absolute inset-y-0 left-[50%] w-[10%] bg-gradient-to-r from-slate-600 to-slate-500/50 opacity-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gauges (Middle) */}
      <div className="flex items-center gap-5 px-6 border-r border-white/5 h-full bg-[#0C111F] shrink-0">
        <div className="flex gap-4">
          <ArcGauge value={0} label="Choke A" color="#60a5fa" />
          <ArcGauge value={100} label="Choke B" color="#eab308" />
        </div>

        {/* Arrow & Limit Indicator */}
        <div className="flex flex-col gap-1.5 w-28 opacity-80 pt-1">
          {/* Arrow Line */}
          <div className="h-[2px] w-full bg-[#1f2937] relative mt-1">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-0 border-y-[3px] border-y-transparent border-r-[6px] border-r-[#eab308]" />
          </div>
          {/* Bar */}
          <div className="h-2.5 w-full bg-[#0f1115] rounded-[1px] border border-white/5 overflow-hidden flex">
            <div className="w-[85%] h-full bg-[#1f2937]" />
            <div className="w-[15%] h-full bg-[#eab308]" />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-slate-500 font-bold px-0.5">
            <span>100%</span>
            <span>107%</span>
          </div>
        </div>
      </div>

      {/* 3. Auto Controls (Right) */}
      <div className="flex-1 flex flex-col justify-center gap-2.5 px-6 min-w-0">
        {/* Auto Control Row */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 text-right shrink-0">
            AUTO CONTROL
          </span>
          <div className="flex-1 h-4 bg-[#0a0a0c] rounded-[1px] border border-white/5 p-[1px]">
            <SegmentedBar count={60} fillCount={0} emptyColor="bg-[#15171e]" />
          </div>
          <span className="text-[9px] font-mono text-slate-700 font-bold shrink-0 w-24 text-right">
            Hi/Day / AAC p
          </span>
        </div>

        {/* Auto Detection Row */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28 text-right shrink-0">
            AUTO DETECTION
          </span>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-xs font-bold text-cyan-400 ml-1 w-6 shrink-0">
              ON
            </span>
            <div className="flex-1 h-4 bg-[#0a0a0c] rounded-[1px] border border-white/5 p-[1px]">
              <SegmentedBar
                count={60}
                fillCount={18}
                color="bg-[#4b5563]"
                emptyColor="bg-[#15171e]"
              />
            </div>
          </div>

          <div className="ml-auto flex gap-2 items-center shrink-0 w-24 justify-end">
            <span className="text-[9px] font-mono text-slate-700 font-bold">
              1600
            </span>
            <span className="text-[9px] font-mono text-slate-700 font-bold">
              Tria
            </span>
            <span className="bg-[#111] border border-white/10 px-1.5 py-0.5 rounded-[2px] text-white font-bold text-[10px] font-mono min-w-[28px] text-center">
              155
            </span>
            <span className="text-[9px] font-mono text-slate-600 font-bold">
              ppm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function MpdSimulator() {
  const [showFlowControls, setShowFlowControls] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const headerActions = (
    <div className="flex items-center gap-1">
      <CommonTooltip content="Ship view">
        <CommonButton
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          icon={Ship}
        />
      </CommonTooltip>
      <CommonTooltip content="Monitor view">
        <CommonButton
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          icon={Monitor}
        />
      </CommonTooltip>
      <CommonTooltip content="Layout template">
        <CommonButton
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          icon={LayoutTemplate}
        />
      </CommonTooltip>
    </div>
  );

  return (
    <PageLayout className="pt-14">
      {/* <SidebarLayout> */}
      <div className="px-4 py-4">
        <PageHeaderBar
          icon={<Gauge className="h-5 w-5 text-primary-foreground" />}
          title="MPD Simulator"
          metadata={
            <div className="flex items-center gap-6">
              <span className="text-sm">
                SBP: <span className="font-bold">750 psi</span>
              </span>
              <span className="flex items-center gap-2 text-sm text-cyan-400">
                <RotateCw className="h-3.5 w-3.5 animate-spin" />
                Simulation
              </span>
            </div>
          }
          className="p-2"
          actions={headerActions}
        />
      </div>

      <div className="flex flex-col h-[calc(100vh-theme(spacing.1))] bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20">
        {/* <SimulatorHeader /> */}

        <div className="flex flex-1 min-h-0 relative px-4 pb-4">
          {/* <Sidebar /> */}

          <main className="flex-1 flex flex-col min-w-0 bg-background">
            {/* Top Grid Area */}
            <div className="flex-1 grid grid-cols-5 gap-4 py-4 pt-2 min-h-0 overflow-visible relative">
              {/* Wallpaper / Grid lines effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  // backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Col 1: Flow */}
              <div className="group flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden transition-all duration-200 hover:border-primary/60 hover:shadow-lg hover:-translate-y-[2px]">
                <div className="panel-header flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CommonTooltip content="Expand flow panel">
                      <CommonButton
                        variant="ghost"
                        size="icon"
                        onClick={() => setExpandedCard("flow")}
                        className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary cursor-pointer hover:bg-primary/25"
                        aria-label="Flow panel actions"
                      >
                        <Gauge
                          className="h-4 w-4 transition-opacity group-hover:opacity-0"
                          aria-hidden
                        />
                        <Maximize2
                          className="absolute h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      </CommonButton>
                    </CommonTooltip>
                    <span className="panel-title truncate">Flow</span>
                  </div>
                </div>
                <div className="p-4 pt-3 pb-6 border-b border-border/30">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <StatRow label="Flow In" value="580" unit="gpm" />
                    <StatRow
                      label="Flow Out"
                      value="596"
                      unit="gpm"
                      highlight
                    />
                  </div>
                  <div className="mt-8 text-[10px] text-muted-foreground flex items-center gap-2 opacity-60">
                    <span>High Limit</span>
                    <div className="flex-1 border-b border-dashed border-muted-foreground/50"></div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 p-4 flex flex-col relative gap-4">
                  {/* Setpoint Transition Component */}
                  <SetpointTransitionChart
                    label="Flow Difference"
                    color="#3b82f6"
                  />

                  {/* Main Chart */}
                  <div className="flex-1 min-h-0 -ml-2 pb-4">
                    <SimulatorChart
                      color="#21d5ed"
                      seriesColors={["#21d5ed", "#f59f0a"]}
                      seriesLabels={["Flow In", "Flow Out"]}
                      valueUnit="gpm"
                      minY={0}
                      maxY={1000}
                      currentValues={[580, 596]}
                    />
                  </div>

                  {/* Value Badges */}
                  <div className="px-2 pt-1.5 pb-2 flex flex-wrap gap-1.5 justify-center">
                    {[
                      { label: "Flow In", value: "580", unit: "gpm" },
                      { label: "Flow Out", value: "596", unit: "gpm" },
                    ].map((m, i) => {
                      const badgeBgColors = ["#21d5ed", "#f59f0a"] as const;
                      const isLastBadge = i % 2 === 2; // Keep logic simple or just rely on index
                      const bgColor = badgeBgColors[i % badgeBgColors.length];

                      const tooltipText = m.label ?? "";

                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                "inline-flex min-w-0 flex-shrink items-center rounded border border-transparent px-1.5 py-0.5 text-[10px] tabular-nums overflow-hidden cursor-default font-bold antialiased",
                                isLastBadge
                                  ? "bg-black text-white dark:bg-white dark:text-black"
                                  : "text-black",
                              )}
                              style={
                                bgColor != null
                                  ? { backgroundColor: bgColor }
                                  : undefined
                              }
                            >
                              <span className="min-w-0 truncate font-bold">
                                {m.value}
                              </span>
                              {m.unit != null && m.unit !== "" && (
                                <span
                                  className="ml-0.5 shrink-0 font-bold"
                                  style={{ opacity: 0.8 }}
                                >
                                  {m.unit}
                                </span>
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltipText}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>

                  {/* Integrated Flow Column Stack - overlay positioned */}
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 z-20 pb-2 px-2 transition-all duration-300 ease-in-out transform flex flex-col justify-end pointer-events-none",
                      showFlowControls
                        ? "translate-y-0 opacity-100 bg-[#0C1322]"
                        : "translate-y-8 opacity-0",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-black/60 backdrop-blur-sm border-t border-white/5 rounded-t-sm shadow-2xl pt-2 -mx-2 px-2 pb-2",
                        showFlowControls
                          ? "pointer-events-auto"
                          : "pointer-events-none",
                      )}
                    >
                      <FlowControlStack />
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 2: Density */}
              <div className="group flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden transition-all duration-200 hover:border-primary/60 hover:shadow-lg hover:-translate-y-[2px]">
                <div className="panel-header flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CommonTooltip content="Expand density panel">
                      <button
                        type="button"
                        onClick={() => setExpandedCard("density")}
                        className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary cursor-pointer focus:outline-none focus:bg-primary/25 focus:ring-2 focus:ring-primary/40 focus:ring-inset"
                        aria-label="Density panel actions"
                      >
                        <Thermometer
                          className="h-4 w-4 transition-opacity group-hover:opacity-0"
                          aria-hidden
                        />
                        <Maximize2
                          className="absolute h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      </button>
                    </CommonTooltip>
                    <span className="panel-title truncate">Density</span>
                  </div>
                </div>
                <div className="p-4 pt-3 pb-6 border-b border-border/30">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <StatRow label="Density In" value="12.6" unit="ppg" />
                    <StatRow
                      label="Density Out"
                      value="12.51"
                      unit="ppg"
                      highlight
                    />
                  </div>
                  <div className="mt-8 text-[10px] text-muted-foreground flex items-center gap-2 opacity-60">
                    <span>High Limit</span>
                    <div className="flex-1 border-b border-dashed border-muted-foreground/50"></div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 p-4 flex flex-col relative gap-4">
                  {/* Setpoint Transition Component */}
                  <SetpointTransitionChart label="Density" color="#eab308" />

                  {/* Main Chart */}
                  <div className="flex-1 min-h-0 -ml-2 pb-4">
                    <SimulatorChart
                      color="#21d5ed"
                      seriesColors={["#21d5ed", "#f59f0a"]}
                      seriesLabels={["Density In", "Density Out"]}
                      valueUnit="ppg"
                      minY={0}
                      maxY={800}
                    />
                  </div>

                  {/* Value Badges */}
                  <div className="px-2 pt-1.5 pb-2 flex flex-wrap gap-1.5 justify-center">
                    {[
                      { label: "Density In", value: "12.6", unit: "ppg" },
                      { label: "Density Out", value: "12.51", unit: "ppg" },
                    ].map((m, i) => {
                      const badgeBgColors = ["#21d5ed", "#f59f0a"] as const;
                      const isLastBadge = i % 3 === 2;
                      const bgColor = isLastBadge
                        ? undefined
                        : badgeBgColors[i % badgeBgColors.length];

                      const tooltipText = m.label ?? "";

                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                "inline-flex min-w-0 flex-shrink items-center rounded border border-transparent px-1.5 py-0.5 text-[10px] tabular-nums overflow-hidden cursor-default font-bold antialiased",
                                isLastBadge
                                  ? "bg-black text-white dark:bg-white dark:text-black"
                                  : "text-black",
                              )}
                              style={
                                bgColor != null
                                  ? { backgroundColor: bgColor }
                                  : undefined
                              }
                            >
                              <span className="min-w-0 truncate font-bold">
                                {m.value}
                              </span>
                              {m.unit != null && m.unit !== "" && (
                                <span
                                  className="ml-0.5 shrink-0 font-bold"
                                  style={{ opacity: 0.8 }}
                                >
                                  {m.unit}
                                </span>
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltipText}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Col 3: SBP Control */}
              <div className="group flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden transition-all duration-200 hover:border-primary/60 hover:shadow-lg hover:-translate-y-[2px]">
                <div className="panel-header flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CommonTooltip content="Expand SBP control panel">
                      <button
                        type="button"
                        onClick={() => setExpandedCard("sbp")}
                        className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary cursor-pointer focus:outline-none focus:bg-primary/25 focus:ring-2 focus:ring-primary/40 focus:ring-inset"
                        aria-label="SBP Control panel actions"
                      >
                        <Gauge
                          className="h-4 w-4 transition-opacity group-hover:opacity-0"
                          aria-hidden
                        />
                        <Maximize2
                          className="absolute h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      </button>
                    </CommonTooltip>
                    <span className="panel-title truncate">SBP Control</span>
                  </div>
                </div>
                <div className="p-4 pt-3 pb-6 border-b border-border/30">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <StatRow label="SBP" value="750" />
                    <StatRow
                      label="SP"
                      value="750"
                      unit="psi"
                      subValue="760 psi (High)"
                    />
                  </div>
                  <div className="mt-8 text-[10px] text-muted-foreground flex items-center gap-2 opacity-60">
                    <span>High Limit</span>
                    <div className="flex-1 border-b border-dashed border-muted-foreground/50"></div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 p-4 flex flex-col relative gap-4">
                  {/* Setpoint Transition Component */}
                  <SetpointTransitionChart label="SBP" color="#eab308" />

                  {/* Main Chart */}
                  <div className="flex-1 min-h-0 -ml-2 pb-4">
                    <SimulatorChart
                      color="#21d5ed"
                      seriesColors={["#21d5ed", "#f59f0a"]}
                      seriesLabels={["SBP", "SP"]}
                      valueUnit="psi"
                      minY={100}
                      maxY={900}
                    />
                  </div>

                  {/* Value Badges */}
                  <div className="px-2 pt-1.5 pb-2 flex flex-wrap gap-1.5 justify-center">
                    {[
                      { label: "SBP", value: "750", unit: "psi" },
                      { label: "SP", value: "760", unit: "psi" },
                    ].map((m, i) => {
                      const badgeBgColors = ["#21d5ed", "#f59f0a"] as const;
                      const isLastBadge = i % 3 === 2;
                      const bgColor = isLastBadge
                        ? undefined
                        : badgeBgColors[i % badgeBgColors.length];

                      const tooltipText = m.label ?? "";

                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                "inline-flex min-w-0 flex-shrink items-center rounded border border-transparent px-1.5 py-0.5 text-[10px] tabular-nums overflow-hidden cursor-default font-bold antialiased",
                                isLastBadge
                                  ? "bg-black text-white dark:bg-white dark:text-black"
                                  : "text-black",
                              )}
                              style={
                                bgColor != null
                                  ? { backgroundColor: bgColor }
                                  : undefined
                              }
                            >
                              <span className="min-w-0 truncate font-bold">
                                {m.value}
                              </span>
                              {m.unit != null && m.unit !== "" && (
                                <span
                                  className="ml-0.5 shrink-0 font-bold"
                                  style={{ opacity: 0.8 }}
                                >
                                  {m.unit}
                                </span>
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltipText}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Col 4: SPP Control */}
              <div className="group flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden transition-all duration-200 hover:border-primary/60 hover:shadow-lg hover:-translate-y-[2px]">
                <div className="panel-header flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CommonTooltip content="Expand SPP control panel">
                      <button
                        type="button"
                        onClick={() => setExpandedCard("spp")}
                        className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary cursor-pointer focus:outline-none focus:bg-primary/25 focus:ring-2 focus:ring-primary/40 focus:ring-inset"
                        aria-label="SPP Control panel actions"
                      >
                        <Gauge
                          className="h-4 w-4 transition-opacity group-hover:opacity-0"
                          aria-hidden
                        />
                        <Maximize2
                          className="absolute h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      </button>
                    </CommonTooltip>
                    <span className="panel-title truncate">SPP Control</span>
                  </div>
                </div>
                <div className="p-4 pt-3 pb-6 border-b border-border/30">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <StatRow label="SPP" value="6146.5" unit="psi" highlight />
                    <StatRow
                      label="SP"
                      value="6150"
                      unit="psi"
                      subValue="6160 psi (High)"
                    />
                  </div>
                  <div className="mt-8 text-[10px] text-muted-foreground flex items-center gap-2 opacity-60">
                    <span>High Limit</span>
                    <div className="flex-1 border-b border-dashed border-muted-foreground/50"></div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 p-4 flex flex-col relative gap-4">
                  {/* Setpoint Transition Component */}
                  <SetpointTransitionChart label="SPP" color="#60a5fa" />

                  {/* Main Chart */}
                  <div className="flex-1 min-h-0 -ml-2 pb-4">
                    <SimulatorChart
                      color="#21d5ed"
                      seriesColors={["#21d5ed", "#f59f0a"]}
                      seriesLabels={["SPP", "SP"]}
                      valueUnit="psi"
                      minY={0}
                      maxY={1000}
                    />
                  </div>

                  {/* Value Badges */}
                  <div className="px-2 pt-1.5 pb-2 flex flex-wrap gap-1.5 justify-center">
                    {[
                      { label: "SPP", value: "6146.5", unit: "psi" },
                      { label: "SP", value: "6150", unit: "psi" },
                    ].map((m, i) => {
                      const badgeBgColors = ["#21d5ed", "#f59f0a"] as const;
                      const isLastBadge = i % 3 === 2;
                      const bgColor = isLastBadge
                        ? undefined
                        : badgeBgColors[i % badgeBgColors.length];

                      const tooltipText = m.label ?? "";

                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                "inline-flex min-w-0 flex-shrink items-center rounded border border-transparent px-1.5 py-0.5 text-[10px] tabular-nums overflow-hidden cursor-default font-bold antialiased",
                                isLastBadge
                                  ? "bg-black text-white dark:bg-white dark:text-black"
                                  : "text-black",
                              )}
                              style={
                                bgColor != null
                                  ? { backgroundColor: bgColor }
                                  : undefined
                              }
                            >
                              <span className="min-w-0 truncate font-bold">
                                {m.value}
                              </span>
                              {m.unit != null && m.unit !== "" && (
                                <span
                                  className="ml-0.5 shrink-0 font-bold"
                                  style={{ opacity: 0.8 }}
                                >
                                  {m.unit}
                                </span>
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltipText}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Col 5: Well Visualization */}
              <div className="group flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden transition-all duration-200 hover:border-primary/60 hover:shadow-lg hover:-translate-y-[2px]">
                <div className="panel-header flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CommonTooltip content="Expand well visualization panel">
                      <button
                        type="button"
                        onClick={() => setExpandedCard("well")}
                        className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary cursor-pointer focus:outline-none focus:bg-primary/25 focus:ring-2 focus:ring-primary/40 focus:ring-inset"
                        aria-label="Well panel actions"
                      >
                        <LayoutTemplate
                          className="h-4 w-4 transition-opacity group-hover:opacity-0"
                          aria-hidden
                        />
                        <Maximize2
                          className="absolute h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      </button>
                    </CommonTooltip>
                    <span className="panel-title truncate">Well</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0 p-4 flex flex-col relative gap-4">
                  <div className="flex-1 w-full bg-[#0a0a0a] rounded-lg relative overflow-hidden shadow-inner border border-white/5 group">
                    {/* Richer visualization placeholder */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent 0, transparent 49px, #333 50px), repeating-linear-gradient(90deg, transparent 0, transparent 49px, #333 50px)`,
                        backgroundSize: "100% 50px",
                      }}
                    ></div>

                    {/* Mock well bore */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 border-l border-r border-white/10 bg-white/5">
                      <div className="absolute bottom-1/4 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Control Area */}
            <ControlPanel
              showFlowControls={showFlowControls}
              setShowFlowControls={setShowFlowControls}
            />
          </main>
        </div>
      </div>

      <CommonDialog
        open={!!expandedCard}
        onOpenChange={(open) => !open && setExpandedCard(null)}
        title={
          <span className="uppercase tracking-wide">
            {expandedCard === "flow" && "Flow"}
            {expandedCard === "density" && "Density"}
            {expandedCard === "sbp" && "SBP Control"}
            {expandedCard === "spp" && "SPP Control"}
            {expandedCard === "well" && "Well"}
          </span>
        }
        maxWidth="max-w-4xl max-h-[90vh] h-[80vh]"
      >
        <div className="flex-1 w-full min-h-0 flex flex-col">
          {expandedCard === "flow" && (
            <>
              <div className="flex-1 min-h-[400px]">
                <SimulatorChart
                  color="#21d5ed"
                  seriesColors={["#21d5ed", "#f59f0a"]}
                  seriesLabels={["Flow In", "Flow Out"]}
                  valueUnit="gpm"
                  minY={0}
                  maxY={1000}
                  currentValues={[580, 596]}
                />
              </div>
              <div className="px-0 pt-3 pb-1 flex flex-wrap gap-2 justify-center shrink-0">
                {[
                  { label: "Flow In", value: "580", unit: "gpm" },
                  { label: "Flow Out", value: "596", unit: "gpm" },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center rounded px-2 py-1 text-xs font-bold bg-[#21d5ed] text-black first:bg-[#21d5ed] last:bg-[#f59f0a]"
                  >
                    <span className="mr-1 opacity-70">{m.label}:</span>
                    <span>
                      {m.value} {m.unit}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {expandedCard === "density" && (
            <>
              <div className="flex-1 min-h-[400px]">
                <SimulatorChart
                  color="#21d5ed"
                  seriesColors={["#21d5ed", "#f59f0a"]}
                  seriesLabels={["Density In", "Density Out"]}
                  valueUnit="ppg"
                  minY={0}
                  maxY={800}
                />
              </div>
              <div className="px-0 pt-3 pb-1 flex flex-wrap gap-2 justify-center shrink-0">
                {[
                  { label: "Density In", value: "12.6", unit: "ppg" },
                  { label: "Density Out", value: "12.51", unit: "ppg" },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center rounded px-2 py-1 text-xs font-bold bg-[#21d5ed] text-black first:bg-[#21d5ed] last:bg-[#f59f0a]"
                  >
                    <span className="mr-1 opacity-70">{m.label}:</span>
                    <span>
                      {m.value} {m.unit}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {expandedCard === "sbp" && (
            <>
              <div className="flex-1 min-h-[400px]">
                <SimulatorChart
                  color="#21d5ed"
                  seriesColors={["#21d5ed", "#f59f0a"]}
                  seriesLabels={["SBP", "SP"]}
                  valueUnit="psi"
                  minY={100}
                  maxY={900}
                />
              </div>
              <div className="px-0 pt-3 pb-1 flex flex-wrap gap-2 justify-center shrink-0">
                {[
                  { label: "SBP", value: "750", unit: "psi" },
                  { label: "SP", value: "760", unit: "psi" },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center rounded px-2 py-1 text-xs font-bold bg-[#21d5ed] text-black first:bg-[#21d5ed] last:bg-[#f59f0a]"
                  >
                    <span className="mr-1 opacity-70">{m.label}:</span>
                    <span>
                      {m.value} {m.unit}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {expandedCard === "spp" && (
            <>
              <div className="flex-1 min-h-[400px]">
                <SimulatorChart
                  color="#21d5ed"
                  seriesColors={["#21d5ed", "#f59f0a"]}
                  seriesLabels={["SPP", "SP"]}
                  valueUnit="psi"
                  minY={0}
                  maxY={1000}
                />
              </div>
              <div className="px-0 pt-3 pb-1 flex flex-wrap gap-2 justify-center shrink-0">
                {[
                  { label: "SPP", value: "6146.5", unit: "psi" },
                  { label: "SP", value: "6150", unit: "psi" },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center rounded px-2 py-1 text-xs font-bold bg-[#21d5ed] text-black first:bg-[#21d5ed] last:bg-[#f59f0a]"
                  >
                    <span className="mr-1 opacity-70">{m.label}:</span>
                    <span>
                      {m.value} {m.unit}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {expandedCard === "well" && (
            <div className="flex-1 w-full min-h-[500px] bg-[#0a0a0a] rounded-lg relative overflow-hidden shadow-inner border border-white/5 group">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent 0, transparent 49px, #333 50px), repeating-linear-gradient(90deg, transparent 0, transparent 49px, #333 50px)`,
                  backgroundSize: "100% 50px",
                }}
              />
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-48 border-l border-r border-white/10 bg-white/5">
                <div className="absolute bottom-1/4 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-primary/20"></div>
              </div>
            </div>
          )}
        </div>
      </CommonDialog>
      {/* </SidebarLayout> */}
    </PageLayout>
  );
}
