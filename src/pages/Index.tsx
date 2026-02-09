import { useState, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Droplets,
  Gauge,
  Thermometer,
  Activity,
  CircleDot,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { VerticalChartMetric } from "@/components/dashboard/VerticalChartCard";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { useSimulation } from "@/hooks/useSimulation";
import { SimulationProvider } from "@/hooks/useSimulation";
import { Header } from "@/components/dashboard/Header";
import { VerticalChartCard } from "@/components/dashboard/VerticalChartCard";
import { DepthGauge } from "@/components/dashboard/DepthGauge";
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { pumpStatus } from "@/data/mockData";
import type { ChartDataPoint } from "@/data/mockData";

type ChartDataKey = "flow" | "density" | "surfacePressure" | "standpipePressure" | "bottomHolePressure" | "choke";

type VerticalCardConfig = {
  id: string;
  chartKey: ChartDataKey;
  title: string;
  icon: LucideIcon;
  metrics: Omit<VerticalChartMetric, "value">[];
  color: string;
  threshold?: { value: number; label: string };
  status?: "normal" | "warning" | "critical";
};

/** Derive metric values from the latest data point */
function metricsFromLatestPoint(
  baseMetrics: Omit<VerticalChartMetric, "value">[],
  latestPoint: ChartDataPoint | undefined
): VerticalChartMetric[] {
  if (!latestPoint) return baseMetrics.map((m) => ({ ...m, value: "—" }));
  return baseMetrics.map((m) => {
    const raw = m.dataKey ? latestPoint[m.dataKey] : undefined;
    const value = typeof raw === "number" ? String(raw) : raw != null ? String(raw) : "—";
    return { ...m, value };
  });
}

/** 6 center cards: details + ECharts vertical line graph merged in each */
const CENTER_CARDS: VerticalCardConfig[] = [
  {
    id: "flow",
    chartKey: "flow",
    title: "Flow",
    icon: Droplets,
    metrics: [
      { label: "IN", unit: "gpm", trend: "down", dataKey: "in", color: "#fbbf24" },
      { label: "OUT", unit: "gpm", trend: "stable", status: "warning", dataKey: "out", color: "#ef4444" },
      { label: "MUD", unit: "ppg", trend: "down", status: "warning", dataKey: "mud", color: "#3b82f6" },
    ],
    color: "hsl(var(--chart-3))",
  },
  {
    id: "density",
    chartKey: "density",
    title: "Density",
    icon: Gauge,
    metrics: [
      { label: "IN", unit: "ppg", trend: "stable", dataKey: "in", color: "#22c55e" },
      { label: "OUT", unit: "ppg", trend: "stable", dataKey: "out", color: "#3b82f6" },
    ],
    color: "hsl(var(--success))",
  },
  {
    id: "surface-back-pressure",
    chartKey: "surfacePressure",
    title: "Surface Back Pressure",
    icon: Activity,
    metrics: [
      { label: "SP", unit: "psi", trend: "down", dataKey: "sp", color: "#22c55e" },
      { label: "SBP", unit: "psi", trend: "down", dataKey: "sbp", color: "#3b82f6" },
    ],
    color: "hsl(var(--chart-4))",
  },
  {
    id: "standpipe-pressure",
    chartKey: "standpipePressure",
    title: "Stand Pipe Pressure",
    icon: CircleDot,
    metrics: [
      { label: "SP", unit: "psi", trend: "stable", dataKey: "sp", color: "#22c55e" },
      { label: "SPP", unit: "psi", trend: "up", dataKey: "spp", color: "#3b82f6" },
    ],
    color: "hsl(var(--chart-4))",
  },
  {
    id: "bottom-hole-pressure",
    chartKey: "bottomHolePressure",
    title: "Bottom Hole Pressure",
    icon: Thermometer,
    metrics: [
      { label: "SP", unit: "psi", trend: "stable", dataKey: "sp", color: "#22c55e" },
      { label: "BHP", unit: "psi", trend: "stable", dataKey: "bhp", color: "#3b82f6" },
    ],
    color: "hsl(var(--chart-5))",
  },
  {
    id: "choke",
    chartKey: "choke",
    title: "Choke",
    icon: SlidersHorizontal,
    metrics: [
      { label: "Chock A", unit: "%", trend: "up", dataKey: "choke_a", color: "#22c55e" },
      { label: "Chock B", unit: "%", trend: "stable", status: "critical", dataKey: "choke_b", color: "#ef4444" },
      { label: "Set point", unit: "%", trend: "stable", dataKey: "set_point", color: "#eab308" },
    ],
    color: "hsl(var(--chart-6))",
    threshold: { value: 12.5, label: "Set" },
  },
];

/** Circular gauge icon with PSI label (matches reference pump icon) */
function PsiGaugeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="16" cy="16" r="12" />
      <path d="M16 8v4M16 20v4M8 16h4M20 16h4M10.34 10.34l2.83 2.83M18.83 18.83l2.83 2.83M10.34 21.66l2.83-2.83M18.83 13.17l2.83-2.83" />
      <text x="16" y="17.5" textAnchor="middle" fill="currentColor" style={{ fontSize: 6, fontWeight: 600 }}>
        PSI
      </text>
    </svg>
  );
}

