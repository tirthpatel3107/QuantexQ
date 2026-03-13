/**
 * Network Section API Types
 * Types for Network section with Sources, Protocols, Routing, Security, and Diagnostics tabs
 */

// ============================================
// Network Section - Complete Data Structure
// ============================================

export interface NetworkData {
  sources: SourcesTabData;
  protocols: ProtocolsTabData;
  routing: RoutingTabData;
  security: SecurityTabData;
  diagnostics: DiagnosticsTabData;
}

// ============================================
// Sources Tab
// ============================================

export interface SourcesTabData {
  rigPlc: RigPlcSource;
  pwdWits: PwdWitsSource;
  devices: {
    enabled: boolean;
    items: DeviceSource[];
  };
  healthMonitoring: HealthMonitoringData;
}

export interface RigPlcSource {
  enabled: boolean;
  connectionStatus: "Primary" | "Connected" | "Disconnected";
  sourceType: string;
  endpoint: string;
  port: string;
  tagMap: string;
  dataRate: string;
}

export interface PwdWitsSource {
  enabled: boolean;
  endpoint: string;
  port: string;
  dataRate: string;
  frequency: string;
  tagMap: string;
}

export interface DeviceSource {
  id: string;
  name: string;
  tags: string;
  healthStatus: "OK" | "Warning" | "Error";
  healthCount: string;
}

export interface HealthMonitoringData {
  sources: HealthSource[];
}

export interface HealthSource {
  name: string;
  status: "Connected" | "Disconnected" | "Validating";
  lastSeen?: string;
  latency?: string;
}

export interface SaveSourcesPayload {
  rigPlc: RigPlcSource;
  pwdWits: PwdWitsSource;
  devices: {
    enabled: boolean;
    items: DeviceSource[];
  };
}

export interface SourcesOptionsData {
  tagMapOptions: Array<{ value: string; label: string }>;
  dataRateOptions: Array<{ value: string; label: string }>;
  frequencyOptions: Array<{ value: string; label: string }>;
}

// ============================================
// Protocols Options
// ============================================

export interface ProtocolsOptionsData {
  protocolTypeOptions: Array<{ value: string; label: string }>;
  endpointOptions: Array<{ value: string; label: string }>;
}

// ============================================
// Routing Options
// ============================================

export interface RoutingOptionsData {
  portOptions: Array<{ value: string; label: string }>;
  tagMapOptions: Array<{ value: string; label: string }>;
}

// ============================================
// Security Options
// ============================================

export interface SecurityOptionsData {
  authMethodOptions: Array<{ value: string; label: string }>;
  portOptions: Array<{ value: string; label: string }>;
}

// ============================================
// Diagnostics Options
// ============================================

export interface DiagnosticsOptionsData {
  durationOptions: Array<{ value: string; label: string }>;
  testTypeOptions: Array<{ value: string; label: string }>;
}

// ============================================
// Protocols Tab
// ============================================

export interface ProtocolsTabData {
  rigPlc: {
    type: "modbus-tcp" | "opc-ua" | "ethernet-ip";
    modbusEndpoints?: string[];
    opcEndpoint?: string;
    ethernetEndpoint?: string;
  };
  pwd: {
    type:
      | "direct-wits"
      | "witsml-left"
      | "mqtt"
      | "tcp-udp-left"
      | "witsml-right"
      | "tcp-udp-right";
    endpoint?: string;
  };
}

export interface SaveProtocolsPayload {
  rigPlc: {
    type: "modbus-tcp" | "opc-ua" | "ethernet-ip";
    modbusEndpoints?: string[];
    opcEndpoint?: string;
    ethernetEndpoint?: string;
  };
  pwd: {
    type:
      | "direct-wits"
      | "witsml-left"
      | "mqtt"
      | "tcp-udp-left"
      | "witsml-right"
      | "tcp-udp-right";
    endpoint?: string;
  };
}

// ============================================
// Routing Tab
// ============================================

export interface RoutingTabData {
  routes: RoutingConfig[];
}

export interface RoutingConfig {
  id: string;
  name: string;
  type: "tag-mapping" | "dualq-control" | "slc-logic";
  description: string;
  enabled: boolean;
  settings: Record<string, unknown>;
}

export interface SaveRoutingPayload {
  routes: RoutingConfig[];
}

// ============================================
// Security Tab
// ============================================

export interface SecurityTabData {
  securityProfiles: SecurityProfile[];
}

export interface SecurityProfile {
  id: string;
  name: string;
  type: "tls" | "auth" | "firewall";
  description: string;
  enabled: boolean;
  settings: Record<string, unknown>;
}

export interface SaveSecurityPayload {
  securityProfiles: SecurityProfile[];
}

// ============================================
// Diagnostics Tab
// ============================================

export interface DiagnosticsTabData {
  diagnosticTools: DiagnosticTool[];
  lastReport?: DiagnosticReport;
}

export interface DiagnosticTool {
  id: string;
  name: string;
  type: "jitter" | "integrity" | "advanced" | "report";
  description: string;
  status: "idle" | "running" | "completed";
}

export interface DiagnosticReport {
  id: string;
  timestamp: string;
  status: "OK" | "Warning" | "Error";
}

export interface SaveDiagnosticsPayload {
  diagnosticTools: DiagnosticTool[];
}
