import React, { useState, useRef, useCallback, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useSimulation } from "@/hooks/useSimulation";
import { COLORS } from "@/constants/colors";
import { DASHBOARD_LIMITS } from "@/constants/dashboard";
import { SemiCircleGauge } from "./SemiCircleGauge";
import { SegmentedBar } from "./SegmentedBar";
import { FlowControlStack } from "./FlowControlStack";
import { CommonTooltip } from "@/components/common";

interface FlowDifferenceBarProps {
  /** Whether to show a skeleton loader */
  showSkeleton?: boolean;
}

/**
 * Component to display the difference between flow in and flow out.
 * Includes interactive slider to manually override flow difference for simulation/testing.
 * Also includes choke gauges and status indicators for auto control/detection.
 */
export function FlowDifferenceBar({ showSkeleton }: FlowDifferenceBarProps) {
  const { chartData } = useSimulation();
  const [open, setOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [manualValue, setManualValue] = useState<number | null>(null);

  // Calculate latest flow difference from simulation
  const latestPoint = chartData.flow?.[chartData.flow.length - 1];
  const simFlowDiff =
    latestPoint && latestPoint.in !== undefined && latestPoint.out !== undefined
      ? Math.round((Number(latestPoint.in) - Number(latestPoint.out)) * 10) / 10
      : 0;

  // Use manual value if dragging, otherwise simulation
  const flowDiff = manualValue !== null ? manualValue : simFlowDiff;

  // Map limits to 0..100% for the slider position
  const { MIN, MAX, SAFE_THRESHOLD, WARNING_THRESHOLD } =
    DASHBOARD_LIMITS.FLOW_DIFF;
  const range = MAX - MIN;
  const position = Math.max(0, Math.min(100, ((flowDiff - MIN) / range) * 100));

  /**
   * Updates the flow difference value based on mouse position on the track
   */
  const updateValueFromPos = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const newVal = Math.round((percent * range + MIN) * 10) / 10;
      setManualValue(newVal);
    },
    [MIN, range],
  );

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateValueFromPos(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateValueFromPos(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, updateValueFromPos]);

  /**
   * Gets visual color feedback based on the magnitude of flow difference
   */
  const getColor = (val: number) => {
    const absVal = Math.abs(val);
    if (absVal <= SAFE_THRESHOLD) return COLORS.data.safe;
    if (absVal <= WARNING_THRESHOLD) return COLORS.data.warning;
    return COLORS.data.danger;
  };

  const statusColor = getColor(flowDiff);

  if (showSkeleton) {
    return (
      <div className="dashboard-panel h-[80px] w-full flex items-center p-2 gap-4">
        <div className="flex h-full items-center pl-1 pr-3 gap-3 border-r border-border/30 shrink-0">
          <Skeleton className="h-8 w-4 rounded-sm" />
          <div className="flex items-center gap-4 w-[260px]">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-3 w-32 rounded-sm" />
              <Skeleton className="h-2 w-full rounded-sm" />
            </div>
          </div>
        </div>
        <div className="flex items-center px-2 border-r border-border/30 h-full shrink-0">
          <Skeleton className="h-12 w-24" />
        </div>
        <div className="flex-1 flex flex-col gap-3 px-2">
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="h-3 w-full rounded-sm" />
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center">
        <div
          className={cn(
            "dashboard-panel p-4 flex items-center justify-between w-full z-10 font-sans overflow-hidden select-none group/bar transition-all duration-300",
            (open || isDragging) &&
              "border-primary/50 shadow-glow ring-1 ring-primary/20 after:opacity-100",
          )}
        >
          {/* Left Section: Controls & Flow Meter */}
          <div className="flex-[1] flex h-full items-center gap-3 bg-transparent relative shrink-0">
            <PopoverTrigger asChild>
              <CommonTooltip
                content={open ? "Hide flow controls" : "Show flow controls"}
              >
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
              </CommonTooltip>
            </PopoverTrigger>

            <div className="flex items-center gap-4 w-full">
              {/* Status Indicator Circle */}
              <div className="h-10 w-10 rounded-full bg-muted dark:bg-card-elevated flex items-center justify-center border-2 border-border shadow-sm shrink-0 box-content border-primary/50 transition-colors">
                <div
                  className="h-3 w-3 rounded-full shadow-sm transition-colors duration-500"
                  style={{ backgroundColor: statusColor }}
                />
              </div>

              {/* Slider Track and Labels */}
              <div className="flex-1 flex flex-col justify-center gap-1.5">
                <div className="flex items-baseline justify-between w-full mb-1 px-1">
                  <div className="flex items-center gap-2">
                    <span className="panel-title text-[12px] font-bold text-muted-foreground dark:text-slate-400 tracking-wide uppercase">
                      Flow Difference
                    </span>
                    {manualValue !== null && (
                      <button
                        onClick={() => setManualValue(null)}
                        className="text-[10px] text-primary/60 hover:text-primary transition-colors uppercase font-bold"
                      >
                        (Reset)
                      </button>
                    )}
                  </div>
                  <span
                    className="text-[12px] font-bold tabular-nums flex-shrink-0 antialiased transition-colors duration-500"
                    style={{ color: statusColor }}
                  >
                    {flowDiff > 0 ? `+${flowDiff}` : flowDiff}{" "}
                    <span className="font-medium ml-0.5 antialiased">gpm</span>
                  </span>
                </div>

                <div
                  ref={trackRef}
                  onMouseDown={onMouseDown}
                  className="h-2 w-full bg-muted/50 dark:bg-black/40 rounded-full overflow-visible border border-border/30 dark:border-white/5 relative cursor-pointer"
                >
                  {/* Background segments for visualization */}
                  <div className="absolute inset-0 flex overflow-hidden rounded-full opacity-20 pointer-events-none">
                    <div className="flex-[50] h-full bg-[#ef4444]" />
                    <div className="flex-[30] h-full bg-[#f59f0a]" />
                    <div className="flex-[40] h-full bg-[#1ccd5e]" />
                    <div className="flex-[30] h-full bg-[#f59f0a]" />
                    <div className="flex-[50] h-full bg-[#ef4444]" />
                  </div>

                  {/* Center Line (Zero point) */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-muted-foreground/30 dark:bg-slate-500 z-0 pointer-events-none" />

                  {/* Indicator Line (from center to thumb) */}
                  <div
                    className="absolute top-0 bottom-0 transition-all duration-500 ease-out pointer-events-none"
                    style={{
                      left: flowDiff >= 0 ? "50%" : `${position}%`,
                      width: `${Math.abs(position - 50)}%`,
                      backgroundColor: statusColor,
                      opacity: 0.3,
                    }}
                  />

                  {/* Interactive Thumb */}
                  <div
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-white dark:border-slate-300 shadow-lg transition-all ease-out z-10 pointer-events-none",
                      isDragging ? "duration-0" : "duration-500",
                    )}
                    style={{
                      left: `${position}%`,
                      backgroundColor: statusColor,
                      boxShadow: `0 0 12px ${statusColor}`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-[60px] w-px bg-black dark:bg-white mx-7" />

          {/* Center Section: Choke Gauges */}
          <div className="flex">
            <div className="flex items-center pr-5 h-full bg-transparent shrink-0">
              <div className="flex items-center justify-center">
                <SemiCircleGauge
                  labelA="Choke A"
                  valueA={10}
                  colorA={COLORS.data.safe}
                  labelB="Set Point"
                  valueB={85}
                  colorB={COLORS.data.danger}
                />
              </div>
            </div>

            <div className=" flex items-center pl-5 h-full bg-transparent shrink-0">
              <div className="flex items-center justify-center">
                <SemiCircleGauge
                  labelA="Choke B"
                  valueA={78}
                  colorA={COLORS.data.warning}
                  labelB="Set Point"
                  valueB={85}
                  colorB={COLORS.data.danger}
                />
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-[60px] w-px bg-black dark:bg-white mx-7" />

          {/* Right Section: Auto-Status Bars */}
          <div className="flex-[1] flex flex-col justify-center gap-2.5">
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider shrink-0">
                AUTO CONTROL
              </span>
              <div className="flex-1 h-3.5 bg-muted/20 dark:bg-black/40 rounded-[2px] border border-border/20 dark:border-white/5 p-[1px]">
                <SegmentedBar
                  count={25}
                  fillCount={2}
                  emptyColor="bg-black/15 dark:bg-white/20"
                  color="bg-primary shadow-glow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[12px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider shrink-0">
                AUTO DETECTION
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[12px] font-bold text-primary">ON</span>
                <div className="flex-1 h-3.5 bg-muted/20 dark:bg-black/40 rounded-[2px] border border-border/20 dark:border-white/5 p-[1px]">
                  <SegmentedBar
                    count={25}
                    fillCount={18}
                    color="bg-primary shadow-glow-sm"
                    emptyColor="bg-black/15 dark:bg-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Connectivity Indicators */}
        <div className="flex flex-col justify-center gap-2.5 px-3 border-l border-border/30 dark:border-white/5 h-full">
          <div className="flex items-center gap-2">
            <div className="status-indicator online" />
            <span className="text-success text-[12px] font-bold uppercase tracking-wider whitespace-nowrap">
              Live
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator online" />
            <span className="text-success text-[12px] font-bold uppercase tracking-wider whitespace-nowrap">
              System Hydraulics
            </span>
          </div>
        </div>
      </div>

      <PopoverContent
        align="start"
        side="top"
        sideOffset={12}
        className="w-auto p-0 border-none outline-none shadow-2xl"
      >
        <FlowControlStack />
      </PopoverContent>
    </Popover>
  );
}
