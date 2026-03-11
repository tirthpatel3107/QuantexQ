import {
  flowData,
  densityData,
  surfacePressureData,
  standpipePressureData,
  bottomHolePressureData,
  chokeChartData,
} from "@/utils/data/mockData";
import { ChartDataKey } from "@/utils/types/chart";
import type { ChartDataState } from "./types";

export const INITIAL_CHART_DATA: ChartDataState = {
  flow: flowData,
  density: densityData,
  surfacePressure: surfacePressureData,
  standpipePressure: standpipePressureData,
  bottomHolePressure: bottomHolePressureData,
  choke: chokeChartData,
};

export const CHART_KEYS: ChartDataKey[] = [
  "flow",
  "density",
  "surfacePressure",
  "standpipePressure",
  "bottomHolePressure",
  "choke",
];