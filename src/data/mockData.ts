// Generate realistic-looking chart data
const generateChartData = (baseValue: number, variance: number, points = 20) => {
  const data = [];
  let value = baseValue;
  
  for (let i = 0; i < points; i++) {
    const time = new Date();
    time.setMinutes(time.getMinutes() - (points - i) * 3);
    
    value += (Math.random() - 0.5) * variance;
    value = Math.max(baseValue - variance * 2, Math.min(baseValue + variance * 2, value));
    
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      value: Math.round(value * 100) / 100,
    });
  }
  
  return data;
};

export const flowData = generateChartData(320, 50);
export const densityData = generateChartData(8.5, 0.3);
export const surfacePressureData = generateChartData(1200, 100);
export const standpipePressureData = generateChartData(3500, 200);
export const bottomHolePressureData = generateChartData(9600, 150);

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
  {
    name: "Mud Pump #1",
    status: "running" as const,
    efficiency: 94,
  },
  {
    name: "Mud Pump #2",
    status: "running" as const,
    efficiency: 92,
  },
  {
    name: "Shale Shaker",
    status: "warning" as const,
    efficiency: 78,
    statusMessage: "Vibration high",
  },
  {
    name: "Top Drive",
    status: "running" as const,
    efficiency: 98,
  },
  {
    name: "Mud Cooler",
    status: "alert" as const,
    efficiency: 65,
    statusMessage: "Temperature high",
  },
  {
    name: "BOP Stack",
    status: "running" as const,
    efficiency: 100,
  },
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
  { label: "Choke B", value: "-1.1", unit: "%", status: "critical" as const },
  { label: "Set Point", value: "12.5", unit: "%" },
];
