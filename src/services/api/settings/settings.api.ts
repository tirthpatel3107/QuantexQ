/**
 * Settings Section API Handlers
 * TanStack Query hooks for Settings section - Each tab has its own GET API endpoint
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, SaveResult } from "../types";
import apiClient from "@/services/apiClient";
import { SERVER_ROUTES } from "@/services/routes/serverRoutes";

// ============================================
// Query Keys
// ============================================

export const settingsKeys = {
  all: ["settings"] as const,
  general: () => [...settingsKeys.all, "general"] as const,
  generalOptions: () => [...settingsKeys.all, "general", "options"] as const,
  uiDisplay: () => [...settingsKeys.all, "uiDisplay"] as const,
  uiDisplayOptions: () =>
    [...settingsKeys.all, "uiDisplay", "options"] as const,
  units: () => [...settingsKeys.all, "units"] as const,
  unitsOptions: () => [...settingsKeys.all, "units", "options"] as const,
  dataTime: () => [...settingsKeys.all, "dataTime"] as const,
  dataTimeOptions: () => [...settingsKeys.all, "dataTime", "options"] as const,
  alarms: () => [...settingsKeys.all, "alarms"] as const,
  alarmsOptions: () => [...settingsKeys.all, "alarms", "options"] as const,
  signals: () => [...settingsKeys.all, "signals"] as const,
  signalsOptions: () => [...settingsKeys.all, "signals", "options"] as const,
  chokePumps: () => [...settingsKeys.all, "chokePumps"] as const,
  chokePumpsOptions: () =>
    [...settingsKeys.all, "chokePumps", "options"] as const,
  autoControl: () => [...settingsKeys.all, "autoControl"] as const,
  autoControlOptions: () =>
    [...settingsKeys.all, "autoControl", "options"] as const,
  hydraulicsModel: () => [...settingsKeys.all, "hydraulicsModel"] as const,
  hydraulicsModelOptions: () =>
    [...settingsKeys.all, "hydraulicsModel", "options"] as const,
  aboutDiagnostics: () => [...settingsKeys.all, "aboutDiagnostics"] as const,
  aboutDiagnosticsOptions: () =>
    [...settingsKeys.all, "aboutDiagnostics", "options"] as const,
};

// ============================================
// API Base URL
// ============================================

// ============================================
// GET: General Settings Tab
// ============================================

const fetchGeneralSettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.GENERAL);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          applicationName: "Well Alpha",
          defaultRigName: "Rig-01",
          defaultScenario: "Static",
          startupScreen1: "Dashboard",
          startupScreen2: "Dashboard",
          safetyConfirmations: true,
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useGeneralSettings = () => {
  return useQuery({
    queryKey: settingsKeys.general(),
    queryFn: fetchGeneralSettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: General Settings Options (Dropdown Data)
// ============================================

const fetchGeneralOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          rigOptions: [
            { label: "Rig-01", value: "Rig-01" },
            { label: "Rig-02", value: "Rig-02" },
            { label: "Rig-03", value: "Rig-03" },
          ],
          scenarioOptions: [
            { label: "Static", value: "Static" },
            { label: "Dynamic", value: "Dynamic" },
          ],
          screenOptions: [
            { label: "Quantum HUD", value: "Quantum HUD" },
            { label: "Dashboard", value: "Dashboard" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useGeneralOptions = () => {
  return useQuery({
    queryKey: settingsKeys.generalOptions(),
    queryFn: fetchGeneralOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: UI Display Settings Tab
// ============================================

const fetchUiDisplaySettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.UI_DISPLAY);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          theme: "dark",
          accentColor: "#3b82f6",
          fontSize: "medium",
          compactMode: false,
          showGridLines: true,
          animationsEnabled: true,
          dashboardLayout: "default",
          chartRefreshRate: 1000,
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useUiDisplaySettings = () => {
  return useQuery({
    queryKey: settingsKeys.uiDisplay(),
    queryFn: fetchUiDisplaySettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: UI Display Options (Dropdown Data)
// ============================================

const fetchUiDisplayOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          languageOptions: [
            { label: "English (EN)", value: "en" },
            { label: "Spanish (ES)", value: "es" },
            { label: "French (FR)", value: "fr" },
          ],
          dateFormatOptions: [
            { label: "DD MMM YYYY", value: "dd-mmm-yyyy" },
            { label: "MM/DD/YYYY", value: "mm-dd-yyyy" },
            { label: "YYYY-MM-DD", value: "yyyy-mm-dd" },
          ],
          timeFormatOptions: [
            { label: "24-Hour Clock (HH:mm)", value: "24h" },
            { label: "12-Hour Clock (hh:mm AM/PM)", value: "12h" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useUiDisplayOptions = () => {
  return useQuery({
    queryKey: settingsKeys.uiDisplayOptions(),
    queryFn: fetchUiDisplayOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Units Settings Tab
// ============================================

const fetchUnitsSettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.UNITS);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          pressure: "psi",
          temperature: "fahrenheit",
          length: "feet",
          volume: "gallons",
          flow: "gpm",
          density: "ppg",
          weight: "pounds",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useUnitsSettings = () => {
  return useQuery({
    queryKey: settingsKeys.units(),
    queryFn: fetchUnitsSettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Units Options (Dropdown Data)
// ============================================

const fetchUnitsOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          pressureOptions: [
            { label: "PSI", value: "psi" },
            { label: "Bar", value: "bar" },
            { label: "kPa", value: "kpa" },
          ],
          temperatureOptions: [
            { label: "Fahrenheit", value: "fahrenheit" },
            { label: "Celsius", value: "celsius" },
          ],
          lengthOptions: [
            { label: "Feet", value: "feet" },
            { label: "Meters", value: "meters" },
          ],
          volumeOptions: [
            { label: "Gallons", value: "gallons" },
            { label: "Liters", value: "liters" },
            { label: "Barrels", value: "barrels" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useUnitsOptions = () => {
  return useQuery({
    queryKey: settingsKeys.unitsOptions(),
    queryFn: fetchUnitsOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Data & Time Settings Tab
// ============================================

const fetchDataTimeSettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.DATA_TIME);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          ntpEnabled: true,
          ntpServer: "pool.ntp.org",
          timezone: "America/New_York",
          dateFormat: "MM/DD/YYYY",
          timeFormat: "12h",
          syncInterval: 3600,
          lastSync: "2026-02-25T10:30:00Z",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useDataTimeSettings = () => {
  return useQuery({
    queryKey: settingsKeys.dataTime(),
    queryFn: fetchDataTimeSettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Data & Time Options (Dropdown Data)
// ============================================

const fetchDataTimeOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          timezoneOptions: [
            { label: "America/New_York", value: "America/New_York" },
            { label: "America/Chicago", value: "America/Chicago" },
            { label: "America/Denver", value: "America/Denver" },
            { label: "America/Los_Angeles", value: "America/Los_Angeles" },
            { label: "UTC", value: "UTC" },
          ],
          ntpServerOptions: [
            { label: "pool.ntp.org", value: "pool.ntp.org" },
            { label: "time.google.com", value: "time.google.com" },
            { label: "time.nist.gov", value: "time.nist.gov" },
          ],
          syncIntervalOptions: [
            { label: "15 minutes", value: "900" },
            { label: "30 minutes", value: "1800" },
            { label: "1 hour", value: "3600" },
            { label: "6 hours", value: "21600" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useDataTimeOptions = () => {
  return useQuery({
    queryKey: settingsKeys.dataTimeOptions(),
    queryFn: fetchDataTimeOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Alarms Settings Tab
// ============================================

const fetchAlarmsSettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.ALARMS);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          alarmProfiles: [
            {
              id: "alarm-1",
              name: "High Pressure",
              threshold: 5000,
              enabled: true,
              priority: "high",
            },
            {
              id: "alarm-2",
              name: "Low Flow",
              threshold: 100,
              enabled: true,
              priority: "medium",
            },
          ],
          soundEnabled: true,
          visualAlerts: true,
          emailNotifications: true,
          smsNotifications: false,
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useAlarmsSettings = () => {
  return useQuery({
    queryKey: settingsKeys.alarms(),
    queryFn: fetchAlarmsSettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Alarms Options (Dropdown Data)
// ============================================

const fetchAlarmsOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          delayOptions: [
            { label: "5", value: "5" },
            { label: "10", value: "10" },
            { label: "15", value: "15" },
            { label: "20", value: "20" },
            { label: "30", value: "30" },
          ],
          outputOptions: [
            { label: "Audio Alarm", value: "audio" },
            { label: "Visual Alert", value: "visual" },
            { label: "Both", value: "both" },
          ],
          alarmTypeOptions: [
            { label: "Kick and Loss", value: "kick-loss" },
            { label: "Pressure", value: "pressure" },
            { label: "Flow", value: "flow" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useAlarmsOptions = () => {
  return useQuery({
    queryKey: settingsKeys.alarmsOptions(),
    queryFn: fetchAlarmsOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Signals Settings Tab
// ============================================

const fetchSignalsSettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.SIGNALS);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          signals: [
            {
              id: 1,
              name: "Back Pressure Pump RPM",
              subsystem: "Pressure Control",
              inUse: true,
              unit: "RPM",
              valueRange: "0-2400",
              isFavorite: true,
            },
            {
              id: 2,
              name: "Choke Valve Position",
              subsystem: "Pressure Control",
              inUse: true,
              unit: "%",
              valueRange: "0-100",
              isFavorite: true,
            },
            {
              id: 3,
              name: "Gain Factor",
              subsystem: "Pressure Control",
              inUse: true,
              unit: "Unles",
              valueRange: "0-10",
              isFavorite: true,
            },
            {
              id: 4,
              name: "Flow Rate",
              subsystem: "DAQ",
              inUse: true,
              unit: "L/min",
              valueRange: "0-1500",
              isFavorite: true,
            },
            {
              id: 5,
              name: "Managed Pressure Setpoint",
              subsystem: "Pressure Control",
              inUse: true,
              unit: "psi",
              valueRange: "0-5000",
              isFavorite: true,
            },
            {
              id: 6,
              name: "Standpipe Pressure",
              subsystem: "DAQ",
              inUse: true,
              unit: "psi",
              valueRange: "0-8000",
              isFavorite: true,
            },
            {
              id: 7,
              name: "Total Mud Volume",
              subsystem: "Hydraulics",
              inUse: true,
              unit: "bbl",
              valueRange: "0-1000",
              isFavorite: true,
            },
            {
              id: 8,
              name: "Auto Control Active",
              subsystem: "Auto Control",
              inUse: true,
              unit: "",
              valueRange: "",
              isFavorite: true,
            },
            {
              id: 9,
              name: "Safety Valve Open",
              subsystem: "Network",
              inUse: true,
              unit: "",
              valueRange: "",
              isFavorite: true,
            },
            {
              id: 10,
              name: "Surface Back Pressure",
              subsystem: "Hydraulic Model Validation",
              inUse: true,
              unit: "psi",
              valueRange: "-1000-3000",
              isFavorite: true,
            },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useSignalsSettings = () => {
  return useQuery({
    queryKey: settingsKeys.signals(),
    queryFn: fetchSignalsSettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Signals Options (Dropdown Data)
// ============================================

const fetchSignalsOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // API CALL: GET /api/settings/signals/options
  // const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.SIGNALS);
  // return response.data;

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          subsystemOptions: [
            { label: "Pressure Control", value: "Pressure Control" },
            { label: "DAQ", value: "DAQ" },
            { label: "Hydraulics", value: "Hydraulics" },
            { label: "Auto Control", value: "Auto Control" },
            { label: "Network", value: "Network" },
            {
              label: "Hydraulic Model Validation",
              value: "Hydraulic Model Validation",
            },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useSignalsOptions = () => {
  return useQuery({
    queryKey: settingsKeys.signalsOptions(),
    queryFn: fetchSignalsOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Choke & Pumps Settings Tab
// ============================================

const fetchChokePumpsSettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.CHOKE_PUMPS);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          chokeConfig: {
            chokeA: {
              enabled: true,
              minPosition: 0,
              maxPosition: 100,
              responseTime: 2.5,
            },
            chokeB: {
              enabled: true,
              minPosition: 0,
              maxPosition: 100,
              responseTime: 2.5,
            },
          },
          pumpConfig: {
            pump1: {
              enabled: true,
              maxFlow: 500,
              efficiency: 0.95,
            },
            pump2: {
              enabled: true,
              maxFlow: 500,
              efficiency: 0.93,
            },
          },
          controlMode: "auto",
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useChokePumpsSettings = () => {
  return useQuery({
    queryKey: settingsKeys.chokePumps(),
    queryFn: fetchChokePumpsSettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Choke & Pumps Options (Dropdown Data)
// ============================================

const fetchChokePumpsOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          controlModeOptions: [
            { label: "Auto", value: "auto" },
            { label: "Manual", value: "manual" },
            { label: "Semi-Auto", value: "semi-auto" },
          ],
          responseTimeOptions: [
            { label: "Fast (1.0s)", value: "1.0" },
            { label: "Normal (2.5s)", value: "2.5" },
            { label: "Slow (5.0s)", value: "5.0" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useChokePumpsOptions = () => {
  return useQuery({
    queryKey: settingsKeys.chokePumpsOptions(),
    queryFn: fetchChokePumpsOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Auto Control Settings Tab
// ============================================

const fetchAutoControlSettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.AUTO_CONTROL);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          pidSettings: {
            proportional: 1.2,
            integral: 0.5,
            derivative: 0.1,
          },
          setpoints: {
            pressure: 3000,
            flow: 450,
          },
          safetyLimits: {
            maxPressure: 5000,
            minPressure: 500,
            maxFlow: 600,
            minFlow: 50,
          },
          autoMode: true,
          emergencyShutdown: {
            enabled: true,
            threshold: 5500,
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useAutoControlSettings = () => {
  return useQuery({
    queryKey: settingsKeys.autoControl(),
    queryFn: fetchAutoControlSettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Auto Control Options (Dropdown Data)
// ============================================

const fetchAutoControlOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          controlModeOptions: [
            { label: "Auto", value: "auto" },
            { label: "Manual", value: "manual" },
          ],
          precisionOptions: [
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useAutoControlOptions = () => {
  return useQuery({
    queryKey: settingsKeys.autoControlOptions(),
    queryFn: fetchAutoControlOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Hydraulics Model Settings Tab
// ============================================

const fetchHydraulicsModelSettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.HYDRAULICS_MODEL);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          activeModel: "bingham-plastic",
          modelParameters: {
            plasticViscosity: 25,
            yieldPoint: 15,
            density: 12.5,
          },
          wellGeometry: {
            depth: 10000,
            holeDiameter: 8.5,
            pipeDiameter: 5.0,
          },
          calculationSettings: {
            updateInterval: 1000,
            precision: "high",
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useHydraulicsModelSettings = () => {
  return useQuery({
    queryKey: settingsKeys.hydraulicsModel(),
    queryFn: fetchHydraulicsModelSettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Hydraulics Model Options (Dropdown Data)
// ============================================

const fetchHydraulicsModelOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          modelOptions: [
            { label: "Bingham Plastic", value: "bingham-plastic" },
            { label: "Power Law", value: "power-law" },
            { label: "Herschel-Bulkley", value: "herschel-bulkley" },
          ],
          precisionOptions: [
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ],
          updateIntervalOptions: [
            { label: "500 ms", value: "500" },
            { label: "1000 ms", value: "1000" },
            { label: "2000 ms", value: "2000" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useHydraulicsModelOptions = () => {
  return useQuery({
    queryKey: settingsKeys.hydraulicsModelOptions(),
    queryFn: fetchHydraulicsModelOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: About & Diagnostics Settings Tab
// ============================================

const fetchAboutDiagnosticsSettings = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // Real API implementation
  /*
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(SERVER_ROUTES.SETTINGS.ABOUT_DIAGNOSTICS);
  return response.data;
  */

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          systemInfo: {
            version: "2.5.1",
            buildDate: "2026-02-15",
            serialNumber: "QX-2026-001234",
            licenseType: "Enterprise",
            licenseExpiry: "2027-02-15",
          },
          diagnostics: {
            cpuUsage: 45,
            memoryUsage: 62,
            diskUsage: 38,
            networkStatus: "connected",
            lastDiagnostic: "2026-02-25T09:00:00Z",
          },
          support: {
            contactEmail: "support@quantex.com",
            contactPhone: "+1-800-QUANTEX",
            documentationUrl: "https://docs.quantex.com",
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useAboutDiagnosticsSettings = () => {
  return useQuery({
    queryKey: settingsKeys.aboutDiagnostics(),
    queryFn: fetchAboutDiagnosticsSettings,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: About & Diagnostics Options (Dropdown Data)
// ============================================

const fetchAboutDiagnosticsOptions = async (): Promise<
  ApiResponse<Record<string, unknown>>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          licenseTypeOptions: [
            { label: "Enterprise", value: "enterprise" },
            { label: "Professional", value: "professional" },
            { label: "Standard", value: "standard" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

export const useAboutDiagnosticsOptions = () => {
  return useQuery({
    queryKey: settingsKeys.aboutDiagnosticsOptions(),
    queryFn: fetchAboutDiagnosticsOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// SAVE Mutations
// ============================================

// General Settings
const saveGeneralSettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving General Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "General settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveGeneralSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveGeneralSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.general() });
    },
  });
};

// UI Display Settings
const saveUiDisplaySettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving UI Display Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "UI display settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveUiDisplaySettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveUiDisplaySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.uiDisplay() });
    },
  });
};

// Units Settings
const saveUnitsSettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Units Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Units settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveUnitsSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveUnitsSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.units() });
    },
  });
};

