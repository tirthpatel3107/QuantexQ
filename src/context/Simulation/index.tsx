import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import {
  flowData,
  densityData,
  surfacePressureData,
  standpipePressureData,
  bottomHolePressureData,
  chokeChartData,
  appendChartPoint,
} from "@/utils/data/mockData";
import { ChartDataKey, ChartDataset } from "@/utils/types/chart";
import { formatElapsedSeconds } from "@/utils/lib/date-utils";
import {
  CHART_UPDATE_INTERVAL_MS,
  TIMER_TICK_MS,
} from "@/utils/constants/config";

export type ChartDataState = Record<ChartDataKey, ChartDataset>;

export const INITIAL_CHART_DATA: ChartDataState = {
  flow: flowData,
  density: densityData,
  surfacePressure: surfacePressureData,
  standpipePressure: standpipePressureData,
  bottomHolePressure: bottomHolePressureData,
  choke: chokeChartData,
};

export interface SimulationStateContextValue {
  isRunning: boolean;
  setRunning: (running: boolean) => void;
  showTimer: boolean;
}

export interface SimulationDataContextValue {
  chartData: ChartDataState;
  elapsedSeconds: number;
  formattedElapsed: string;
}

export const SimulationStateContext =
  createContext<SimulationStateContextValue | null>(null);
export const SimulationDataContext =
  createContext<SimulationDataContextValue | null>(null);

export const CHART_KEYS: ChartDataKey[] = [
  "flow",
  "density",
  "surfacePressure",
  "standpipePressure",
  "bottomHolePressure",
  "choke",
];

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

/**
 * Combined hook to access both simulation state and real-time data.
 * @returns Object containing isRunning, setRunning, chartData, etc.
 * @throws Error if used outside of SimulationProvider
 */
export function useSimulation() {
  const state = useContext(SimulationStateContext);
  const data = useContext(SimulationDataContext);

  if (!state || !data) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }

  return { ...state, ...data };
}

/**
 * Hook to access only the simulation control state (isRunning, setRunning).
 * Use this to avoid unnecessary re-renders when only controls are needed.
 * @returns SimulationStateContext value
 */
export function useSimulationState() {
  const state = useContext(SimulationStateContext);
  if (!state) {
    throw new Error(
      "useSimulationState must be used within SimulationProvider",
    );
  }
  return state;
}

/**
 * Hook to access only the real-time simulation data (chartData, elapsedSeconds).
 * @returns SimulationDataContext value
 */
export function useSimulationData() {
  const data = useContext(SimulationDataContext);
  if (!data) {
    throw new Error("useSimulationData must be used within SimulationProvider");
  }
  return data;
}
