import type { ReactNode } from "react";
import { ChartDataKey, ChartDataset } from "@/utils/types/chart";

export type ChartDataState = Record<ChartDataKey, ChartDataset>;

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

export interface SimulationProviderProps {
  children: ReactNode;
}