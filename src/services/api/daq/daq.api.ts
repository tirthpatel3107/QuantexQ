/**
 * DAQ Section API Handlers
 * TanStack Query hooks for DAQ section - Each tab has its own GET API endpoint
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, SaveResult } from '../types';
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
} from './daq.types';

// ============================================
// Query Keys
// ============================================

export const daqKeys = {
  all: ['daq'] as const,
  display: () => [...daqKeys.all, 'display'] as const,
  streaming: () => [...daqKeys.all, 'streaming'] as const,
  notifications: () => [...daqKeys.all, 'notifications'] as const,
  logAnalysis: () => [...daqKeys.all, 'logAnalysis'] as const,
  sensorPerms: () => [...daqKeys.all, 'sensorPerms'] as const,
  calibration: () => [...daqKeys.all, 'calibration'] as const,
  hydraulics: () => [...daqKeys.all, 'hydraulics'] as const,
  systemSettings: () => [...daqKeys.all, 'systemSettings'] as const,
  downloads: () => [...daqKeys.all, 'downloads'] as const,
};

// ============================================
// API Base URL
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
            {
              id: 'sec-1',
              title: 'Real-time Monitoring',
              description: 'Live sensor data display',
              type: 'monitoring',
              enabled: true,
            },
            {
              id: 'sec-2',
              title: 'Historical Trends',
              description: 'Time-series data visualization',
              type: 'trends',
              enabled: true,
            },
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
          witsStream: {
            enabled: true,
            level: '1',
            endpoint: 'tcp://192.168.1.100:5000',
            baudRate: 9600,
          },
          edrLogging: {
            enabled: true,
            rate: 1000,
            channels: ['pressure', 'temperature', 'flow'],
            format: 'csv',
          },
          dataRate: {
            frequency: 100,
            bufferSize: 10000,
            downsampling: false,
          },
          liveExport: {
            enabled: false,
            targets: [],
            format: 'json',
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

const fetchNotificationsData = async (): Promise<ApiResponse<NotificationsTabData>> => {
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
          alarmRules: [
            {
              id: 'alarm-1',
              name: 'High Pressure Alert',
              channel: 'pressure-1',
              threshold: 500,
              enabled: true,
            },
          ],
          channels: [
            {
              id: 'ch-1',
              type: 'email',
              address: 'operator@example.com',
              enabled: true,
            },
          ],
          escalation: {
            enabled: true,
            levels: [
              {
                level: 1,
                delay: 300,
                contacts: ['operator@example.com'],
              },
            ],
          },
          muteRules: [],
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

const fetchLogAnalysisData = async (): Promise<ApiResponse<LogAnalysisTabData>> => {
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
          logViewer: {
            timeRange: 'last-24h',
            channels: ['pressure', 'temperature'],
            filters: {},
          },
          trendAnalysis: {
            enabled: true,
            channels: ['pressure'],
            anomalyDetection: true,
          },
          reportGeneration: {
            format: 'pdf',
            schedule: 'daily',
          },
          logArchive: {
            retentionDays: 90,
            storageUsed: 45000,
            storageLimit: 100000,
          },
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

const fetchSensorPermsData = async (): Promise<ApiResponse<SensorPermsTabData>> => {
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
              id: 'sensor-1',
              name: 'Pressure Sensor 1',
              primary: true,
              secondary: false,
              validation: true,
            },
            {
              id: 'sensor-2',
              name: 'Flow Meter 1',
              primary: true,
              secondary: true,
              validation: false,
            },
          ],
          defaultPermissions: [
            {
              id: 'perm-1',
              name: 'Hydraulic Sensors',
              type: 'hydraulic',
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

const fetchCalibrationData = async (): Promise<ApiResponse<CalibrationTabData>> => {
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
          calibrations: [
            {
              id: 'cal-1',
              sensorId: 'sensor-1',
              sensorName: 'Pressure Sensor 1',
              zeroPoint: 0.0,
              span: 500.0,
              lastCalibrated: '2026-02-20T10:30:00Z',
              status: 'valid',
            },
          ],
          history: [
            {
              id: 'hist-1',
              sensorId: 'sensor-1',
              timestamp: '2026-02-20T10:30:00Z',
              performedBy: 'John Doe',
              drift: 0.05,
            },
          ],
          permissions: {
            canPerform: ['technician', 'engineer'],
            canApprove: ['engineer', 'supervisor'],
          },
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

const fetchHydraulicsData = async (): Promise<ApiResponse<HydraulicsTabData>> => {
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
              id: 'model-1',
              name: 'Bingham Plastic',
              type: 'mw-rheological',
              active: true,
            },
          ],
          parameterLists: [
            {
              id: 'param-1',
              name: 'Standard Mud',
              mudOut: 12.5,
              mudType: 'WBM',
              temp: 75,
              bbt: 150,
            },
          ],
          analysis: {
            ebtCharts: {},
            pressurePlots: {},
          },
          frictionLosses: {
            calculatedPs: 2500,
            circulatedFlow: 450,
            annularFrictionLoss: 150,
            circulatingFlowIn: 450,
            circulatingFlowOut: 445,
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

const fetchSystemSettingsData = async (): Promise<ApiResponse<SystemSettingsTabData>> => {
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
          daqPreset: {
            active: 'preset-1',
            name: 'Standard Configuration',
            profileOverrides: {},
          },
          controlMode: {
            mode: 'auto',
            mpdSystemState: 'active',
          },
          systemState: {
            flowControlMode: 'auto',
            depth: 5000,
            chokeStatus: 'open',
            gasDetectorHP: 'normal',
          },
          systemValidation: {
            ds: 'OK',
            kop: 'OK',
            surfaceTemp: 'OK',
            flowlineTemp: 'OK',
            status: 'OK',
          },
          hardwareConfig: {
            sensors: [
              {
                id: 'hw-1',
                name: 'Pressure Transducer',
                type: 'analog',
                firmware: 'v2.1.0',
              },
            ],
            ioChannels: [
              {
                id: 'io-1',
                channel: 'AI-01',
                assignment: 'Pressure Sensor 1',
              },
            ],
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
            name: 'Standard Configuration',
            filename: 'standard-config.json',
            size: '2.5 MB',
          },
          logs: {
            timeRange: 'last-day',
          },
          quickExport: {
            exportType: 'logfile',
            format: 'csv',
          },
          downloadHistory: [
            {
              id: 'dl-1',
              filename: 'log-2026-02-25.csv',
              timestamp: '2026-02-25T14:30:00Z',
              size: '15.2 MB',
              type: 'logfile',
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
const saveDisplayData = async (payload: SaveDisplayPayload): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Display Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Display settings saved successfully',
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
const saveStreamingData = async (payload: SaveStreamingPayload): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Streaming Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Streaming settings saved successfully',
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
const saveNotificationsData = async (payload: SaveNotificationsPayload): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Notifications Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Notifications saved successfully',
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
const saveLogAnalysisData = async (payload: SaveLogAnalysisPayload): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Log Analysis Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Log analysis settings saved successfully',
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
const saveSensorPermsData = async (payload: SaveSensorPermsPayload): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Sensor Permissions Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Sensor permissions saved successfully',
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
const saveCalibrationData = async (payload: SaveCalibrationPayload): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Calibration Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Calibration saved successfully',
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
const saveHydraulicsData = async (payload: SaveHydraulicsPayload): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Hydraulics Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Hydraulics settings saved successfully',
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
const saveSystemSettingsData = async (payload: SaveSystemSettingsPayload): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving System Settings Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'System settings saved successfully',
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
const saveDownloadsData = async (payload: SaveDownloadsPayload): Promise<ApiResponse<SaveResult>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Downloads Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Downloads settings saved successfully',
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
