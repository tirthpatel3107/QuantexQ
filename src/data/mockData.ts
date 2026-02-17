/**
 * Mock chart data: deterministic series generation and sliding-window updates.
 * Used by useSimulation for dashboard charts.
 */
const mulberry32 = (seed: number) => {
  seed |= 0;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export type ChartDataPoint = Record<string, string | number>;
export type ChartDataset = ChartDataPoint[];

type SeriesConfigItem = {
  key: string;
  baseValue: number;
  variance: number;
  patternSeed: number;
};

/** Single source of truth for chart series; used for initial data and append. */
const seriesConfigs: Record<string, SeriesConfigItem[]> = {
  flow: [
    { key: "in", baseValue: 220, variance: 40, patternSeed: 1 },
    { key: "out", baseValue: 318, variance: 60, patternSeed: 2 },
    { key: "mud", baseValue: 50, variance: 10, patternSeed: 3 },
  ],
  density: [
    { key: "in", baseValue: 8.6, variance: 0.5, patternSeed: 4 },
    { key: "out", baseValue: 8.4, variance: 0.5, patternSeed: 5 },
  ],
  surfacePressure: [
    { key: "sp", baseValue: 1247.9, variance: 100, patternSeed: 6 },
    { key: "sbp", baseValue: 227.0, variance: 30, patternSeed: 7 },
  ],
  standpipePressure: [
    { key: "sp", baseValue: 3483.0, variance: 150, patternSeed: 8 },
    { key: "spp", baseValue: 3947.9, variance: 180, patternSeed: 9 },
  ],
  bottomHolePressure: [
    { key: "sp", baseValue: 9627.0, variance: 200, patternSeed: 10 },
    { key: "bhp", baseValue: 9718.4, variance: 200, patternSeed: 11 },
  ],
  choke: [
    { key: "choke_a", baseValue: 10.1, variance: 2, patternSeed: 12 },
    { key: "choke_b", baseValue: -1.1, variance: 0.5, patternSeed: 13 },
    { key: "set_point", baseValue: 12.5, variance: 0.1, patternSeed: 14 },
  ],
};

const generateSinglePoint = (
  seriesConfig: SeriesConfigItem[],
  index: number,
  useNow = false,
): ChartDataPoint => {
  const now = Date.now();
  const time = useNow ? new Date(now) : new Date(now - index * 3 * 60_000);
  const point: ChartDataPoint = {
    time: time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  };

  const seedIndex = useNow ? Math.floor(Date.now() / 5000) : index;
  seriesConfig.forEach(({ key, baseValue, variance, patternSeed }) => {
    const random = mulberry32(patternSeed + seedIndex);
    const baseFrequency = 0.9 + (patternSeed % 5) * 0.22;
    const secondaryFrequency = 0.6 + (patternSeed % 3) * 0.18;
    const phase = patternSeed * 0.45;

    const primaryWave =
      Math.sin((seedIndex + 1) * baseFrequency + phase) * variance * 0.38;
    const secondaryWave =
      Math.cos((seedIndex + 1.5) * secondaryFrequency) * variance * 0.2;
    const jitter = (random() - 0.5) * variance * 0.12;

    const rawValue = baseValue + primaryWave + secondaryWave + jitter;
    const value = Math.max(
      baseValue - variance * 2,
      Math.min(baseValue + variance * 2, rawValue),
    );

    point[key] = Math.round(value * 100) / 100;
  });

  return point;
};

const generateMultiSeriesChartData = (
  config: SeriesConfigItem[],
  points = 50,
): ChartDataset => {
  const data: ChartDataset = [];
  for (let i = 0; i < points; i++) {
    data.push(generateSinglePoint(config, points - i));
  }
  return data;
};

/** Append one new data point and keep last 50 points (sliding window). */
export function appendChartPoint(
  data: ChartDataset,
  configKey: keyof typeof seriesConfigs,
): ChartDataset {
  const config = seriesConfigs[configKey];
  if (!config || data.length === 0) return data;
  const newPoint = generateSinglePoint(config, 0, true);
  const next = [...data.slice(1), newPoint];
  return next.length > 50 ? next.slice(-50) : next;
}

/** Initial chart datasets derived from seriesConfigs (no duplicate config). */
export const flowData = generateMultiSeriesChartData(seriesConfigs.flow);
export const densityData = generateMultiSeriesChartData(seriesConfigs.density);
export const surfacePressureData = generateMultiSeriesChartData(
  seriesConfigs.surfacePressure,
);
export const standpipePressureData = generateMultiSeriesChartData(
  seriesConfigs.standpipePressure,
);
export const bottomHolePressureData = generateMultiSeriesChartData(
  seriesConfigs.bottomHolePressure,
);
export const chokeChartData = generateMultiSeriesChartData(seriesConfigs.choke);

export const notifications = [
  {
    id: "1",
    type: "warning" as const,
    timestamp: "03:13:41",
    category: "Choke",
    message: "B value of -1.1% is outside acceptable range!",
  },
  {
    id: "2",
    type: "warning" as const,
    timestamp: "03:13:41",
    category: "Flow",
    message: "MUD value of 50.6 ppg is outside acceptable range!",
  },
  {
    id: "3",
    type: "error" as const,
    timestamp: "03:13:41",
    category: "Flow",
    message: "OUT value of 318.0 gpm is outside acceptable range!",
  },
  {
    id: "4",
    type: "info" as const,
    timestamp: "03:13:43",
    category: "Drill Depth",
    message: "Current depth: 14978 ft",
  },
  {
    id: "5",
    type: "success" as const,
    timestamp: "03:13:43",
    category: "System",
    message: "Simulation started successfully",
  },
  {
    id: "6",
    type: "info" as const,
    timestamp: "03:13:40",
    category: "System",
    message: "All pumps operating within normal parameters",
  },
];

export const pumpStatus = [
  { name: "MP1", status: "running" as const },
  { name: "MP2", status: "running" as const },
  { name: "MP3", status: "stop" as const },
  { name: "Mud Cooler", status: "running" as const },
];

export const operationalStatus = [
  { label: "Hole Depth", value: "14978", unit: "ft" },
  { label: "Block Height", value: "8700", unit: "ft" },
  { label: "Operation", value: "Running Csg", unit: "" },
  { label: "ECD", value: "13.51", unit: "ppg", status: "warning" as const },
  { label: "Temperature", value: "185.4", unit: "°F" },
];

export const chokeData = [
  { label: "Choke A", value: "10.1", unit: "%", status: "normal" as const },
  { label: "Choke B", value: "0", unit: "%", status: "critical" as const },
  { label: "Set Point", value: "12.5", unit: "%" },
];
