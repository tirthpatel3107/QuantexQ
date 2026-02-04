import { memo, useMemo } from "react";

import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";

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
}: DepthGaugeProps) {
  const showSkeleton = useInitialSkeleton();

  const progress = useMemo(
    () => Math.min(100, Math.max(0, (currentDepth / targetDepth) * 100)),
    [currentDepth, targetDepth]
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
      <div className="dashboard-panel h-full">
        <div className="panel-header">
          <div className="skeleton h-4 w-28 rounded-md" />
          <div className="flex items-center gap-2">
            <div className="skeleton h-3 w-16 rounded-md" />
            <div className="skeleton h-4 w-20 rounded-md" />
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4 h-[calc(100%-52px)]">
          <div className="skeleton h-10 w-40 mx-auto rounded-md" />

          <div className="skeleton h-full w-full rounded-lg" />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="skeleton h-3 w-20 rounded-md" />
              <div className="skeleton h-4 w-24 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="skeleton h-3 w-20 rounded-md" />
              <div className="skeleton h-4 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel h-full">
      <div className="panel-header">
        <h3 className="panel-title">Drill Depth</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Target:</span>
          <span className="text-xs font-medium text-foreground">
            {targetDepth.toLocaleString()} ft
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col h-[calc(100%-52px)]">
        {/* Current Depth Display */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-primary glow-primary tabular-nums">
            {currentDepth.toLocaleString()}
            <span className="text-lg font-normal text-muted-foreground ml-1">ft</span>
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-success text-sm font-medium">
              +{rateOfPenetration.toFixed(1)} ft/hr
            </span>
          </div>
        </div>

        {/* Visual Gauge */}
        <div className="flex-1 flex gap-3 min-h-0">
          {/* Depth Scale */}
          <div className="flex flex-col justify-between text-xs text-muted-foreground tabular-nums w-12 py-1">
            {markers.map((depth, i) => (
              <span key={i} className="text-right">
                {depth.toLocaleString()}
              </span>
            ))}
          </div>

          {/* Gauge Bar */}
          <div className="flex-1 relative min-w-[72px]">
            {/* Background track */}
            <div className="absolute inset-0 bg-muted rounded-lg overflow-hidden">
              {/* Grid lines */}
              {markers.slice(1, -1).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-border/30"
                  style={{ top: `${((i + 1) / 5) * 100}%` }}
                />
              ))}

              {/* Progress fill */}
              <div
                className="absolute left-0 right-0 top-0 bg-gradient-to-b from-primary via-success to-warning transition-all duration-500"
                style={{ height: `${progress}%` }}
              />

              {/* Current depth indicator */}
              <div
                className="absolute left-0 right-0 h-1 bg-white shadow-lg transition-all duration-500"
                style={{ top: `${progress}%`, transform: "translateY(-50%)" }}
              >
                <div className="absolute right-full mr-1 top-1/2 -translate-y-1/2">
                  <div className="bg-white text-background text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                    {currentDepth.toLocaleString()} ft
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unit label */}
          <div className="w-6 flex flex-col justify-center">
            <span className="text-xs text-muted-foreground -rotate-90 origin-center whitespace-nowrap">
              feet
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-border">
          <div>
            <div className="text-xs text-muted-foreground">Bit Depth</div>
            <div className="text-sm font-semibold tabular-nums">
              {bitDepth.toLocaleString()} ft
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Remaining</div>
            <div className="text-sm font-semibold tabular-nums text-warning">
              {(targetDepth - currentDepth).toLocaleString()} ft
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
