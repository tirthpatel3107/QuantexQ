// React & Hooks
import { useState, useMemo, useCallback } from "react";

// Hooks
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";

// Components - Local
import { VerticalChartCard } from "@/components/features/dashboard/VerticalChartCard";
import { DepthGauge } from "@/components/features/dashboard/DepthGauge";
import { TimeAxisCard } from "@/components/features/dashboard/TimeAxisCard";
import { FlowDifferenceBar } from "@/components/features/dashboard/FlowDifferenceBar";

// Services & API

// Types & Schemas

// Contexts
import { useSimulationData } from "@/context/simulation";

// Utils & Constants
import { cn } from "@/utils/lib/utils";
import {
  CENTER_CARDS,
  metricsFromLatestPoint,
} from "@/utils/data/dashboardChartConfig";

/**
 * Dashboard Component
 *
 * The main operational view of the application. It displays real-time
 * drilling metrics through a series of vertical charts and gauges.
 *
 * Key features:
 * - Responsive grid layout with dynamic chart expansion
 * - Unified time axis for synchronized data visualization
 * - Integration with simulation data hook
 * - Interactive flow management and depth monitoring
 */
export default function Dashboard() {
  // State for controlling which chart card is currently expanded for detail view
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Custom hooks for global application state and real-time simulation logic
  const showSkeleton = useInitialSkeleton();
  const { chartData } = useSimulationData();

  /**
   * Toggles the expansion state of a chart card.
   * On double click, the card takes more space in the grid.
   *
   * @param id The unique identifier of the card to toggle
   */
  const handleCardDoubleClick = useCallback((id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  }, []);

  /**
   * Memoized mapping of chart data keys to their respective datasets.
   * This simplifies data access during render and prevents unnecessary calculations.
   */
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
    <main
      className="flex-1 p-2 sm:p-3 flex flex-col overflow-hidden"
      onClick={() => setExpandedCardId(null)}
    >
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="grid flex-1 min-h-0 gap-3 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,12%)]">
          {/* Left/Center Section: Primary Data Visualization Charts */}
          <div className="min-w-0 flex flex-col gap-3 overflow-x-hidden">
            <div className="flex gap-2 items-stretch w-full flex-1 min-h-0">
              {/* Unified Time Axis - provides a shared temporal reference for all charts */}
              <TimeAxisCard
                data={chartData.flow || []}
                className="w-[80px] flex-shrink-0"
              />

              {/* Dynamically render metric cards based on CENTER_CARDS configuration */}
              {CENTER_CARDS.map((card) => {
                const data = cardDataMap[card.chartKey];
                const latestPoint = data?.length
                  ? data[data.length - 1]
                  : undefined;

                // Extract and format specific metrics for the card header display
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
                    hideYAxis={true}
                    className={cn(
                      "transition-all duration-500 ease-in-out",
                      isExpanded ? "flex-[2.5]" : "flex-1",
                    )}
                  />
                );
              })}
            </div>

            {/* Bottom Section: Interactive Flow Management and Status Bar */}
            <div className="h-[95px] shrink-0">
              <FlowDifferenceBar showSkeleton={showSkeleton} />
            </div>
          </div>

          {/* Right Section: Specialized Depth and Bit Position Gauges */}
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
  );
}
