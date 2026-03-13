import React, { memo } from "react";

interface SemiCircleGaugeProps {
  valueA: number;
  valueB: number;
  labelA: string;
  labelB: string;
  colorA: string;
  colorB: string;
}

export const SemiCircleGauge = memo(function SemiCircleGauge({
  valueA,
  valueB,
  labelA,
  labelB,
  colorA,
  colorB,
}: SemiCircleGaugeProps) {
  const strokeWidth = 5;

  const normalizedA = Math.min(Math.max(valueA, 0), 100);
  const normalizedB = Math.min(Math.max(valueB, 0), 100);

  // Path definitions scaled up and centered
  const outerPath = "M 15 45 A 35 35 0 0 1 85 45";
  const innerPath = "M 25 45 A 25 25 0 0 1 75 45";

  const outerCircumference = Math.PI * 35;
  const innerCircumference = Math.PI * 25;

  const offsetA = outerCircumference - (normalizedA / 100) * outerCircumference;
  const offsetB = innerCircumference - (normalizedB / 100) * innerCircumference;

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg
          width="100"
          height="60"
          viewBox="0 0 100 60"
          className="overflow-visible"
        >
          {/* Outer Track */}
          <path
            d={outerPath}
            fill="none"
            className="stroke-muted/30 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Outer Progress (A) */}
          <path
            d={outerPath}
            fill="none"
            stroke={colorA}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={outerCircumference}
            strokeDashoffset={offsetA}
            className="transition-all duration-1000 ease-in-out"
            style={{ filter: `drop-shadow(0 0 4px ${colorA}44)` }}
          />

          {/* Inner Track */}
          <path
            d={innerPath}
            fill="none"
            className="stroke-muted/30 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Inner Progress (B) */}
          <path
            d={innerPath}
            fill="none"
            stroke={colorB}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={innerCircumference}
            strokeDashoffset={offsetB}
            className="transition-all duration-1000 ease-in-out"
            style={{ filter: `drop-shadow(0 0 4px ${colorB}44)` }}
          />

          {/* Range Labels */}
          <text
            x="18"
            y="60"
            textAnchor="middle"
            className="fill-muted-foreground/60 dark:fill-slate-500 font-bold"
            style={{ fontSize: "9px" }}
          >
            0
          </text>
          <text
            x="80"
            y="60"
            textAnchor="middle"
            className="fill-muted-foreground/60 dark:fill-slate-500 font-bold"
            style={{ fontSize: "9px" }}
          >
            100
          </text>

          {/* End Markers (Decorative) */}
          <circle
            cx="15"
            cy="45"
            r="1.5"
            className="fill-muted/50 dark:fill-slate-700"
          />
          <circle
            cx="85"
            cy="45"
            r="1.5"
            className="fill-muted/50 dark:fill-slate-700"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-1">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colorA }}
            />
            <span className="text-[12px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider pr-1">
              {labelA}
            </span>
          </div>
          <div className="text-[12px] font-bold text-foreground dark:text-white tabular-nums">
            {" "}
            {valueA}%
          </div>
        </div>
        <div className="flex flex-1">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colorB }}
            />
            <span className="text-[12px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider pr-1">
              {labelB}
            </span>
          </div>
          <div className="text-[12px] font-bold text-foreground dark:text-white tabular-nums">
            {" "}
            {valueB}%
          </div>
        </div>
      </div>
    </div>
  );
});
