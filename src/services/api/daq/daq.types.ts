/**
 * DAQ Section API Types
 * Types for DAQ section with all 10 tabs
 */

// ============================================
// DAQ Section - Complete Data Structure
// ============================================

export interface DaqData {
  display: DisplayTabData;
  streaming: StreamingTabData;
  notifications: NotificationsTabData;
  logAnalysis: LogAnalysisTabData;
  sensorPerms: SensorPermsTabData;
  calibration: CalibrationTabData;
  hydraulics: HydraulicsTabData;
  systemSettings: SystemSettingsTabData;
  downloads: DownloadsTabData;
}

// ============================================
// Display Tab
// ============================================

export interface DisplayTabData {
  sections: DisplaySection[];
}

export interface DisplaySection {
  id: string;
  title: string;
  description: string;
  type: string;
  enabled: boolean;
}

export interface SaveDisplayPayload {
  sections: DisplaySection[];
}

// ============================================
// Streaming & Logging Tab
// ============================================

export interface StreamingTabData {
  witsStream: WitsStreamConfig;
  edrLogging: EdrLoggingConfig;
  dataRate: DataRateConfig;
  liveExport: LiveExportConfig;
}

export interface WitsStreamConfig {
  enabled: boolean;
  level: "0" | "1";
  endpoint: string;
  baudRate: number;
}

export interface EdrLoggingConfig {
  enabled: boolean;
  rate: number;
  channels: string[];
  format: "csv" | "json" | "binary";
}

export interface DataRateConfig {
  frequency: number;
  bufferSize: number;
  downsampling: boolean;
}

export interface LiveExportConfig {
  enabled: boolean;
  targets: string[];
  format: "csv" | "json";
}

export interface SaveStreamingPayload {
  witsStream: WitsStreamConfig;
  edrLogging: EdrLoggingConfig;
  dataRate: DataRateConfig;
  liveExport: LiveExportConfig;
}

// ============================================
// Notifications Tab
// ============================================

export interface NotificationsTabData {
  alarmRules: AlarmRule[];
  channels: NotificationChannel[];
  escalation: EscalationPolicy;
  muteRules: MuteRule[];
}

export interface AlarmRule {
  id: string;
  name: string;
  channel: string;
  threshold: number;
  enabled: boolean;
}

export interface NotificationChannel {
  id: string;
  type: "email" | "sms" | "in-app";
  address: string;
  enabled: boolean;
}

export interface EscalationPolicy {
  enabled: boolean;
  levels: EscalationLevel[];
}

export interface EscalationLevel {
  level: number;
  delay: number;
  contacts: string[];
}

export interface MuteRule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface SaveNotificationsPayload {
  alarmRules: AlarmRule[];
  channels: NotificationChannel[];
  escalation: EscalationPolicy;
  muteRules: MuteRule[];
}

// ============================================
// Log Analysis Tab
// ============================================

export interface LogAnalysisTabData {
  logViewer: LogViewerConfig;
  trendAnalysis: TrendAnalysisConfig;
  reportGeneration: ReportGenerationConfig;
  logArchive: LogArchiveConfig;
}

export interface LogViewerConfig {
  timeRange: string;
  channels: string[];
  filters: Record<string, unknown>;
}

export interface TrendAnalysisConfig {
  enabled: boolean;
  channels: string[];
  anomalyDetection: boolean;
}

export interface ReportGenerationConfig {
  format: "pdf" | "csv";
  schedule: string;
}

export interface LogArchiveConfig {
  retentionDays: number;
  storageUsed: number;
  storageLimit: number;
}

export interface SaveLogAnalysisPayload {
  logViewer: LogViewerConfig;
  trendAnalysis: TrendAnalysisConfig;
  reportGeneration: ReportGenerationConfig;
  logArchive: LogArchiveConfig;
}

// ============================================
// Sensor Permissions Tab
// ============================================

export interface SensorPermsTabData {
  sensors: SensorChannel[];
  defaultPermissions: DefaultPermissionList[];
}

export interface SensorChannel {
  id: string;
  name: string;
  primary: boolean;
  secondary: boolean;
  validation: boolean;
}

export interface DefaultPermissionList {
  id: string;
  name: string;
  type: "hydraulic" | "perm-group";
  autoAssign: boolean;
}