const IndexContent = () => {
  const [pumpDialogOpen, setPumpDialogOpen] = useState(false);
  const showSkeleton = useInitialSkeleton();
  const { chartData } = useSimulation();

  const cardDataMap = useMemo(
    () => ({
      flow: chartData.flow,
      density: chartData.density,
      surfacePressure: chartData.surfacePressure,
      standpipePressure: chartData.standpipePressure,
      bottomHolePressure: chartData.bottomHolePressure,
      choke: chartData.choke,
    }),
    [chartData]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-2 sm:p-3 pt-28 sm:pt-24 md:pt-20 overflow-auto custom-scrollbar">
        <div className="grid h-full gap-3 grid-cols-1 lg:grid-cols-[minmax(0,12%)_minmax(0,1fr)]">
          {/* Left Column - Drill Depth (12%) */}
          <div className="min-h-[100vh] min-w-0 overflow-hidden">
            <DepthGauge
              currentDepth={14978}
              targetDepth={20000}
              bitDepth={14950}
              rateOfPenetration={2.4}
            />
          </div>

          {/* Center Column: 6 charts + Pump Status below */}
          <div className="min-w-0 flex flex-col gap-3 overflow-x-auto overflow-y-hidden">
            <div className="grid gap-2 grid-cols-6 min-w-[1080px] items-stretch">
              {CENTER_CARDS.map((card) => {
                const data = cardDataMap[card.chartKey];
                const latestPoint = data?.length ? data[data.length - 1] : undefined;
                const metrics = metricsFromLatestPoint(card.metrics, latestPoint);
                return (
                  <Tooltip key={card.id}>
                    <TooltipTrigger asChild>
                      <div className="min-w-0 h-full flex flex-col">
                        <div className="flex-1 min-h-0">
                          <VerticalChartCard
                            title={card.title}
                            icon={card.icon}
                            metrics={metrics}
                            data={data ?? []}
                            color={card.color}
                            threshold={card.threshold}
                            status={card.status}
                            className="min-h-0"
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{card.title}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Pump button - below charts, opens popup */}
            <div className="flex justify-end min-w-0">
              {showSkeleton ? (
                <div
                  className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-3 shadow-md min-w-[56px]"
                  aria-hidden
                >
                  <div className="skeleton h-8 w-8 rounded-md" />
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setPumpDialogOpen(true)}
                      className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-3 shadow-md transition-all hover:shadow-md focus:outline-none"
                      aria-label="Open pump status"
                    >
                      <PsiGaugeIcon className="h-8 w-8 text-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pump Status</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Pump Status popup */}
      <Dialog open={pumpDialogOpen} onOpenChange={setPumpDialogOpen}>
        <DialogContent
          className="max-w-2xl max-h-[85vh] overflow-y-auto"
          hideClose
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle>Pump Status</DialogTitle>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="grid gap-3 grid-cols-4 pt-2">
            {pumpStatus.map((pump) => (
              <PumpStatusCard
                key={pump.name}
                name={pump.name}
                status={pump.status}
                disableInitialSkeleton
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Index = () => (
  <SimulationProvider>
    <IndexContent />
  </SimulationProvider>
);

export default Index;
