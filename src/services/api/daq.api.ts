/**
 * DAQ Section API Handlers
 * TanStack Query hooks for DAQ section
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, SaveResult } from './types';
import type {
  DaqData,
  SaveDaqOverviewPayload,
  SaveCalibrationPayload,
  SaveStreamingPayload,
} from './daq.types';

// ============================================
// Query Keys
// ============================================

export const daqKeys = {
  all: ['daq'] as const,
  data: () => [...daqKeys.all, 'data'] as const,
};

// ============================================
// API Base URL
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// ============================================
// GET: Fetch All DAQ Data
// ============================================

const fetchDaqData = async (): Promise<ApiResponse<DaqData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq`);
  // if (!response.ok) throw new Error('Failed to fetch DAQ data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          overview: {
            systemStatus: 'online',
            channels: [
              {
                id: 'ch-1',
                name: 'Pressure Sensor 1',
                type: 'analog',
                unit: 'PSI',
                enabled: true,
                currentValue: 125.5,
                range: { min: 0, max: 500 },
              },
              {
                id: 'ch-2',
                name: 'Temperature Sensor',
                type: 'analog',
                unit: '°C',
                enabled: true,
                currentValue: 72.3,
                range: { min: -50, max: 150 },
              },
            ],
            samplingRate: 1000,
            bufferSize: 10000,
          },
          calibration: {
            calibrations: [
              {
                id: 'cal-1',
                name: 'Pressure Cal Profile 1',
                channelId: 'ch-1',
                offset: 0.5,
                scale: 1.02,
                lastCalibrated: new Date().toISOString(),
              },
            ],
            activeProfile: 'cal-1',
          },
          streaming: {
            streamingEnabled: true,
            endpoints: [
              {
                id: 'stream-1',
                name: 'WebSocket Stream',
                url: 'ws://localhost:8080/stream',
                protocol: 'websocket',
                enabled: true,
              },
            ],
            dataFormat: 'json',
            compressionEnabled: false,
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useDaqData = () => {
  return useQuery({
    queryKey: daqKeys.data(),
    queryFn: fetchDaqData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// SAVE: Overview Tab
// ============================================

const saveDaqOverview = async (
  payload: SaveDaqOverviewPayload
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/overview`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save DAQ overview');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving DAQ Overview Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'DAQ overview saved successfully',
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveDaqOverview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDaqOverview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.data() });
    },
  });
};

// ============================================
// SAVE: Calibration Tab
// ============================================

const saveCalibration = async (
  payload: SaveCalibrationPayload
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/calibration`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save calibration');
  // return response.json();

  // MOCK RESPONSE
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

export const useSaveCalibration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCalibration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.data() });
    },
  });
};

// ============================================
// SAVE: Streaming Tab
// ============================================

const saveStreaming = async (
  payload: SaveStreamingPayload
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/daq/streaming`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save streaming settings');
  // return response.json();

  // MOCK RESPONSE
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

export const useSaveStreaming = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveStreaming,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daqKeys.data() });
    },
  });
};
