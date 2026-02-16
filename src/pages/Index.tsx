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
      <text
        x="16"
        y="17.5"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontSize: 6, fontWeight: 600 }}
      >
        PSI
      </text>
    </svg>
  );
}

function FlowControlStack() {
  return (
    <div className="flex flex-col gap-1 p-2 bg-card dark:bg-[#0C1322] border border-border dark:border-white/5 rounded-sm shadow-xl w-[300px] antialiased">
      <div className="bg-muted/30 dark:bg-[#0C1322] border border-border dark:border-white/5 rounded-sm px-3 py-2.5 flex items-center justify-between group cursor-pointer hover:border-primary/30 dark:hover:border-white/10 transition-colors shadow-sm">
        <div className="flex items-center gap-3">
          <Triangle className="h-4 w-4 text-warning fill-transparent stroke-[2.5]" />
          <span className="text-[12px] font-bold text-foreground dark:text-gray-200 uppercase tracking-wide">
            KICK DETECTION
          </span>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-500 tracking-wider">
          ARMED
        </span>
      </div>

      <div className="bg-muted/30 dark:bg-[#0C1322] border border-border dark:border-white/5 rounded-sm px-3 py-2.5 flex items-center justify-between group cursor-pointer hover:border-primary/30 dark:hover:border-white/10 transition-colors shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full border-[2px] border-muted-foreground/50 dark:border-slate-600 flex items-center justify-center">
            <div className="h-1.5 w-1.5 bg-muted-foreground/50 dark:bg-slate-600 rounded-full" />
          </div>
          <span className="text-[12px] font-bold text-foreground dark:text-gray-200 uppercase tracking-wide">
            LOSS DETECTION
          </span>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-500 tracking-wider">
          ARMED
        </span>
      </div>

      <div className="bg-muted/30 dark:bg-[#0C1322] border border-border dark:border-white/5 rounded-sm p-2.5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[12px] font-bold text-foreground dark:text-gray-200 ml-1">
            PRC
          </span>
          <div className="flex bg-muted/50 dark:bg-[#0C1322] rounded-[1px] p-0.5 border border-border dark:border-white/5">
            <span className="text-[10px] bg-foreground dark:bg-black text-background dark:text-white px-2 py-0.5 rounded-[1px] cursor-pointer font-bold tracking-tight border border-border dark:border-white/10">
              MAN
            </span>
            <span className="text-[10px] text-muted-foreground dark:text-slate-500 px-2 py-0.5 hover:text-foreground dark:hover:text-slate-300 cursor-pointer transition-colors font-medium">
              4K
            </span>
            <span className="text-[10px] text-muted-foreground dark:text-slate-500 px-2 py-0.5 hover:text-foreground dark:hover:text-slate-300 cursor-pointer transition-colors font-medium">
              OFF
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-muted-foreground dark:text-slate-500 w-8 ml-1">
            MAN
          </span>
          <div className="flex flex-wrap bg-muted/50 dark:bg-[#0C1322] rounded-[2px]">
            <button className="my-1 mr-1 px-2.5 py-0.5 bg-primary dark:bg-cyan-400 text-primary-foreground dark:text-black text-[10px] font-bold rounded-[1px] shadow-sm">
              1
            </button>
            <button className="my-1 mr-1 px-2.5 py-0.5 bg-primary dark:bg-cyan-400 text-primary-foreground dark:text-black text-[10px] font-bold rounded-[1px] shadow-sm">
              2
            </button>{" "}
            <button className="my-1 mr-1 px-2.5 py-0.5 bg-primary dark:bg-cyan-400 text-primary-foreground dark:text-black text-[10px] font-bold rounded-[1px] shadow-sm">
              3
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted-foreground dark:text-slate-500 w-8 ml-1">
            AUX
          </span>
          <div className="flex flex-wrap bg-muted/50 dark:bg-[#0C1322] rounded-[2px]">
            <button className="my-1 mr-1 px-2.5 py-0.5 bg-primary dark:bg-cyan-400 text-primary-foreground dark:text-black text-[10px] font-bold rounded-[1px] shadow-sm">
              1
            </button>
            <button className="my-1 mr-1 px-2.5 py-0.5 bg-primary dark:bg-cyan-400 text-primary-foreground dark:text-black text-[10px] font-bold rounded-[1px] shadow-sm">
              2
            </button>
            <button className="my-1 mr-1 px-2.5 py-0.5 bg-primary dark:bg-cyan-400 text-primary-foreground dark:text-black text-[10px] font-bold rounded-[1px] shadow-sm">
              3
            </button>
            <button className="my-1 mr-1 px-2.5 py-0.5 bg-primary dark:bg-cyan-400 text-primary-foreground dark:text-black text-[10px] font-bold rounded-[1px] shadow-sm">
              4
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SegmentedBar({
  count = 20,
  fillCount = 0,
  color = "bg-slate-700",
  emptyColor = "bg-[#1a1c23]",
}: {
  count?: number;
  fillCount?: number;
  color?: string;
  emptyColor?: string;
}) {
  return (
    <div className="flex gap-[2px] h-full w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 h-full rounded-[1px] w-[6px]",
            i < fillCount ? color : emptyColor,
          )}
        />
      ))}
    </div>
  );
}