export interface SaveSensorPermsPayload {
  sensors: SensorChannel[];
  defaultPermissions: DefaultPermissionList[];
}

// ============================================
// Calibration Tab
// ============================================

export interface CalibrationTabData {
  calibrations: CalibrationProfile[];
  history: CalibrationHistory[];
  permissions: CalibrationPermissions;
}

export interface CalibrationProfile {
  id: string;
  sensorId: string;
  sensorName: string;
  zeroPoint: number;
  span: number;
  lastCalibrated: string;
  status: "valid" | "expired" | "pending";
}

export interface CalibrationHistory {
  id: string;
  sensorId: string;
  timestamp: string;
  performedBy: string;
  drift: number;
}

export interface CalibrationPermissions {
  canPerform: string[];
  canApprove: string[];
}

export interface SaveCalibrationPayload {
  calibrations: CalibrationProfile[];
  permissions: CalibrationPermissions;
}

// ============================================
// Hydraulics Models Tab
// ============================================

export interface HydraulicsTabData {
  modelsUsed: HydraulicModel[];
  parameterLists: HydraulicParameterList[];
  analysis: HydraulicsAnalysis;
  frictionLosses: FrictionLossesSummary;
}

export interface HydraulicModel {
  id: string;
  name: string;
  type: "mw-rheological" | "friction-loss" | "standing-pressure";
  active: boolean;
}

export interface HydraulicParameterList {
  id: string;
  name: string;
  mudOut: number;
  mudType: string;
  temp: number;
  bbt: number;
}

export interface HydraulicsAnalysis {
  ebtCharts: Record<string, unknown>;
  pressurePlots: Record<string, unknown>;
}

export interface FrictionLossesSummary {
  calculatedPs: number;
  circulatedFlow: number;
  annularFrictionLoss: number;
  circulatingFlowIn: number;
  circulatingFlowOut: number;
}

export interface SaveHydraulicsPayload {
  modelsUsed: HydraulicModel[];
  parameterLists: HydraulicParameterList[];
}

// ============================================
// System Settings Tab
// ============================================

export interface SystemSettingsTabData {
  daqPreset: DaqPresetConfig;
  controlMode: ControlModeConfig;
  systemState: SystemStateData;
  systemValidation: SystemValidationData;
  hardwareConfig: HardwareConfigData;
}

export interface DaqPresetConfig {
  active: string;
  name: string;
  profileOverrides: Record<string, unknown>;
}

export interface ControlModeConfig {
  mode: "manual" | "auto";
  mpdSystemState: string;
}

export interface SystemStateData {
  flowControlMode: string;
  depth: number;
  chokeStatus: string;
  gasDetectorHP: string;
}

export interface SystemValidationData {
  ds: string;
  kop: string;
  surfaceTemp: string;
  flowlineTemp: string;
  status: "OK" | "Warning" | "Error";
}

export interface HardwareConfigData {
  sensors: HardwareSensor[];
  ioChannels: IoChannel[];
}

export interface HardwareSensor {
  id: string;
  name: string;
  type: string;
  firmware: string;
}

export interface IoChannel {
  id: string;
  channel: string;
  assignment: string;
}

export interface SaveSystemSettingsPayload {
  daqPreset: DaqPresetConfig;
  controlMode: ControlModeConfig;
  hardwareConfig: HardwareConfigData;
}

// ============================================
// Downloads Tab
// ============================================

export interface DownloadsTabData {
  daqPreset: DownloadablePreset;
  logs: LogFilter;
  quickExport: QuickExportConfig;
  downloadHistory: DownloadHistoryItem[];
}

export interface DownloadablePreset {
  name: string;
  filename: string;
  size: string;
}

export interface LogFilter {
  timeRange: "last-hour" | "last-day" | "last-week" | "custom";
  customStart?: string;
  customEnd?: string;
}

export interface QuickExportConfig {
  exportType: "preset" | "logfile" | "daq-summary";
  format: "csv" | "witsml" | "ipf";
}

export interface DownloadHistoryItem {
  id: string;
  filename: string;
  timestamp: string;
  size: string;
  type: string;
}

export interface SaveDownloadsPayload {
  logs: LogFilter;
  quickExport: QuickExportConfig;
}
