/**
 * DAQ Section API Types
 * Types for DAQ section tabs
 */

// ============================================
// DAQ Section - Complete Data Structure
// ============================================

export interface DaqData {
  overview: DaqOverviewTabData;
  calibration: CalibrationTabData;
  streaming: StreamingTabData;
}

// ============================================
// Overview Tab
// ============================================

export interface DaqOverviewTabData {
  systemStatus: 'online' | 'offline' | 'error';
  channels: DaqChannel[];
  samplingRate: number;
  bufferSize: number;
}

export interface DaqChannel {
  id: string;
  name: string;
  type: 'analog' | 'digital';
  unit: string;
  enabled: boolean;
  currentValue?: number;
  range: { min: number; max: number };
}

export interface SaveDaqOverviewPayload {
  channels: DaqChannel[];
  samplingRate: number;
  bufferSize: number;
}

// ============================================
// Calibration Tab
// ============================================

export interface CalibrationTabData {
  calibrations: CalibrationProfile[];
  activeProfile?: string;
}

export interface CalibrationProfile {
  id: string;
  name: string;
  channelId: string;
  offset: number;
  scale: number;
  lastCalibrated: string;
}

export interface SaveCalibrationPayload {
  calibrations: CalibrationProfile[];
  activeProfile?: string;
}

// ============================================
// Streaming Tab
// ============================================

export interface StreamingTabData {
  streamingEnabled: boolean;
  endpoints: StreamingEndpoint[];
  dataFormat: 'json' | 'csv' | 'binary';
  compressionEnabled: boolean;
}

export interface StreamingEndpoint {
  id: string;
  name: string;
  url: string;
  protocol: 'websocket' | 'mqtt' | 'http';
  enabled: boolean;
}

export interface SaveStreamingPayload {
  streamingEnabled: boolean;
  endpoints: StreamingEndpoint[];
  dataFormat: 'json' | 'csv' | 'binary';
  compressionEnabled: boolean;
}