function FlowDifferenceBar({ showSkeleton }: { showSkeleton?: boolean }) {
  const [open, setOpen] = useState(false);

  if (showSkeleton) {
    return (
      <div className="dashboard-panel h-[72px] w-[620px] flex items-center p-2 gap-4">
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
      <div
        className={cn(
          "dashboard-panel p-2 flex items-center shrink-0 z-10 font-sans overflow-hidden select-none group/bar transition-all duration-300",
          open &&
            "border-primary/50 shadow-[0_0_15px_rgba(33,213,237,0.15)] ring-1 ring-primary/20 after:opacity-100",
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

          <div className="flex items-center gap-4 w-[260px]">
            <div className="h-10 w-10 rounded-full bg-muted dark:bg-[#111] flex items-center justify-center border-2 border-border dark:border-[#1f2128] shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0 box-content group-hover/bar:border-primary/50 transition-colors">
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
              <div className="h-2 w-full bg-muted/50 dark:bg-[#0a0a0a] rounded-sm overflow-hidden shadow-inner border border-border/30 dark:border-white/5 relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-muted-foreground/30 dark:bg-slate-500 z-10" />
                <div className="absolute inset-y-0 left-[50%] w-[10%] bg-gradient-to-r from-primary/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center px-2 border-r border-border/30 dark:border-white/5 h-full bg-transparent shrink-0">
          <div className="flex items-center justify-center">
            <SemiCircleGauge
              labelA="Choke A"
              valueA={10}
              colorA="#21d5ed"
              labelB="Choke B"
              valueB={100}
              colorB="#f59f0a"
            />
          </div>
        </div>

        <div className="flex-[1.3] flex flex-col justify-center gap-2.5 px-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider shrink-0">
              AUTO CONTROL
            </span>
            <div className="flex-1 h-3.5 bg-muted/20 dark:bg-black/40 rounded-[2px] border border-border/20 dark:border-white/5 p-[1px]">
              <SegmentedBar
                count={50}
                fillCount={0}
                emptyColor="bg-muted/40 dark:bg-white/[0.03]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider shrink-0">
              AUTO DETECTION
            </span>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[10px] font-bold text-primary dark:text-cyan-400">
                ON
              </span>
              <div className="flex-1 h-3.5 bg-muted/20 dark:bg-black/40 rounded-[2px] border border-border/20 dark:border-white/5 p-[1px]">
                <SegmentedBar
                  count={50}
                  fillCount={18}
                  color="bg-primary shadow-[0_0_8px_rgba(33,213,237,0.4)]"
                  emptyColor="bg-muted/40 dark:bg-white/[0.03]"
                />
              </div>
            </div>
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main
        className="flex-1 p-2 sm:p-3 pt-28 sm:pt-24 md:pt-20 overflow-auto custom-scrollbar"
        onClick={() => setExpandedCardId(null)}
      >
        <div className="flex flex-col gap-3 h-full">
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

              <div className="flex gap-3 justify-end items-center">
                <FlowDifferenceBar showSkeleton={showSkeleton} />

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
                        className="dashboard-panel h-full flex flex-col items-center justify-center p-3 transition-all active:scale-95 focus:outline-none min-w-[56px]"
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

            <div className="min-h-[700px] min-w-0 overflow-hidden flex flex-col gap-2">
              <DepthGauge
                currentDepth={14978}
                targetDepth={20000}
                bitDepth={14950}
                rateOfPenetration={2.4}
              />
              <div className="mt-1 flex items-center justify-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="status-indicator online" />
                  <span className="text-success text-xs font-medium">Live</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="status-indicator online" />
                  <span className="text-success text-xs font-medium">
                    System Hydraulics
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mt-1">
            <FlowDifferenceBar />
          </div> */}
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
