/**
 * Network Section API Types
 * Types for Network section with Sources, Destinations, and Protocols tabs
 */

// ============================================
// Network Section - Complete Data Structure
// ============================================

export interface NetworkData {
  sources: SourcesTabData;
  destinations: DestinationsTabData;
  protocols: ProtocolsTabData;
}

// ============================================
// Sources Tab
// ============================================

export interface SourcesTabData {
  sources: NetworkSource[];
  defaultSource?: string;
}

export interface NetworkSource {
  id: string;
  name: string;
  type: 'ethernet' | 'serial' | 'usb' | 'wireless';
  ipAddress?: string;
  port?: number;
  baudRate?: number;
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'error';
  lastSeen?: string;
}

export interface SaveSourcesPayload {
  sources: NetworkSource[];
  defaultSource?: string;
}

// ============================================
// Destinations Tab
// ============================================

export interface DestinationsTabData {
  destinations: NetworkDestination[];
  routingRules: RoutingRule[];
}

export interface NetworkDestination {
  id: string;
  name: string;
  type: 'cloud' | 'local' | 'remote';
  endpoint: string;
  protocol: 'http' | 'https' | 'mqtt' | 'websocket';
  enabled: boolean;
  authentication?: {
    type: 'none' | 'basic' | 'token' | 'oauth';
    credentials?: Record<string, string>;
  };
}

export interface RoutingRule {
  id: string;
  sourceId: string;
  destinationId: string;
  filter?: string;
  priority: number;
}

export interface SaveDestinationsPayload {
  destinations: NetworkDestination[];
  routingRules: RoutingRule[];
}

// ============================================
// Protocols Tab
// ============================================

export interface ProtocolsTabData {
  protocols: ProtocolConfig[];
  globalSettings: ProtocolGlobalSettings;
}

export interface ProtocolConfig {
  id: string;
  name: string;
  type: 'modbus' | 'mqtt' | 'opcua' | 'http' | 'custom';
  enabled: boolean;
  settings: Record<string, unknown>;
  timeout: number;
  retryAttempts: number;
}

export interface ProtocolGlobalSettings {
  defaultTimeout: number;
  maxConnections: number;
  keepAlive: boolean;
  compressionEnabled: boolean;
}

export interface SaveProtocolsPayload {
  protocols: ProtocolConfig[];
  globalSettings: ProtocolGlobalSettings;
}
