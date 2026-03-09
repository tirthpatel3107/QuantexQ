/**
 * DAQ Section API Handlers
 * TanStack Query hooks for DAQ section - Each tab has its own GET API endpoint
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, SaveResult } from "../types";
import type {
  DisplayTabData,
  StreamingTabData,
  NotificationsTabData,
  LogAnalysisTabData,
  SensorPermsTabData,
  CalibrationTabData,
  HydraulicsTabData,
  SystemSettingsTabData,
  DownloadsTabData,
  SaveDisplayPayload,
  SaveStreamingPayload,
  SaveNotificationsPayload,
  SaveLogAnalysisPayload,
  SaveSensorPermsPayload,
  SaveCalibrationPayload,
  SaveHydraulicsPayload,
  SaveSystemSettingsPayload,
  SaveDownloadsPayload,
  NotificationsOptionsData,
  LogAnalysisOptionsData,
  SystemSettingsOptionsData,
} from "./daq.types";

// ============================================
// Query Keys
// ============================================

export const daqKeys = {
  all: ["daq"] as const,
  display: () => [...daqKeys.all, "display"] as const,
  streaming: () => [...daqKeys.all, "streaming"] as const,
  notifications: () => [...daqKeys.all, "notifications"] as const,
  logAnalysis: () => [...daqKeys.all, "logAnalysis"] as const,
  sensorPerms: () => [...daqKeys.all, "sensorPerms"] as const,
  calibration: () => [...daqKeys.all, "calibration"] as const,
  hydraulics: () => [...daqKeys.all, "hydraulics"] as const,
  systemSettings: () => [...daqKeys.all, "systemSettings"] as const,
  downloads: () => [...daqKeys.all, "downloads"] as const,
};

// ============================================
// API Base URL
// ============================================

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// ============================================
// GET: Display Tab
// ============================================

const fetchDisplayData = async (): Promise<ApiResponse<DisplayTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/display`);
  // if (!response.ok) throw new Error('Failed to fetch display data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          sections: [
            { id: "pressures", title: "Pressures", description: "", type: "monitoring", enabled: true },
            { id: "flow", title: "Flow", description: "", type: "monitoring", enabled: true },
            { id: "mw-in-out", title: "MW In & Out", description: "", type: "monitoring", enabled: true },
            { id: "flow-in", title: "Flow In", description: "", type: "monitoring", enabled: true },
            { id: "out-flow", title: "OUT Flow", description: "", type: "monitoring", enabled: true },
            { id: "rotary-drilling", title: "Rotary / Drilling", description: "", type: "monitoring", enabled: true },
            { id: "turbing", title: "Turbing", description: "", type: "monitoring", enabled: true },
            { id: "trend-analysis", title: "Trend Analysis", description: "", type: "trends", enabled: true },
            { id: "validation-status", title: "Validation Status", description: "", type: "monitoring", enabled: true },
            { id: "sensor-validation", title: "Sensor Validation", description: "", type: "monitoring", enabled: true },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useDisplayData = () => {
  return useQuery({
    queryKey: daqKeys.display(),
    queryFn: fetchDisplayData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Streaming Tab
// ============================================

const fetchStreamingData = async (): Promise<ApiResponse<StreamingTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/streaming`);
  // if (!response.ok) throw new Error('Failed to fetch streaming data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          streaming: {
            enabled: false,
            realTimeLevel: "",
            destination: "",
          },
          loggingStatus: {
            enabled: false,
            frequency: "",
            autoCache: false,
            startLoggingUponSystemReady: false,
            appendOnLogStop: false,
          },
          loggingDestinations: {
            exportLogFiles: {
              destinationLogsTo: "Desktop",
              anotherDirectory:
                "F:/Documents/Manektech%20Utils/Quantex%20Q/Logging.png",
              diskCacheDirectory:
                "F:/Documents/Manektech%20Utils/Quantex%20Q/Logging.png",
            },
            network: {
              networkLocation:
                "F:/Documents/Manektech%20Utils/Quantex%20Q/Logging.png",
              directory:
                "F:/Documents/Manektech%20Utils/Quantex%20Q/Logging.png",
            },
          },
          ftpServer: {
            ftpUrl1: "",
            ftpUrl2: "",
            ftpPas: "",
          },
        },

        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useStreamingData = () => {
  return useQuery({
    queryKey: daqKeys.streaming(),
    queryFn: fetchStreamingData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Notifications Tab
// ============================================

const fetchNotificationsData = async (): Promise<
  ApiResponse<NotificationsTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/notifications`);
  // if (!response.ok) throw new Error('Failed to fetch notifications data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          settings: {
            alarmSound: "factory_alert.mp3",
            alarmNotifications: true,
            acceptableWrns: true,
            acceptableCmpncs: true,
            validityCompletion: true,
          },
          store: {
            remindOnReset: true,
            selfDismissing: true,
            unusetComplessible: false,
            enableNewAlarm: true,
            alarmClearDiagnostics: true,
            inboundRate: false,
          },
          log: [
            {
              id: "1",
              type: "high",
              mention: "SBP HIGH: RLHea...09j",
              message:
                "SBP LIMIT RECOMMENDED: (Cushioning) or pit-monitoring clear",
              severity: "SBP HIGH Hea...",
              status: "OK",
            },
            {
              id: "2",
              type: "medium",
              mention: "Enable OF: Alarms...ON",
              message: "Friction Losses within thresholds again",
              severity: "Slow DIAG...",
              status: "OK",
            },
            {
              id: "3",
              type: "medium",
              mention: "Cause OF Alarms...ON",
              message: "SPP LIMIT EXCEEDED: ACTION NEEDED",
              severity: "SLEF NEEDED...",
              status: "OK",
            },
            {
              id: "4",
              type: "high",
              mention: "Alert MMI: Alarms...ON",
              message: "LGS Analysis complete: 8.3% (set:) 5.0%",
              severity: "SWS NEEDED...",
              status: "OK",
            },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useNotificationsData = () => {
  return useQuery({
    queryKey: daqKeys.notifications(),
    queryFn: fetchNotificationsData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Log Analysis Tab
// ============================================

const fetchLogAnalysisData = async (): Promise<
  ApiResponse<LogAnalysisTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/log-analysis`);
  // if (!response.ok) throw new Error('Failed to fetch log analysis data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          logResults: {
            dataFilterLevel: "Level All",
            startTime: "06 Feb 2026 | 16:18",
            endTime: "06 Feb 2026 | 16:36",
          },
          trendAnalysis: {
            period: "06 Feb 2026: 16:18 - 16:36",
            plots: {
              sbp: true,
              spp: true,
              bhp: true,
              hlw: true,
            },
          },
          alertNotifyAnalysis: {
            criticalAlerts: {
              cb: 1,
              ch: 2,
              spp: 2,
              sbpAccepted: 7,
              arAlerts: 2,
            },
            alertPlotEnabled: true,
          },
          responseTime: {
            enabled: true,
            period: "30 min",
          },
          logEntries: [
            {
              id: "1",
              problemId: "SBP HIGH: RM",
              pigging: "SBP HIGH - ALARM",
              time: "16:34",
              message:
                "RECOMMEND: circulating or pit-monitoring or pit-monitoring clear",
              severity: "high",
            },
            {
              id: "2",
              problemId: "CAUSE AMS",
              pigging: "",
              time: "16:34",
              message: "spit-restriction: ACTION NEEDED",
              severity: "medium",
            },
            {
              id: "3",
              problemId: "SBP D HIGH HI",
              pigging: "",
              time: "16:36",
              message: "Sp limit perception: ACTION NEEDED",
              severity: "medium",
            },
            {
              id: "4",
              problemId: "SBP FI: IME",
              pigging: "",
              time: "16:23",
              message: "FRICTIONS within handy thresholds",
              severity: "info",
            },
            {
              id: "5",
              problemId: "Partition Closed",
              pigging: "",
              time: "16:23",
              message: "Alarm history and telemetry idle for 2 hours",
              severity: "low",
            },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useLogAnalysisData = () => {
  return useQuery({
    queryKey: daqKeys.logAnalysis(),
    queryFn: fetchLogAnalysisData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Sensor Permissions Tab
// ============================================

const fetchSensorPermsData = async (): Promise<
  ApiResponse<SensorPermsTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/sensor-perms`);
  // if (!response.ok) throw new Error('Failed to fetch sensor permissions data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          sensors: [
            {
              id: "sensor-1",
              name: "Pressure Sensor 1",
              primary: true,
              secondary: false,
              validation: true,
            },
            {
              id: "sensor-2",
              name: "Flow Meter 1",
              primary: true,
              secondary: true,
              validation: false,
            },
          ],
          defaultPermissions: [
            {
              id: "perm-1",
              name: "Hydraulic Sensors",
              type: "hydraulic",
              autoAssign: true,
            },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useSensorPermsData = () => {
  return useQuery({
    queryKey: daqKeys.sensorPerms(),
    queryFn: fetchSensorPermsData,
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
  // const response = await fetch(`${API_BASE_URL}/daq/calibration`);
  // if (!response.ok) throw new Error('Failed to fetch calibration data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          onPermissions: "Primary",
          applyType: "auto",
          weightOnBit: "manual",
          permissions: [
            {
              sensor: "Depth",
              depth: true,
              primary: true,
              secondary: false,
              validation: "OK",
              comments: "Comments",
            },
            {
              sensor: "Gas Detector HP",
              depth: false,
              primary: false,
              secondary: true,
              validation: "",
              comments: "",
            },
            {
              sensor: "SPP",
              depth: true,
              primary: true,
              secondary: false,
              validation: "OK",
              comments: "",
            },
            {
              sensor: "Flowline Temp",
              depth: true,
              primary: true,
              secondary: false,
              validation: "HP Alarm",
              comments: "",
            },
            {
              sensor: "Surface Temp",
              depth: true,
              primary: true,
              secondary: false,
              validation: "HP Alarm",
              comments: "",
            },
            {
              sensor: "LGS",
              depth: true,
              primary: true,
              secondary: false,
              validation: "OK",
              comments: "",
            },
            {
              sensor: "MW In Out Density",
              depth: false,
              primary: true,
              secondary: false,
              validation: "OK",
              comments: "Drill Variants",
            },
          ],
          defaultPermissions: [
            { name: "Wdidate", auto: true },
            { name: "Depth", auto: true },
          ],
          senectoPermissions: [
            {
              key: "opti",
              label: "OPTI:",
              enabled: true,
              hydrations: true,
              edits: 0.5,
              hasSelectType: false,
            },
            {
              key: "gasDetectorHP",
              label: "Gas Detector HP",
              enabled: true,
              hydrations: true,
              edits: 0.3,
              hasSelectType: false,
            },
            {
              key: "spp",
              label: "SPP",
              enabled: true,
              hydrations: true,
              edits: 0.3,
              hasSelectType: false,
            },
            {
              key: "flowlineTemp",
              label: "Flowline Temp",
              enabled: true,
              hydrations: true,
              edits: 0.3,
              hasSelectType: false,
            },
            {
              key: "applyPerms",
              label: "Apply Perms",
              enabled: true,
              hydrations: true,
              edits: 0.3,
              hasSelectType: true,
            },
            {
              key: "lgs",
              label: "LGS",
              enabled: true,
              hydrations: true,
              edits: 0.3,
              hasSelectType: true,
            },
          ],
          sensorPermissionsOk: true,
          validateAll: false,
          chartData: [
            { label: "Gallery", value: -33 },
            { label: "Set Perms", value: -22 },
            { label: "Summary", value: -11 },
            { label: "Summary 00", value: 7 },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useCalibrationData = () => {
  return useQuery({
    queryKey: daqKeys.calibration(),
    queryFn: fetchCalibrationData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Hydraulics Tab
// ============================================

const fetchHydraulicsData = async (): Promise<
  ApiResponse<HydraulicsTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/hydraulics`);
  // if (!response.ok) throw new Error('Failed to fetch hydraulics data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          modelsUsed: [
            {
              id: "model-1",
              name: "Bingham Plastic",
              type: "mw-rheological",
              active: true,
            },
          ],
          parameterLists: [
            {
              id: "MW In",
              name: "MW In",
              mudOut: "12.4 ppg",
              mudIn: "12.4 ppg",
              mudType: "OBM : Inputs",
              temp: "0.685 p/2.5.5",
              bbt: "234 rr",
            },
            {
              id: "RD7",
              name: "RD7",
              mudOut: "800 Typo",
              mudIn: "38.8 p/g",
              mudType: "Name inputs",
              temp: "0.885 p/2.5.5",
              bbt: "234 rr",
            },
            {
              id: "MPT",
              name: "MPT",
              mudOut: "80.9 ppg",
              mudIn: "27.5 ppg",
              mudType: "BBT 234 rr",
              temp: "0.108 p/69.65",
              bbt: "234 rr",
            },
            {
              id: "DBT",
              name: "DBT",
              mudOut: "35.0 pps",
              mudIn: "Y",
              mudType: "BBT 234 rr",
              temp: "0.185 p/8.9.5",
              bbt: "234 rr",
            },
            {
              id: "BIT",
              name: "BIT",
              mudOut: "17.5 pps",
              mudIn: "Y",
              mudType: "DBT 234 rr",
              temp: "0.685 p/10.55",
              bbt: "234 rr",
            },
          ],
          analysis: {
            ebtCharts: {},
            pressurePlots: {},
          },
          frictionLosses: {
            calculatedBy: "Manual RP",
            circulatedFlow: "Manual Low",
            circulatingFlowIn: 492,
            circulatingFlowOut: 600,
            psValue: "492 psi",
            flowValue: "600 / Stm",
            outFlowValue: "510 / Stm",
            temperature: "Temperature",
            simplified: "Simplified",
            vedPuff: "Ved Puff",
            nippleInnerDiameter: "12 DT",
            outerDiameter: "9 5/8",
            panelCostInfo: "Panel Mounting Count Cost is approx 115 approx",
            simulated: true,
            ssAf: true,
            mp73Pf: false,
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useHydraulicsData = () => {
  return useQuery({
    queryKey: daqKeys.hydraulics(),
    queryFn: fetchHydraulicsData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: System Settings Tab
// ============================================

const fetchSystemSettingsData = async (): Promise<
  ApiResponse<SystemSettingsTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/system-settings`);
  // if (!response.ok) throw new Error('Failed to fetch system settings data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          systemSettings: {
            systemType: "",
            mudSystem: "",
            controlMode: "",
            exportCompatibility: "",
            cursorDataRate: "",
            displayLanguage: "",
            quickLaunchGUI: "",
            autoPresetRestoreTime: true,
            restoreAfterHours: "",
            presetToRestore: "",
          },
          alarmSettings: {
            soundVolume: "",
            alertLength: "",
            surfaceTempOffset: "",
            hpLow: "",
            hpHigh: "",
            bitSize: "",
            bitSizeStandard: "",
            bitSizePlus: "",
            emailAlerts: "",
            emailAudity: "",
            realtimeStreamingEnabled: true,
            realtimeStreaming: "",
            autoMuteAlarms: true,
            captureRecirculation: "",
          },
          accountSecurity: {
            timeouts: "15min",
            systemSecurity: "",
            backupDirectory: "",
          },
          scheduleTime: {
            autoUTCSync: true,
            syncTime: "",
            clipTimeMode: "",
            localTime: "",
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useSystemSettingsData = () => {
  return useQuery({
    queryKey: daqKeys.systemSettings(),
    queryFn: fetchSystemSettingsData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Downloads Tab
// ============================================

const fetchDownloadsData = async (): Promise<ApiResponse<DownloadsTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/downloads`);
  // if (!response.ok) throw new Error('Failed to fetch downloads data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          daqPreset: {
            name: "Standard Configuration",
            filename: "standard-config.json",
            size: "2.5 MB",
          },
          logs: {
            timeRange: "last-day",
          },
          quickExport: {
            exportType: "logfile",
            format: "csv",
          },
          downloadHistory: [
            {
              id: "dl-1",
              filename: "log-2026-02-25.csv",
              timestamp: "2026-02-25T14:30:00Z",
              size: "15.2 MB",
              type: "logfile",
            },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useDownloadsData = () => {
  return useQuery({
    queryKey: daqKeys.downloads(),
    queryFn: fetchDownloadsData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// SAVE Mutations
// ============================================

// Display Tab
const saveDisplayData = async (
  payload: SaveDisplayPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Display Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Display settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveDisplayData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDisplayData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.display() });
    },
  });
};

// Streaming Tab
const saveStreamingData = async (
  payload: SaveStreamingPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Streaming Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Streaming settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveStreamingData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveStreamingData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.streaming() });
    },
  });
};

// Notifications Tab
const saveNotificationsData = async (
  payload: SaveNotificationsPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Notifications Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Notifications saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveNotificationsData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveNotificationsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.notifications() });
    },
  });
};

// Log Analysis Tab
const saveLogAnalysisData = async (
  payload: SaveLogAnalysisPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Log Analysis Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Log analysis settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveLogAnalysisData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveLogAnalysisData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.logAnalysis() });
    },
  });
};

// Sensor Permissions Tab
const saveSensorPermsData = async (
  payload: SaveSensorPermsPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Sensor Permissions Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Sensor permissions saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveSensorPermsData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSensorPermsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.sensorPerms() });
    },
  });
};

// Calibration Tab
const saveCalibrationData = async (
  payload: SaveCalibrationPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Calibration Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Calibration saved successfully",
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
      queryClient.invalidateQueries({ queryKey: daqKeys.calibration() });
    },
  });
};

// Hydraulics Tab
const saveHydraulicsData = async (
  payload: SaveHydraulicsPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Hydraulics Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Hydraulics settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveHydraulicsData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveHydraulicsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.hydraulics() });
    },
  });
};

// System Settings Tab
const saveSystemSettingsData = async (
  payload: SaveSystemSettingsPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving System Settings Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "System settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveSystemSettingsData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSystemSettingsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.systemSettings() });
    },
  });
};

// Downloads Tab
const saveDownloadsData = async (
  payload: SaveDownloadsPayload,
): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Downloads Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Downloads settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveDownloadsData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDownloadsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.downloads() });
    },
  });
};

// ============================================
// OPTIONS Hooks - Dropdown Options for Each Section
// ============================================

// Display Options
export const useDisplayOptions = () => {
  return useQuery({
    queryKey: [...daqKeys.display(), "options"],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              sectionTypeOptions: [
                { label: "Monitoring", value: "monitoring" },
                { label: "Trends", value: "trends" },
                { label: "Analytics", value: "analytics" },
              ],
            },
          });
        }, 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Streaming Options
export const useStreamingOptions = () => {
  return useQuery({
    queryKey: [...daqKeys.streaming(), "options"],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              witsLevelOptions: [
                { label: "Level 0", value: "Level 0" },
                { label: "Level 1", value: "Level 1" },
                { label: "Level 2", value: "Level 2" },
              ],
              destinationOptions: [{ label: "All", value: "all" }],
            },
          });
        }, 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Notifications Options
export const useNotificationsOptions = () => {
  return useQuery({
    queryKey: [...daqKeys.notifications(), "options"],
    queryFn: async (): Promise<ApiResponse<NotificationsOptionsData>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              alarmSoundOptions: [
                { label: "factory_alert.mp3", value: "factory_alert.mp3" },
                { label: "chime.mp3", value: "chime.mp3" },
                { label: "beep.mp3", value: "beep.mp3" },
              ],
              channelTypeOptions: [
                { label: "Email", value: "email" },
                { label: "SMS", value: "sms" },
                { label: "In-App", value: "in-app" },
              ],
            },
          });
        }, 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Log Analysis Options
export const useLogAnalysisOptions = () => {
  return useQuery({
    queryKey: [...daqKeys.logAnalysis(), "options"],
    queryFn: async (): Promise<ApiResponse<LogAnalysisOptionsData>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              timeRangeOptions: [
                { label: "Last Hour", value: "last-hour" },
                { label: "Last 24 Hours", value: "last-24h" },
                { label: "Last Week", value: "last-week" },
              ],
              reportFormatOptions: [
                { label: "PDF", value: "pdf" },
                { label: "CSV", value: "csv" },
              ],
            },
          });
        }, 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Sensor Permissions Options
export const useSensorPermsOptions = () => {
  return useQuery({
    queryKey: [...daqKeys.sensorPerms(), "options"],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              permissionTypeOptions: [
                { label: "Hydraulic", value: "hydraulic" },
                { label: "Permission Group", value: "perm-group" },
              ],
            },
          });
        }, 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Calibration Options
export const useCalibrationOptions = () => {
  return useQuery({
    queryKey: [...daqKeys.calibration(), "options"],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              statusOptions: [
                { label: "Valid", value: "valid" },
                { label: "Expired", value: "expired" },
                { label: "Pending", value: "pending" },
              ],
              roleOptions: [
                { label: "Technician", value: "technician" },
                { label: "Engineer", value: "engineer" },
                { label: "Supervisor", value: "supervisor" },
              ],
            },
          });
        }, 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Hydraulics Options
export const useHydraulicsOptions = () => {
  return useQuery({
    queryKey: [...daqKeys.hydraulics(), "options"],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              modelTypeOptions: [
                { label: "MW Rheological", value: "mw-rheological" },
                { label: "Friction Loss", value: "friction-loss" },
                { label: "Standing Pressure", value: "standing-pressure" },
              ],
              mudTypeOptions: [
                { label: "WBM", value: "WBM" },
                { label: "OBM", value: "OBM" },
                { label: "SBM", value: "SBM" },
              ],
              calculatedByOptions: [
                { label: "Manual RP", value: "Manual RP" },
                { label: "Auto", value: "Auto" },
              ],
              circulatedFlowOptions: [
                { label: "Manual Low", value: "Manual Low" },
                { label: "Auto", value: "Auto" },
              ],
              temperatureOptions: [
                { label: "Temperature", value: "Temperature" },
              ],
              simplifiedOptions: [{ label: "Simplified", value: "Simplified" }],
              vedPuffOptions: [{ label: "Ved Puff", value: "Ved Puff" }],
              outerDiameterOptions: [
                { label: "9 5/8", value: "9 5/8" },
                { label: "7", value: "7" },
                { label: "5 1/2", value: "5 1/2" },
              ],
            },
          });
        }, 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

// System Settings Options
export const useSystemSettingsOptions = () => {
  return useQuery({
    queryKey: [...daqKeys.systemSettings(), "options"],
    queryFn: async () => {
      return new Promise<ApiResponse<SystemSettingsOptionsData>>((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              controlModeOptions: [
                { label: "Manual", value: "manual" },
                { label: "Auto", value: "auto" },
              ],
              systemTypeOptions: [
                { label: "TS", value: "TS" },
                { label: "MPD", value: "MPD" },
              ],
              mudSystemOptions: [
                { label: "OBM", value: "OBM" },
                { label: "WBM", value: "WBM" },
                { label: "SBM", value: "SBM" },
              ],
              exportCompatibilityOptions: [
                { label: "Compute Format", value: "Compute Format" },
                { label: "Legacy Format", value: "Legacy Format" },
              ],
              displayLanguageOptions: [
                { label: "English", value: "English" },
                { label: "Spanish", value: "Spanish" },
                { label: "French", value: "French" },
              ],
              quickLaunchGUIOptions: [
                { label: "Summary", value: "Summary" },
                { label: "Dashboard", value: "Dashboard" },
                { label: "Detailed", value: "Detailed" },
              ],
              restoreAfterHoursOptions: [
                { label: "After 15 hour", value: "15" },
                { label: "After 20 hour", value: "20" },
                { label: "After 24 hour", value: "24" },
              ],
              presetToRestoreOptions: [
                { label: "Master.deGas", value: "Master.deGas" },
                { label: "Default", value: "Default" },
                { label: "Custom", value: "Custom" },
              ],
              soundVolumeOptions: [
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ],
              alertLengthOptions: [
                { label: "1 sec", value: "1 sec" },
                { label: "3 sec", value: "3 sec" },
                { label: "5 sec", value: "5 sec" },
              ],
              bitSizeStandardOptions: [
                { label: "Standard", value: "Standard" },
                { label: "+5°F", value: "+5°F" },
                { label: "+5°E", value: "+5°E" },
              ],
              emailAlertsOptions: [
                { label: "nfq-21@quantexq.com", value: "nfq-21@quantexq.com" },
                { label: "admin@quantexq.com", value: "admin@quantexq.com" },
              ],
              emailAudityOptions: [
                { label: "Audity", value: "Audity" },
                { label: "Silent", value: "Silent" },
              ],
              realtimeStreamingOptions: [
                {
                  label: "DAQ-Notifications, Log Analysis",
                  value: "DAQ-Notifications, Log Analysis",
                },
                { label: "Other Option", value: "Other Option" },
              ],
              captureRecirculationOptions: [
                { label: "Capture Recirculation", value: "12/DT" },
              ],
              timeoutsOptions: [
                { label: "15min", value: "15min" },
                { label: "30min", value: "30min" },
                { label: "45min", value: "45min" },
                { label: "60min", value: "60min" },
              ],
              clipTimeModeOptions: [
                { label: "Clip Time Tumult", value: "Clip Time Tumult" },
                { label: "Standard Time", value: "Standard Time" },
              ],
              localTimeFormatOptions: [
                { label: "24-Hour format", value: "06 Feb 2026 / 16:37" },
                { label: "12-Hour format", value: "06 Feb 2026 / 04:37 PM" },
              ],
              utcTimeOptions: [
                { label: "UTC 0:00", value: "06 Feb 2026 / 16:37" },
                { label: "UTC +1:00", value: "06 Feb 2026 / 17:37" },
                { label: "UTC -1:00", value: "06 Feb 2026 / 15:37" },
              ],
            },
          });
        }, 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Downloads Options
export const useDownloadsOptions = () => {
  return useQuery({
    queryKey: [...daqKeys.downloads(), "options"],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              timeRangeOptions: [
                { label: "Last Hour", value: "last-hour" },
                { label: "Last Day", value: "last-day" },
                { label: "Last Week", value: "last-week" },
                { label: "Custom", value: "custom" },
              ],
              exportFormatOptions: [
                { label: "CSV", value: "csv" },
                { label: "WITSML", value: "witsml" },
                { label: "IPF", value: "ipf" },
              ],
              exportTypeOptions: [
                { label: "Preset", value: "preset" },
                { label: "Logfile", value: "logfile" },
                { label: "DAQ Summary", value: "daq-summary" },
              ],
            },
          });
        }, 300);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
};
