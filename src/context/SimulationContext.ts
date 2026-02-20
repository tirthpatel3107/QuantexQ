import { createContext } from "react";
import {
  flowData,
  densityData,
  surfacePressureData,
  standpipePressureData,
  bottomHolePressureData,
  chokeChartData,
} from "@/data/mockData";
import { ChartDataKey, ChartDataset } from "@/types/chart";

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

export const SimulationStateContext = createContext<SimulationStateContextValue | null>(
  null,
);
export const SimulationDataContext = createContext<SimulationDataContextValue | null>(
  null,
);

export const CHART_KEYS: ChartDataKey[] = [
  "flow",
  "density",
  "surfacePressure",
  "standpipePressure",
  "bottomHolePressure",
  "choke",
];
