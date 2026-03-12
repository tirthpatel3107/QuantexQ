/**
 * Mud Properties Section API Types
 * Types for Mud Properties section with all tabs
 */

// ============================================
// Mud Properties Section - Complete Data Structure
// ============================================

export interface MudPropertiesData {
  overview: FluidOverviewTabData;
  rheology: RheologyTabData;
  density: DensityTabData;
  temperature: TemperatureTabData;
  gas: GasCompressibilityTabData;
  calibration: CalibrationTabData;
  summary: SummaryTabData;
}

// ============================================
// Fluid Overview Tab
// ============================================

export interface FluidOverviewTabData {
  type: string;
  baseFluid: string;
  activePitsVolume: string;
  flowlineTemp: string;
  mudWeight: string;
  viscosity: string;
  gelStrength: string;
  phLevel: string;
}

export interface SaveFluidOverviewPayload {
  type: string;
  baseFluid: string;
  activePitsVolume: string;
  flowlineTemp: string;
}

// ============================================
// Rheology Tab
// ============================================

export interface RheologyTabData {
  rheologySource: string;
  pv: string;
  yp: string;
  gel10s: string;
  gel10m: string;
  n: string;
  k: string;
  tau0: string;
}

export interface SaveRheologyPayload {
  rheologySource: string;
  pv: string;
  yp: string;
  gel10s: string;
  gel10m: string;
}

// ============================================
// Density Tab
// ============================================

export interface DensityTabData {
  mudWeightIn: string;
  mudWeightOut: string;
  oilWaterRatio: string;
  salinity: string;
  solidsContent: string;
  lowGravitySolids: string;
  highGravitySolids: string;
}

export interface DensitySectionPayload {
  title: string;
  data: Record<string, string | number | boolean>;
}

export interface SaveDensityPayload {
  sections: DensitySectionPayload[];
}

// ============================================
// Temperature Tab
// ============================================

export interface TemperatureTabData {
  surfaceTemp: string;
  bottomholeTemp: string;
  tempGradient: string;
  densitometryTempSett: string;
  applyTempCorrection: boolean;
  viscosityModel: string;
  tempRange: {
    status: "OK" | "WARN" | "BAD";
    surfaceTemp: string;
    bottomholeTemp: string;
    applyViscosityCorrection: boolean;
    tempSurfaceDrop: string;
    wuCased: string;
    bottomholeDefine: string;
  };
  chartData: Array<{
    depth: number;
    temperature: number;
  }>;
}

export interface SaveTemperaturePayload {
  surfaceTemp: string;
  bottomholeTemp: string;
  tempGradient: string;
  densitometryTempSett: string;
  applyTempCorrection: boolean;
  viscosityModel: string;
}

// ============================================
// Gas Compressibility Tab
// ============================================

export interface GasCompressibilityTabData {
  enableCompressibility: boolean;
  mudCompressibility: string;
  gasCut: string;
  gasDensity: string;
  annularCompressibility: string;
  ecdAtBit: string;
  requiredInputs: {
    componentLoad: boolean;
    depthCompressionLoad: boolean;
    annularPressureVato: boolean;
    signalConsistency: boolean;
  };
  chartData: {
    depth: number[];
    annularPressure: number[];
    mudCompressibleDepth: number;
  };
}

export interface SaveGasCompressibilityPayload {
  enableCompressibility: boolean;
  mudCompressibility: string;
  gasCut: string;
  gasDensity: string;
}

// ============================================
// Calibration Tab
// ============================================

export interface CalibrationTabData {
  viscometerCalDate: string;
  densityCalDate: string;
  tempSensorOffset: string;
  pressureSensorCal: string;
  flowMeterCal: string;
  lastCalibrationBy: string;
  nextCalibrationDue: string;
}

export interface SaveCalibrationPayload {
  viscometerCalDate: string;
  densityCalDate: string;
  tempSensorOffset: string;
}

// ============================================
// Summary Tab
// ============================================

export interface SummaryTabData {
  fluidType: string;
  baseFluid: string;
  mudWeight: string;
  viscosity: string;
  yieldPoint: string;
  gelStrength: string;
  temperature: string;
  phLevel: string;
  solidsContent: string;
  oilWaterRatio: string;
  lastUpdated: string;
  updatedBy: string;
}

// ============================================
// Options Data Types (for dropdowns)
// ============================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface FluidOverviewOptionsData {
  typeOptions: SelectOption[];
  baseFluidOptions: SelectOption[];
  tempOptions: SelectOption[];
}

export interface RheologyOptionsData {
  rheologySourceOptions: SelectOption[];
}

export interface DensityOptionsData {
  unitOptions: SelectOption[];
}

export interface TemperatureOptionsData {
  unitOptions: SelectOption[];
  viscosityModelOptions: SelectOption[];
}

export interface GasCompressibilityOptionsData {
  unitOptions: SelectOption[];
}

export interface CalibrationOptionsData {
  calibrationTypeOptions: SelectOption[];
}
