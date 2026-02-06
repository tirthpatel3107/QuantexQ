// Generate deterministic, realistic-looking chart data with unique shapes per series
// while keeping point counts stable for layout/skeleton correctness.
const mulberry32 = (seed: number) => {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const generateChartData = (baseValue: number, variance: number, points = 20, patternSeed = 1) => {
  const data = [];
  const now = Date.now();
  const random = mulberry32(patternSeed);
  const baseFrequency = 0.9 + (patternSeed % 5) * 0.22;
  const secondaryFrequency = 0.6 + (patternSeed % 3) * 0.18;
  const phase = patternSeed * 0.45;

  for (let i = 0; i < points; i++) {
    const time = new Date(now - (points - i) * 3 * 60_000);
    const primaryWave = Math.sin((i + 1) * baseFrequency + phase) * variance * 0.38;
    const secondaryWave = Math.cos((i + 1.5) * secondaryFrequency) * variance * 0.2;
    const jitter = (random() - 0.5) * variance * 0.12; // small variation to break identical shapes
    const rawValue = baseValue + primaryWave + secondaryWave + jitter;
    const value = Math.max(baseValue - variance * 2, Math.min(baseValue + variance * 2, rawValue));

    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      value: Math.round(value * 100) / 100,
    });
  }

  return data;
};

export const flowData = generateChartData(320, 50, 20, 1);
export const densityData = generateChartData(8.5, 0.3, 20, 2);
export const surfacePressureData = generateChartData(1200, 100, 20, 3);
export const standpipePressureData = generateChartData(3500, 200, 20, 4);
export const bottomHolePressureData = generateChartData(9600, 150, 20, 5);
export const chokeChartData = generateChartData(10, 3, 20, 6);

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
  { name: "Mud Pump #1", status: "running" as const },
  { name: "Mud Pump #2", status: "running" as const },
  { name: "Mud Pump #3", status: "stop" as const },
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
