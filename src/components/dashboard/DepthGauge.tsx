import { memo, useMemo } from "react";

import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DepthGaugeProps {
  currentDepth: number;
  targetDepth: number;
  bitDepth: number;
  rateOfPenetration: number;
}

export const DepthGauge = memo(function DepthGauge({
  currentDepth,
  targetDepth,
  bitDepth,
  rateOfPenetration,
  className,
}: DepthGaugeProps & { className?: string }) {
  const showSkeleton = useInitialSkeleton();

  const progress = useMemo(
    () => Math.min(100, Math.max(0, (currentDepth / targetDepth) * 100)),
    [currentDepth, targetDepth],
  );

  // Generate depth markers once per target change to avoid recreating arrays every render.
  const markers = useMemo(() => {
    const values: number[] = [];
    const step = targetDepth / 5;
    for (let i = 0; i <= 5; i++) {
      values.push(Math.round(step * i));
    }
    return values;
  }, [targetDepth]);

  if (showSkeleton) {
    return (
      <div className={cn("dashboard-panel h-full", className)}>
        <div className="panel-header flex-col items-center gap-1 text-center px-2.5 py-3">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <div className="px-2.5 py-2 flex flex-col gap-0 h-[calc(100%-52px)]">
          <Skeleton className="h-10 w-40 mx-auto mb-3" />

          <Skeleton className="flex-1 min-h-0 rounded-lg" />

          <div className="grid gap-2 grid-cols-1 mt-2 pt-2 border-t border-border">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("dashboard-panel h-full flex flex-col", className)}>
      <div className="panel-header flex-col items-center gap-1 text-center px-2.5 py-4">
        <h3 className="panel-title">Drill Depth</h3>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Target:</span>
          <span className="text-xs font-medium text-foreground">
            {targetDepth.toLocaleString()} ft
          </span>
        </div>
      </div>

      <hr className="px-2" />

      <div className="chart-card px-2.5 py-4 flex flex-col flex-1 min-h-0 gap-0">
        {/* Current Depth Display */}
        <div className="text-center mb-2">
          <div className="text-2xl font-bold text-primary glow-primary tabular-nums">
            {currentDepth.toLocaleString()}
            <span className="text-lg font-normal text-muted-foreground ml-1">
              ft
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 my-1">
            <span className="text-success text-sm font-medium">
              +{rateOfPenetration.toFixed(1)} ft/hr
            </span>
          </div>
        </div>

        {/* Visual Gauge */}
        <div className="flex-1 flex justify-center gap-4 min-h-0 mb-4">
          {/* Depth Scale */}
          <div className="flex flex-col justify-between text-xs text-muted-foreground tabular-nums w-12 py-1">
            {markers.map((depth, i) => (
              <span key={i} className="text-right">
                {depth.toLocaleString()}
              </span>
            ))}
          </div>

          {/* Gauge Bar */}
          <div className="w-12 shrink-0 relative">
            {/* Background track */}
            <div className="absolute inset-0 bg-muted rounded-lg overflow-hidden border border-border/20">
              {/* Grid lines - providing visual depth context */}
              {markers.slice(1, -1).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-border/30"
                  style={{ top: `${((i + 1) / 5) * 100}%` }}
                />
              ))}

              {/* Progress fill - interactive gradient representing drilling progress */}
              <div
                className="absolute left-0 right-0 top-0 bg-gradient-to-b from-primary via-success to-warning transition-all duration-500"
                style={{ height: `${progress}%` }}
              />

              {/* Current depth indicator thumb */}
              <div
                className="absolute left-0 right-0 h-1 bg-white shadow-glow-sm transition-all duration-500 z-10"
                style={{ top: `${progress}%`, transform: "translateY(-50%)" }}
              >
                <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2">
                  <div className="bg-card border border-border text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-sm">
                    {currentDepth.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unit label */}
          <div className="flex flex-col justify-center shrink-0">
            <span className="text-xs text-muted-foreground -rotate-90 origin-center whitespace-nowrap">
              feet
            </span>
          </div>
        </div>

        <hr />

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 gap-3 mt-4">
          <DetailRow label="BIT DEPTH" value={bitDepth} unit="ft" />
          <DetailRow 
            label="REMAINING" 
            value={targetDepth - currentDepth} 
            unit="ft" 
            valueClassName="text-warning"
          />
        </div>
      </div>
    </div>
  );
});

/**
 * Subcomponent for displaying a labeled value row
 */
const DetailRow = ({ 
  label, 
  value, 
  unit, 
  valueClassName 
}: { 
  label: string; 
  value: number; 
  unit: string; 
  valueClassName?: string;
}) => (
  <div className="flex justify-between items-baseline">
    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
      {label}
    </div>
    <div className={cn("text-[14px] font-bold tabular-nums", valueClassName)}>
      {value.toLocaleString()} <span className="text-[11px] font-medium text-muted-foreground ml-0.5">{unit}</span>
    </div>
  </div>
);
