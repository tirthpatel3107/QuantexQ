import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
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
  type ChartDataset,
} from "@/data/mockData";

export type ChartDataKey =
  | "flow"
  | "density"
  | "surfacePressure"
  | "standpipePressure"
  | "bottomHolePressure"
  | "choke";

export type ChartDataState = Record<ChartDataKey, ChartDataset>;

const INITIAL_CHART_DATA: ChartDataState = {
  flow: flowData,
  density: densityData,
  surfacePressure: surfacePressureData,
  standpipePressure: standpipePressureData,
  bottomHolePressure: bottomHolePressureData,
  choke: chokeChartData,
};

interface SimulationContextValue {
  isRunning: boolean;
  setRunning: (running: boolean) => void;
  chartData: ChartDataState;
  /** Elapsed seconds since start; updates every second when running, freezes when stopped */
  elapsedSeconds: number;
  /** True when timer+stop UI should be shown (only while running; hides on stop) */
  showTimer: boolean;
  /** Formatted elapsed time e.g. "0:00:09" */
  formattedElapsed: string;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [isRunning, setRunningState] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [chartData, setChartData] = useState<ChartDataState>(INITIAL_CHART_DATA);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setRunning = useCallback((running: boolean) => {
    setRunningState(running);
    setElapsedSeconds(0); // Reset on both start and stop; hide on stop
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
      setChartData((prev) => ({
        flow: appendChartPoint(prev.flow, "flow"),
        density: appendChartPoint(prev.density, "density"),
        surfacePressure: appendChartPoint(prev.surfacePressure, "surfacePressure"),
        standpipePressure: appendChartPoint(prev.standpipePressure, "standpipePressure"),
        bottomHolePressure: appendChartPoint(prev.bottomHolePressure, "bottomHolePressure"),
        choke: appendChartPoint(prev.choke, "choke"),
      }));
    }, 5000);

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
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  const showTimer = isRunning;
  const formattedElapsed = formatElapsed(elapsedSeconds);

  const value: SimulationContextValue = {
    isRunning,
    setRunning,
    chartData,
    elapsedSeconds,
    showTimer,
    formattedElapsed,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }
  return ctx;
}
