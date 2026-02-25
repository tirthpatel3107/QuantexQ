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

export interface SaveDensityPayload {
  mudWeightIn: string;
  mudWeightOut: string;
  oilWaterRatio: string;
  salinity: string;
}

// ============================================
// Temperature Tab
// ============================================

export interface TemperatureTabData {
  surfaceTemp: string;
  bottomholeTemp: string;
  tempGradient: string;
  flowlineTemp: string;
  ambientTemp: string;
  staticTemp: string;
  circulatingTemp: string;
}

export interface SaveTemperaturePayload {
  surfaceTemp: string;
  bottomholeTemp: string;
  tempGradient: string;
  flowlineTemp: string;
}

// ============================================
// Gas Compressibility Tab
// ============================================

export interface GasCompressibilityTabData {
  gasSolubility: string;
  compressibilityFactor: string;
  gasOilRatio: string;
  gasGravity: string;
  criticalPressure: string;
  criticalTemp: string;
}

export interface SaveGasCompressibilityPayload {
  gasSolubility: string;
  compressibilityFactor: string;
  gasOilRatio: string;
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
