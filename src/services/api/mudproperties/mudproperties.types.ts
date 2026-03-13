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

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  checkType: string;
  matchCount: number;
  details?: string;
}

export interface CalibrationTabData {
  gasCompressibility: {
    densitySensorOffset?: string;
    pvYpCorrectionFactor?: string;
    temperatureSensorOffset?: string;
    gasCut?: string;
  };
  sanityCheck: {
    enabled: boolean;
    lastCheck?: string;
    densityMatch?: boolean;
    rheologyMatch?: boolean;
    temperatureMatch?: boolean;
  };
  validationStatus: {
    annularTemperature: string;
    ecdAtBit: string;
    requiredInputs: boolean;
    densityWithinRange: boolean;
    tempPressureLogic: boolean;
    requiredInputsComplete: string;
  };
  auditLog: AuditLogEntry[];
}

export interface SaveCalibrationPayload {
  gasCompressibility: {
    densitySensorOffset?: string;
    pvYpCorrectionFactor?: string;
    temperatureSensorOffset?: string;
    gasCut?: string;
  };
  sanityCheck: {
    enabled: boolean;
  };
}

// ============================================
// Summary Tab
// ============================================

export interface SummaryTabData {
  mudSystemOverview: {
    mudSystem: string;
    baseFluid: string;
  };
  rheology: {
    model: string;
    pv: string;
    yp: string;
    gels: string;
    derivedWarning?: boolean;
  };
  densitySolids: {
    mudWeightIn: string;
    mudWeightOut: string;
    lgs: string;
    hgs: string;
    salinity: string;
  };
  temperature: {
    surfaceTemp: string;
    bottomholeTemp: string;
    calculation: string;
    densitometryTemp: string;
  };
  gasCompressibility: {
    compressibility: boolean;
    gasCut?: string;
    compressibilityFactor?: string;
    gasStatus?: "OK" | "Warning" | "Error";
    gasDetected?: boolean;
  };
  activePitsVolume: {
    volume: string;
  };
  flowlineTemperature: {
    temperature: string;
  };
  oilWaterRatio: {
    ratio: string;
  };
}

export interface SaveSummaryPayload {
  mudSystemOverview: {
    mudSystem: string;
    baseFluid: string;
  };
  rheology: {
    model: string;
    pv: string;
    yp: string;
    gels: string;
  };
  densitySolids: {
    mudWeightIn: string;
    mudWeightOut: string;
    lgs: string;
    hgs: string;
    salinity: string;
  };
  temperature: {
    surfaceTemp: string;
    bottomholeTemp: string;
    calculation: string;
    densitometryTemp: string;
  };
  gasCompressibility: {
    compressibility: boolean;
    gasCut?: string;
    compressibilityFactor?: string;
  };
  activePitsVolume: {
    volume: string;
  };
  flowlineTemperature: {
    temperature: string;
  };
  oilWaterRatio: {
    ratio: string;
  };
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
  viscosityModelOptions: SelectOption[];
}

export interface GasCompressibilityOptionsData {
  unitOptions: SelectOption[];
}

export interface CalibrationOptionsData {
  sgOptions: SelectOption[];
  typicalSensorOffsets: {
    obm: string;
    wbm: string;
    visco: string;
    temp: string;
  };
}

// Summary options for dropdown fields
export interface SummaryOptionsData {
  mudSystemOptions: SelectOption[];
  baseFluidOptions: SelectOption[];
  rheologyModelOptions: SelectOption[];
}
