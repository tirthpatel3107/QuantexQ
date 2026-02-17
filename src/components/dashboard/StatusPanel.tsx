import { cn } from "@/lib/utils";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";

/** SVG donut slice: angle in radians, 0 = right, clockwise */
function getDonutPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const x1 = cx + outerR * Math.cos(startAngle);
  const y1 = cy + outerR * Math.sin(startAngle);
  const x2 = cx + outerR * Math.cos(endAngle);
  const y2 = cy + outerR * Math.sin(endAngle);
  const x3 = cx + innerR * Math.cos(endAngle);
  const y3 = cy + innerR * Math.sin(endAngle);
  const x4 = cx + innerR * Math.cos(startAngle);
  const y4 = cy + innerR * Math.sin(startAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z`;
}

const PAD_RAD = (2 * Math.PI) / 180;

function DonutChart({
  data,
  size,
  innerR,
  outerR,
}: {
  data: { label: string; value: number; color: string }[];
  size: number;
  innerR: number;
  outerR: number;
}) {
  const sum = data.reduce((a, s) => a + s.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  let acc = -Math.PI / 2; // start from top
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      {data.map((slice) => {
        const ratio = Math.max(0, slice.value) / sum;
        const start = acc;
        acc += ratio * 2 * Math.PI;
        const end = acc;
        acc += PAD_RAD;
        return (
          <path
            key={slice.label}
            d={getDonutPath(cx, cy, innerR, outerR, start, end)}
            fill={slice.color}
          />
        );
      })}
    </svg>
  );
}

interface StatusItem {
  label: string;
  value: string;
  unit?: string;
  status?: "normal" | "warning" | "critical";
}

interface StatusPanelProps {
  title: string;
  items: StatusItem[];
  statusIndicator?: "normal" | "warning" | "critical";
  pieData?: {
    label: string;
    value: number;
    unit?: string;
    status?: "normal" | "warning" | "critical";
  }[];
}

export function StatusPanel({
  title,
  items,
  statusIndicator,
  pieData,
}: StatusPanelProps) {
  const showSkeleton = useInitialSkeleton();

  if (showSkeleton) {
    return (
      <div className="dashboard-panel">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            {statusIndicator && (
              <div className="skeleton h-2.5 w-2.5 rounded-full" />
            )}
            <div className="skeleton h-4 w-28 rounded-md" />
          </div>
        </div>

        <div className="p-3 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
            >
              <span className="skeleton h-3 w-24 rounded-md" />
              <span className="skeleton h-3 w-14 rounded-md" />
            </div>
          ))}
        </div>

        <div className="p-3 pt-1 border-t border-border/40">
          <div className="skeleton h-40 w-full rounded-md" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="skeleton h-2.5 w-2.5 rounded-full" />
                <span className="flex-1 flex items-center justify-between">
                  <span className="skeleton h-3 w-16 rounded-md" />
                  <span className="skeleton h-3 w-10 rounded-md" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pieColors: Record<string, string> = {
    normal: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    critical: "hsl(var(--destructive))",
    default: "hsl(var(--primary))",
  };

  const normalizedPieData =
    pieData?.map((slice) => ({
      ...slice,
      value: Math.max(0, Number.isFinite(slice.value) ? slice.value : 0),
      color: pieColors[slice.status || ""] || pieColors.default,
    })) || [];

  const showPie = normalizedPieData.length > 0;

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          {statusIndicator && (
            <div
              className={cn(
                "status-indicator",
                statusIndicator === "normal" && "online",
                statusIndicator === "warning" && "warning",
                statusIndicator === "critical" && "offline",
              )}
            />
          )}
          <h3 className="panel-title">{title}</h3>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
          >
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span
              className={cn(
                "text-sm font-medium tabular-nums",
                item.status === "warning" && "text-warning",
                item.status === "critical" && "text-destructive",
                (!item.status || item.status === "normal") && "text-foreground",
              )}
            >
              {item.value}
              {item.unit && (
                <span className="text-xs text-muted-foreground ml-1">
                  {item.unit}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {showPie && (
        <div className="p-3 pt-1 border-t border-border/40">
          <div className="h-40 flex items-center justify-center">
            <DonutChart
              data={normalizedPieData}
              size={120}
              innerR={35}
              outerR={60}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            {normalizedPieData.map((slice) => (
              <div key={slice.label} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="flex-1 flex items-center justify-between">
                  <span>{slice.label}</span>
                  <span className="tabular-nums text-foreground">
                    {slice.value}
                    {slice.unit && (
                      <span className="text-muted-foreground ml-1">
                        {slice.unit}
                      </span>
                    )}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
