/**
 * Mud Properties Section API Handlers
 * TanStack Query hooks for Mud Properties section - Each tab has its own GET API endpoint
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, SaveResult } from "../types";
import type {
  FluidOverviewTabData,
  RheologyTabData,
  DensityTabData,
  TemperatureTabData,
  GasCompressibilityTabData,
  CalibrationTabData,
  SummaryTabData,
  SaveFluidOverviewPayload,
  SaveRheologyPayload,
  SaveDensityPayload,
  SaveTemperaturePayload,
  SaveGasCompressibilityPayload,
  SaveCalibrationPayload,
} from "./mudproperties.types";

// ============================================
// Query Keys
// ============================================

export const mudPropertiesKeys = {
  all: ["mudProperties"] as const,
  overview: () => [...mudPropertiesKeys.all, "overview"] as const,
  rheology: () => [...mudPropertiesKeys.all, "rheology"] as const,
  density: () => [...mudPropertiesKeys.all, "density"] as const,
  temperature: () => [...mudPropertiesKeys.all, "temperature"] as const,
  gas: () => [...mudPropertiesKeys.all, "gas"] as const,
  calibration: () => [...mudPropertiesKeys.all, "calibration"] as const,
  summary: () => [...mudPropertiesKeys.all, "summary"] as const,
};

// ============================================
// API Base URL
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// ============================================
// GET: Fluid Overview Tab
// ============================================

const fetchFluidOverviewData = async (): Promise<
  ApiResponse<FluidOverviewTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/mud-properties/overview`);
  // if (!response.ok) throw new Error('Failed to fetch fluid overview data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          type: "OBM",
          baseFluid: "Diesel",
          activePitsVolume: "600",
          flowlineTemp: "85",
          mudWeight: "12.5",
          viscosity: "45",
          gelStrength: "12/20",
          phLevel: "9.5",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useFluidOverviewData = () => {
  return useQuery({
    queryKey: mudPropertiesKeys.overview(),
    queryFn: fetchFluidOverviewData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Rheology Tab
// ============================================

const fetchRheologyData = async (): Promise<ApiResponse<RheologyTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/mud-properties/rheology`);
  // if (!response.ok) throw new Error('Failed to fetch rheology data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          rheologySource: "viscometer",
          pv: "20",
          yp: "15",
          gel10s: "12",
          gel10m: "20",
          n: "0.65",
          k: "0.85",
          tau0: "8.5",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useRheologyData = () => {
  return useQuery({
    queryKey: mudPropertiesKeys.rheology(),
    queryFn: fetchRheologyData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Density Tab
// ============================================

const fetchDensityData = async (): Promise<ApiResponse<DensityTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/mud-properties/density`);
  // if (!response.ok) throw new Error('Failed to fetch density data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          mudWeightIn: "12.5",
          mudWeightOut: "12.4",
          oilWaterRatio: "70/30",
          salinity: "15.0",
          solidsContent: "8.5",
          lowGravitySolids: "4.2",
          highGravitySolids: "4.3",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useDensityData = () => {
  return useQuery({
    queryKey: mudPropertiesKeys.density(),
    queryFn: fetchDensityData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Temperature Tab
// ============================================

const fetchTemperatureData = async (): Promise<
  ApiResponse<TemperatureTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/mud-properties/temperature`);
  // if (!response.ok) throw new Error('Failed to fetch temperature data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          surfaceTemp: "85",
          bottomholeTemp: "210",
          tempGradient: "+0.62",
          flowlineTemp: "85",
          ambientTemp: "75",
          staticTemp: "195",
          circulatingTemp: "180",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useTemperatureData = () => {
  return useQuery({
    queryKey: mudPropertiesKeys.temperature(),
    queryFn: fetchTemperatureData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Gas Compressibility Tab
// ============================================

const fetchGasCompressibilityData = async (): Promise<
  ApiResponse<GasCompressibilityTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/mud-properties/gas`);
  // if (!response.ok) throw new Error('Failed to fetch gas compressibility data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          gasSolubility: "0.85",
          compressibilityFactor: "0.92",
          gasOilRatio: "150",
          gasGravity: "0.65",
          criticalPressure: "667",
          criticalTemp: "-116",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useGasCompressibilityData = () => {
  return useQuery({
    queryKey: mudPropertiesKeys.gas(),
    queryFn: fetchGasCompressibilityData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Calibration Tab
// ============================================

const fetchCalibrationData = async (): Promise<
  ApiResponse<CalibrationTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/mud-properties/calibration`);
  // if (!response.ok) throw new Error('Failed to fetch calibration data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          viscometerCalDate: "2026-01-15",
          densityCalDate: "2026-01-20",
          tempSensorOffset: "+2.5",
          pressureSensorCal: "2026-01-10",
          flowMeterCal: "2026-01-18",
          lastCalibrationBy: "John Doe",
          nextCalibrationDue: "2026-04-15",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useCalibrationData = () => {
  return useQuery({
    queryKey: mudPropertiesKeys.calibration(),
    queryFn: fetchCalibrationData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Summary Tab
// ============================================

const fetchSummaryData = async (): Promise<ApiResponse<SummaryTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/mud-properties/summary`);
  // if (!response.ok) throw new Error('Failed to fetch summary data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          fluidType: "OBM",
          baseFluid: "Diesel",
          mudWeight: "12.5 ppg",
          viscosity: "45 cP",
          yieldPoint: "15 lb/100ft²",
          gelStrength: "12/20 lb/100ft²",
          temperature: "85°F / 210°F",
          phLevel: "9.5",
          solidsContent: "8.5%",
          oilWaterRatio: "70/30",
          lastUpdated: "2026-02-25T14:30:00Z",
          updatedBy: "adm.tirth",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useSummaryData = () => {
  return useQuery({
    queryKey: mudPropertiesKeys.summary(),
    queryFn: fetchSummaryData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// SAVE Mutations
// ============================================

// Fluid Overview
const saveFluidOverviewData = async (
  payload: SaveFluidOverviewPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Fluid Overview:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Fluid overview saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveFluidOverviewData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveFluidOverviewData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mudPropertiesKeys.overview() });
      queryClient.invalidateQueries({ queryKey: mudPropertiesKeys.summary() });
    },
  });
};

// Rheology
const saveRheologyData = async (
  payload: SaveRheologyPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Rheology:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Rheology data saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveRheologyData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveRheologyData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mudPropertiesKeys.rheology() });
      queryClient.invalidateQueries({ queryKey: mudPropertiesKeys.summary() });
    },
  });
};

// Density
const saveDensityData = async (
  payload: SaveDensityPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Density:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Density data saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveDensityData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDensityData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mudPropertiesKeys.density() });
      queryClient.invalidateQueries({ queryKey: mudPropertiesKeys.summary() });
    },
  });
};

// Temperature
const saveTemperatureData = async (
  payload: SaveTemperaturePayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Temperature:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Temperature data saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveTemperatureData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveTemperatureData,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mudPropertiesKeys.temperature(),
      });
      queryClient.invalidateQueries({ queryKey: mudPropertiesKeys.summary() });
    },
  });
};

// Gas Compressibility
const saveGasCompressibilityData = async (
  payload: SaveGasCompressibilityPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Gas Compressibility:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Gas compressibility data saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveGasCompressibilityData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveGasCompressibilityData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mudPropertiesKeys.gas() });
      queryClient.invalidateQueries({ queryKey: mudPropertiesKeys.summary() });
    },
  });
};

// Calibration
const saveCalibrationData = async (
  payload: SaveCalibrationPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Calibration:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Calibration data saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveCalibrationData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveCalibrationData,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mudPropertiesKeys.calibration(),
      });
    },
  });
};
