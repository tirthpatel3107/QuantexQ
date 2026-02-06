import type { LucideIcon } from "lucide-react";
import {
  Droplets,
  Gauge,
  Thermometer,
  Activity,
  CircleDot,
  SlidersHorizontal,
} from "lucide-react";
import type { VerticalChartMetric } from "@/components/dashboard/VerticalChartCard";
import { Header } from "@/components/dashboard/Header";
import { VerticalChartCard } from "@/components/dashboard/VerticalChartCard";
import { DepthGauge } from "@/components/dashboard/DepthGauge";
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";

import {
  flowData,
  densityData,
  surfacePressureData,
  standpipePressureData,
  bottomHolePressureData,
  chokeChartData,
  pumpStatus,
  operationalStatus,
} from "@/data/mockData";
import { cn } from "@/lib/utils";

type VerticalCardConfig = {
  id: string;
  title: string;
  icon: LucideIcon;
  metrics: VerticalChartMetric[];
  data: { time: string; value: number }[];
  color: string;
  threshold?: { value: number; label: string };
  status?: "normal" | "warning" | "critical";
};

/** 6 center cards: details + Recharts vertical line graph merged in each */
const CENTER_CARDS: VerticalCardConfig[] = [
  {
    id: "flow",
    title: "Flow",
    icon: Droplets,
    metrics: [
      { label: "IN", value: "220.1", unit: "gpm", trend: "down" },
      { label: "OUT", value: "318.0", unit: "gpm", trend: "stable", status: "warning" },
      { label: "MUD", value: "50.6", unit: "ppg", trend: "down", status: "warning" },
    ],
    data: flowData,
    color: "hsl(var(--chart-3))",
  },
  {
    id: "density",
    title: "Density",
    icon: Gauge,
    metrics: [
      { label: "IN", value: "8.6", unit: "ppg", trend: "stable" },
      { label: "OUT", value: "8.4", unit: "ppg", trend: "stable" },
    ],
    data: densityData,
    color: "hsl(var(--success))",
  },
  {
    id: "surface-back-pressure",
    title: "Surface Back Pressure",
    icon: Activity,
    metrics: [
      { label: "SP", value: "1247.9", unit: "psi", trend: "down" },
      { label: "SBP", value: "227.0", unit: "psi", trend: "down" },
    ],
    data: surfacePressureData,
    color: "hsl(var(--chart-4))",
  },
  {
    id: "standpipe-pressure",
    title: "Stand Pipe Pressure",
    icon: CircleDot,
    metrics: [
      { label: "SP", value: "3483.0", unit: "psi", trend: "stable" },
      { label: "SPP", value: "3947.9", unit: "psi", trend: "up" },
    ],
    data: standpipePressureData,
    color: "hsl(var(--chart-4))",
  },
  {
    id: "bottom-hole-pressure",
    title: "Bottom Hole Pressure",
    icon: Thermometer,
    metrics: [
      { label: "SP", value: "9627.0", unit: "psi", trend: "stable" },
      { label: "BHP", value: "9718.4", unit: "psi", trend: "stable" },
    ],
    data: bottomHolePressureData,
    color: "hsl(var(--chart-5))",
  },
  {
    id: "choke",
    title: "Choke",
    icon: SlidersHorizontal,
    metrics: [
      { label: "A A", value: "10.1", unit: "%", trend: "up" },
      { label: "B B", value: "-1.1", unit: "%", trend: "stable", status: "critical" },
      { label: "Set point", value: "12.5", unit: "%", trend: "stable" },
    ],
    data: chokeChartData,
    color: "hsl(var(--chart-6))",
    threshold: { value: 12.5, label: "Set" },
    status: "warning",
  },
];

const Index = () => {
  const showPumpSkeleton = useInitialSkeleton();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-2 sm:p-3 pt-28 sm:pt-24 md:pt-20 overflow-auto custom-scrollbar">
        <div className="grid h-full gap-3 grid-cols-1 lg:grid-cols-[minmax(0,12%)_minmax(0,73%)_minmax(0,15%)]">
          {/* Left Column - Drill Depth (12%) */}
          <div className="min-h-[320px] min-w-0 overflow-hidden">
            <DepthGauge
              currentDepth={14978}
              targetDepth={20000}
              bitDepth={14950}
              rateOfPenetration={2.4}
            />
          </div>

          {/* Center Column: 6 cards only — details + Recharts vertical line graph in each */}
          <div className="min-w-0 overflow-hidden">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {CENTER_CARDS.map((card) => (
                <VerticalChartCard
                  key={card.id}
                  title={card.title}
                  icon={card.icon}
                  metrics={card.metrics}
                  data={card.data}
                  color={card.color}
                  threshold={card.threshold}
                  status={card.status}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Status + Pump Status (15%) */}
          <div className="flex flex-col gap-3 min-w-0 w-full overflow-hidden">
            {/* Status Panel */}
            <div className="dashboard-panel min-w-0">
              <div className="panel-header flex items-center gap-2">
                <div className="status-indicator online" />
                <h3 className="panel-title">Status</h3>
              </div>
              <div className="p-2 space-y-0.5">
                {operationalStatus.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-accent/50 text-xs"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        item.status === "warning" && "text-warning",
                        item.status === "critical" && "text-destructive",
                        (!item.status || item.status === "normal") && "text-foreground"
                      )}
                    >
                      {item.value}
                      {item.unit && (
                        <span className="text-muted-foreground ml-1">{item.unit}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pump Status */}
            {showPumpSkeleton ? (
              <div className="dashboard-panel min-w-0">
                <div className="panel-header">
                  <div className="skeleton h-4 w-28 rounded-md" />
                </div>
                <div className="p-2 grid gap-3 grid-cols-1">
                  {pumpStatus.map((_, i) => (
                    <div
                      key={i}
                      className="relative p-2 rounded-lg border border-border bg-card space-y-2"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="skeleton h-2.5 w-2.5 rounded-full" />
                          <div className="skeleton h-4 w-24 rounded-md" />
                        </div>
                        <div className="skeleton h-4 w-4 rounded-full" />
                      </div>
                      <div className="space-y-3">
                        <div className="skeleton h-3 w-16 rounded-md" />
                        <div className="skeleton h-2.5 w-full rounded-full" />
                        <div className="skeleton h-3 w-20 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="dashboard-panel min-w-0">
                <div className="panel-header">
                  <h3 className="panel-title">Pump Status</h3>
                </div>
                <div className="p-2 grid gap-3 grid-cols-1">
                  {pumpStatus.map((pump, i) => (
                    <PumpStatusCard
                      key={i}
                      name={pump.name}
                      status={pump.status}
                      disableInitialSkeleton
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
