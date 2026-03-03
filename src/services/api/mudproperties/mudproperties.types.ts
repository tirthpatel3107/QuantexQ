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
  rheologyModel: {
    model: string;
    formula: string;
  };
  pv: {
    value: string;
    unit: string;
  };
  yp: {
    value: string;
    unit: string;
  };
  deriveFromViscometer: boolean;
  calibration: {
    viscosityVsShearRate: Array<{
      shearRate: number;
      viscosity: number;
    }>;
  };
  temperature: {
    shearStressVsShearRate: Array<{
      shearRate: number;
      shearStress: number;
    }>;
  };
  rheologyOutputs: {
    flowlineTemperature: {
      value: string;
      unit: string;
    };
    annularVelocity: {
      value: string;
      unit: string;
    };
    shearRate: {
      value: string;
      unit: string;
    };
    pvOutput: {
      value: string;
      unit: string;
      status: "OK" | "Warning" | "Error";
    };
    ypOutput: {
      value: string;
      unit: string;
      status: "OK" | "Warning" | "Error";
    };
    gel10s: {
      value: string;
      unit: string;
      status: "OK" | "Warning" | "Error";
    };
    gel10m: {
      value: string;
      unit: string;
      status: "OK" | "Warning" | "Error";
    };
  };
  pressureDrop: {
    psl: {
      value: string;
      unit: string;
    };
    flow: {
      value: string;
      unit: string;
    };
    drillpipe: {
      value: string;
      unit: string;
    };
    bit: {
      value: string;
      unit: string;
    };
  };
}

export interface SaveRheologyPayload {
  rheologyModel: {
    model: string;
    formula: string;
  };
  pv: {
    value: string;
    unit: string;
  };
  yp: {
    value: string;
    unit: string;
  };
  deriveFromViscometer: boolean;
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
  rheologyModelOptions: SelectOption[];
}

export interface DensityOptionsData {
  unitOptions: SelectOption[];
}

export interface TemperatureOptionsData {
  unitOptions: SelectOption[];
}

export interface GasCompressibilityOptionsData {
  unitOptions: SelectOption[];
}

export interface CalibrationOptionsData {
  calibrationTypeOptions: SelectOption[];
}
