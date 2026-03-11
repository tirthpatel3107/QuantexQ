import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { appendChartPoint } from "@/utils/data/mockData";
import { formatElapsedSeconds } from "@/utils/lib/date-utils";
import {
  CHART_UPDATE_INTERVAL_MS,
  TIMER_TICK_MS,
} from "@/utils/constants/config";
import type { SimulationProviderProps, ChartDataState } from "./types";
import { INITIAL_CHART_DATA, CHART_KEYS } from "./constants";
import { SimulationStateContext, SimulationDataContext } from "./context";

/**
 * Simulation Context Provider
 *
 * Manages the real-time simulation state, including:
 * - Running status of the operations
 * - Accumulated chart data for all metrics
 * - Elapsed mission time
 *
 * Performance optimizations:
 * - Memoized context values to prevent unnecessary re-renders
 * - Batched chart updates with configurable intervals
 * - Efficient state updates using functional setState
 */
export function SimulationProvider({ children }: SimulationProviderProps) {
  const [isRunning, setRunningState] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [chartData, setChartData] =
    useState<ChartDataState>(INITIAL_CHART_DATA);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setRunning = useCallback((running: boolean) => {
    setRunningState(running);
    setElapsedSeconds(0);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Batch chart updates for better performance
    intervalRef.current = setInterval(() => {
      // Use functional update to avoid stale closures
      setChartData((prev) => {
        const next = { ...prev };
        // Update all chart keys in a single render cycle
        for (const key of CHART_KEYS) {
          next[key] = appendChartPoint(prev[key], key);
        }
        return next;
      });
    }, CHART_UPDATE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(
      () => setElapsedSeconds((prev) => prev + 1),
      TIMER_TICK_MS,
    );
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  const showTimer = isRunning;
  const formattedElapsed = useMemo(
    () => formatElapsedSeconds(elapsedSeconds),
    [elapsedSeconds],
  );

  const stateValue = useMemo(
    () => ({
      isRunning,
      setRunning,
      showTimer,
    }),
    [isRunning, setRunning, showTimer],
  );

  const dataValue = useMemo(
    () => ({
      chartData,
      elapsedSeconds,
      formattedElapsed,
    }),
    [chartData, elapsedSeconds, formattedElapsed],
  );

  return (
    <SimulationStateContext.Provider value={stateValue}>
      <SimulationDataContext.Provider value={dataValue}>
        {children}
      </SimulationDataContext.Provider>
    </SimulationStateContext.Provider>
  );
}
