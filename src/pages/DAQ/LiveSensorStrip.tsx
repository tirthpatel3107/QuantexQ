import React from "react";
import ReactECharts from "echarts-for-react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { ThemeProviderContext } from "@/context/theme";

interface LiveSensorStripProps {
  title?: string;
  sensorValue?: string;
  unit?: string;
  depth?: string;
  className?: string;
}

/**
 * LiveSensorStrip Component
 *
 * A specialized horizontal strip chart mimic from the provided design.
 */
export function LiveSensorStrip({
  title = "TEMP",
  sensorValue: initialValue = "85",
  unit = "°F",
  depth = "61,40",
  className,
}: LiveSensorStripProps) {
  const { theme } = React.useContext(ThemeProviderContext);
  const isDark = theme === "dark" || theme === "midnight";

  const [data, setData] = React.useState(() =>
    Array.from({ length: 120 }).map(() => 20 + Math.random() * 40),
  );
  const [val, setVal] = React.useState(parseFloat(initialValue));

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push(20 + Math.random() * 40);
        return newData;
      });
      setVal((v) => v + (Math.random() - 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const option = {
    animation: false,
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    xAxis: {
      type: "category",
      show: false,
    },
    yAxis: {
      type: "value",
      show: false,
      min: 0,
      max: 100,
    },
    series: [
      {
        type: "bar",
        barWidth: "70%",
        itemStyle: {
          color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)",
        },
        data: data,
      },
    ],
  };

  return (
    <PanelCard
      title="Live Sensor Data"
      className={className}
      contentClassName="p-0"
    >
      <div className="relative w-full rounded flex flex-col font-sans chart-bg-light overflow-hidden">
        {/* Background Texture Overlay */}
        {/* <div className="absolute inset-0 opacity-[0.15] pointer-events-none" /> */}

        {/* Header text */}

        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${isDark ? "text-white/60" : "text-muted-foreground/70"}`}
          >
            Dear TO connected erser
          </span>
          <div className="flex gap-3 items-center">
            {/* Row 1: Temp */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span
                  className={`text-sm ${isDark ? "text-white/70" : "text-muted-foreground"}`}
                >
                  {title}
                </span>
                <div
                  className={`px-2 py-0.5 rounded flex items-baseline gap-1 shadow-sm ${isDark ? "bg-black/30 border border-white/20" : "bg-muted/50 border border-border/30"}`}
                >
                  <span
                    className={`text-sm font-bold tabular-nums tracking-wide ${isDark ? "text-white" : "text-foreground"}`}
                  >
                    {val.toFixed(0)}
                  </span>
                  <span
                    className={`text-sm ${isDark ? "text-white/70" : "text-muted-foreground"}`}
                  >
                    {unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Depth */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span
                  className={`text-sm tracking-tighter uppercase font-medium ${isDark ? "text-white/70" : "text-muted-foreground"}`}
                >
                  Depth
                </span>
                <div
                  className={`flex items-baseline gap-1.5 pl-2 pr-1.5 py-0.5 rounded shadow-sm ${isDark ? "bg-black/30 border border-white/20" : "bg-muted/50 border border-border/30"}`}
                >
                  <span
                    className={`text-sm font-bold tabular-nums tracking-wide ${isDark ? "text-white" : "text-foreground"}`}
                  >
                    {depth}
                  </span>
                  <span
                    className={`text-sm ${isDark ? "text-white/70" : "text-muted-foreground"}`}
                  >
                    ft
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Chart Area */}
        <div
          className={`flex-1 mt-5 min-w-0 relative pl-2 ${isDark ? "border-l border-white/20" : "border-l border-border/30"}`}
        >
          {/* Vertical Grid Background lines */}
          <div
            className={`absolute inset-0 flex justify-between px-1 ${isDark ? "opacity-[0.15]" : "opacity-[0.08]"}`}
          >
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className={`w-[1px] ${isDark ? "bg-white" : "bg-foreground"}`}
              />
            ))}
          </div>

          <div className="h-[70px] mt-1 relative z-10">
            <ReactECharts
              option={option}
              style={{ height: "100%", width: "100%" }}
              opts={{ renderer: "canvas" }}
            />
          </div>

          {/* Mimicked specific weird time labels from mockup */}
          <div
            className={`mt-1 flex justify-between text-[14px] font-mono tracking-tighter uppercase select-none ${isDark ? "text-white/60" : "text-muted-foreground/60"}`}
          >
            <span>0</span>
            <span>10:00</span>
            <span>20:00</span>
            <span>20:00</span>
            <span>40:00</span>
            <span>50:00</span>
            <span>40:00</span>
            <span>90:00</span>
            <span>80:00</span>
            <span>60:00</span>
            <span>70:00</span>
            <span>80:00</span>
            <span>76:00</span>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