// Data & Time Settings
const saveDataTimeSettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Data & Time Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Data & time settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveDataTimeSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDataTimeSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.dataTime() });
    },
  });
};

// Alarms Settings
const saveAlarmsSettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Alarms Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Alarms settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveAlarmsSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveAlarmsSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.alarms() });
    },
  });
};

// Signals Settings
const saveSignalsSettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Signals Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Signals settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveSignalsSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSignalsSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.signals() });
    },
  });
};

// Choke & Pumps Settings
const saveChokePumpsSettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Choke & Pumps Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Choke & pumps settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveChokePumpsSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveChokePumpsSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.chokePumps() });
    },
  });
};

// Auto Control Settings
const saveAutoControlSettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Auto Control Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Auto control settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveAutoControlSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveAutoControlSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.autoControl() });
    },
  });
};

// Hydraulics Model Settings
const saveHydraulicsModelSettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Hydraulics Model Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Hydraulics model settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveHydraulicsModelSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveHydraulicsModelSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: settingsKeys.hydraulicsModel(),
      });
    },
  });
};

// About & Diagnostics Settings (typically read-only, but including for completeness)
const saveAboutDiagnosticsSettings = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving About & Diagnostics Settings:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "About & diagnostics settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveAboutDiagnosticsSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveAboutDiagnosticsSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: settingsKeys.aboutDiagnostics(),
      });
    },
  });
};
