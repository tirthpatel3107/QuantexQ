import React, {
  useState,
  useMemo,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/dashboard/Header";
import { VerticalChartCard } from "@/components/dashboard/VerticalChartCard";
import { DepthGauge } from "@/components/dashboard/DepthGauge";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { useSimulationData } from "@/hooks/useSimulation";
import {
  CENTER_CARDS,
  metricsFromLatestPoint,
} from "@/data/dashboardChartConfig";

import { TimeAxisCard } from "@/components/dashboard/TimeAxisCard";
import { FlowDifferenceBar } from "@/components/dashboard/FlowDifferenceBar";

/**
 * Main Dashboard Landing Page
 *
 * This page assembles the primary monitoring interface including:
 * - Real-time vertical charts for various drilling metrics
 * - Flow difference control and monitoring bar
 * - Depth and ROP gauges
 * - Pump status management
 */
export default function Index() {
  // State for controlling various UI dialogs and interactions
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Custom hooks for application state and simulation logic
  const showSkeleton = useInitialSkeleton();
  const { chartData } = useSimulationData();

  /**
   * Toggles the expansion state of a chart card
   */
  const handleCardDoubleClick = useCallback((id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  }, []);

  /**
   * Memoized mapping of chart data keys to their respective datasets
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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation and Branding */}
      <Header />

      <main
        className="flex-1 p-2 sm:p-3 flex flex-col overflow-hidden"
        onClick={() => setExpandedCardId(null)}
      >
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          <div className="grid flex-1 min-h-0 gap-3 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,12%)]">
            {/* Left/Center Section: Charts and Flow Bar */}
            <div className="min-w-0 flex flex-col gap-3 overflow-x-hidden">
              <div className="flex gap-2 items-stretch w-full flex-1 min-h-0">
                {/* Unified Time Axis - provides common scale for all charts */}
                <TimeAxisCard
                  data={chartData.flow || []}
                  className="w-[80px] flex-shrink-0"
                />

                {/* Dynamically render metric cards based on configuration */}
                {CENTER_CARDS.map((card) => {
                  const data = cardDataMap[card.chartKey];
                  const latestPoint = data?.length
                    ? data[data.length - 1]
                    : undefined;

                  // Extract specific metrics for the card header
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

              {/* Interactive Flow Management Bar */}
              <div className="h-[95px] shrink-0">
                <FlowDifferenceBar showSkeleton={showSkeleton} />
              </div>
            </div>

            {/* Right Section: Depth and Bit Position Gauges */}
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

      {/* Overlays and Dialogs */}
    </div>
  );
}
