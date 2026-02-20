import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import { formatElapsedSeconds } from "@/lib/date-utils";
import { appendChartPoint } from "@/data/mockData";
import { CHART_UPDATE_INTERVAL_MS, TIMER_TICK_MS } from "@/constants/config";
import {
  SimulationStateContext,
  SimulationDataContext,
  INITIAL_CHART_DATA,
  CHART_KEYS,
  ChartDataState,
} from "./SimulationContext";

/**
 * Simulation Context Provider
 *
 * Manages the real-time simulation state, including:
 * - Running status of the operations
 * - Accumulated chart data for all metrics
 * - Elapsed mission time
 */
export function SimulationProvider({ children }: { children: ReactNode }) {
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
    intervalRef.current = setInterval(() => {
      setChartData((prev) => {
        const next = { ...prev };
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
