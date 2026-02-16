import { useState, useMemo } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Triangle, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/dashboard/Header";
import { VerticalChartCard } from "@/components/dashboard/VerticalChartCard";
import { DepthGauge } from "@/components/dashboard/DepthGauge";
import { SemiCircleGauge } from "@/components/dashboard/SemiCircleGauge";
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { useSimulation } from "@/hooks/useSimulation";
import { pumpStatus } from "@/data/mockData";
import {
  CENTER_CARDS,
  metricsFromLatestPoint,
} from "@/data/dashboardChartConfig";

import { PsiGaugeIcon } from "@/components/dashboard/PsiGaugeIcon";
import { SegmentedBar } from "@/components/dashboard/SegmentedBar";
import { FlowControlStack } from "@/components/dashboard/FlowControlStack";

function FlowDifferenceBar({ showSkeleton }: { showSkeleton?: boolean }) {
  const [open, setOpen] = useState(false);

  if (showSkeleton) {
    return (
      <div className="dashboard-panel h-[72px] w-full flex items-center p-2 gap-4">
        <div className="flex h-full items-center pl-1 pr-3 gap-3 border-r border-border/30 shrink-0">
          <div className="skeleton h-8 w-4 rounded-sm" />
          <div className="flex items-center gap-4 w-[260px]">
            <div className="skeleton h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="skeleton h-3 w-32 rounded-sm" />
              <div className="skeleton h-2 w-full rounded-sm" />
            </div>
          </div>
        </div>
        <div className="flex items-center px-2 border-r border-border/30 h-full shrink-0">
          <div className="skeleton h-12 w-24 rounded-md" />
        </div>
        <div className="flex-1 flex flex-col gap-3 px-2">
          <div className="skeleton h-3 w-full rounded-sm" />
          <div className="skeleton h-3 w-full rounded-sm" />
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center">
        <div
          className={cn(
            "dashboard-panel p-4 flex items-center w-full z-10 font-sans overflow-hidden select-none group/bar transition-all duration-300",
            open &&
              "border-primary/50 shadow-glow ring-1 ring-primary/20 after:opacity-100",
          )}
        >
          <div className="flex h-full items-center pl-1 pr-3 gap-3 bg-transparent border-r border-border/30 dark:border-white/5 relative shrink-0">
            <PopoverTrigger asChild>
              <button
                type="button"
                className="h-full w-5 flex items-center justify-center hover:bg-muted dark:hover:bg-white/5 transition-colors -ml-1 mr-1 rounded-sm border border-border dark:border-white/10"
                aria-label="Toggle flow controls"
              >
                <div className="p-5 rounded-r-md flex items-center justify-center">
                  {open ? (
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Plus className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </button>
            </PopoverTrigger>

            <div className="flex items-center gap-4 w-[400px]">
              <div className="h-10 w-10 rounded-full bg-muted dark:bg-card-elevated flex items-center justify-center border-2 border-border dark:border-border/50 shadow-sm shrink-0 box-content group-hover/bar:border-primary/50 transition-colors">
                <div className="h-3 w-3 bg-slate-400 dark:bg-slate-300 rounded-full shadow-sm" />
              </div>

              <div className="flex-1 flex flex-col justify-center gap-1.5">
                <div className="flex items-baseline justify-between w-full mb-1 px-1">
                  <span className="panel-title text-[12px] font-bold text-muted-foreground dark:text-slate-400 tracking-wide uppercase">
                    Flow Difference
                  </span>
                  <span className="text-[12px] font-bold tabular-nums text-primary flex-shrink-0 antialiased">
                    0{" "}
                    <span className="text-primary font-medium ml-0.5 antialiased">
                      gpm
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/50 dark:bg-black/40 rounded-sm overflow-hidden shadow-inner border border-border/30 dark:border-white/5 relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-muted-foreground/30 dark:bg-slate-500 z-10" />
                  <div className="absolute inset-y-0 left-[50%] w-[10%] bg-gradient-to-r from-primary/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center pl-3 pr-5 border-r border-border/30 dark:border-white/5 h-full bg-transparent shrink-0">
            <div className="flex items-center justify-center">
              <SemiCircleGauge
                labelA="Choke A"
                valueA={10}
                colorA="hsl(var(--primary))"
                labelB="Set Point"
                valueB={85}
                colorB="hsl(var(--warning))"
              />
            </div>
          </div>

          <div className="flex items-center pl-3 pr-5 border-r border-border/30 dark:border-white/5 h-full bg-transparent shrink-0">
            <div className="flex items-center justify-center">
              <SemiCircleGauge
                labelA="Choke B"
                valueA={78}
                colorA="hsl(var(--primary))"
                labelB="Set Point"
                valueB={85}
                colorB="hsl(var(--warning))"
              />
            </div>
          </div>

          <div className="flex-[1.3] flex flex-col justify-center gap-2.5 pl-5 ">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider shrink-0">
                AUTO CONTROL
              </span>
              <div className="flex-1 h-3.5 bg-muted/20 dark:bg-black/40 rounded-[2px] border border-border/20 dark:border-white/5 p-[1px]">
                <SegmentedBar count={25} fillCount={0} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider shrink-0">
                AUTO DETECTION
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[10px] font-bold text-primary">ON</span>
                <div className="flex-1 h-3.5 bg-muted/20 dark:bg-black/40 rounded-[2px] border border-border/20 dark:border-white/5 p-[1px]">
                  <SegmentedBar
                    count={25}
                    fillCount={18}
                    color="bg-primary shadow-glow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2.5 px-3 border-l border-border/30 dark:border-white/5 h-full">
          <div className="flex items-center gap-2">
            <div className="status-indicator online" />
            <span className="text-success text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
              Live
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator online" />
            <span className="text-success text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
              System Hydraulics
            </span>
          </div>
        </div>
      </div>

      <PopoverContent
        align="start"
        side="top"
        sideOffset={12}
        className="w-auto p-0 border-none bg-transparent shadow-none"
      >
        <FlowControlStack />
      </PopoverContent>
    </Popover>
  );
}

export default function Index() {
  const [pumpDialogOpen, setPumpDialogOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const showSkeleton = useInitialSkeleton();
  const { chartData } = useSimulation();

  const handleCardDoubleClick = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const cardDataMap = useMemo(
    () => ({
      flow: chartData.flow,
      density: chartData.density,
      surfacePressure: chartData.surfacePressure,
      standpipePressure: chartData.standpipePressure,
      bottomHolePressure: chartData.bottomHolePressure,
      choke: chartData.choke,
    }),
    [chartData],
  );

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />

      <main
        className="flex-1 p-2 sm:p-3 flex flex-col overflow-hidden"
        onClick={() => setExpandedCardId(null)}
      >
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          <div className="grid flex-1 min-h-0 gap-3 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,12%)]">
            <div className="min-w-0 flex flex-col gap-3 overflow-x-hidden">
              <div className="flex gap-2 items-stretch w-full flex-1 min-h-0">
                {CENTER_CARDS.map((card) => {
                  const data = cardDataMap[card.chartKey];
                  const latestPoint = data?.length
                    ? data[data.length - 1]
                    : undefined;
                  const metrics = metricsFromLatestPoint(
                    card.metrics,
                    latestPoint,
                  );
                  const isExpanded = expandedCardId === card.id;

                  return (
                    <VerticalChartCard
                      key={card.id}
                      title={card.title}
                      icon={card.icon}
                      metrics={metrics}
                      data={data || []}
                      threshold={card.threshold}
                      onDoubleClick={() => handleCardDoubleClick(card.id)}
                      className={cn(
                        "transition-all duration-500 ease-in-out",
                        isExpanded ? "flex-[2.5]" : "flex-1",
                      )}
                    />
                  );
                })}
              </div>

              <div className="h-[95px] shrink-0">
                <FlowDifferenceBar showSkeleton={showSkeleton} />
              </div>
            </div>

            <div className="min-w-0 flex flex-col h-full overflow-hidden">
              <DepthGauge
                currentDepth={14978}
                targetDepth={20000}
                bitDepth={14950}
                rateOfPenetration={2.4}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </main>

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
}
