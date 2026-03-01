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

/** Settings & Summary panel */
export interface NotificationsSettingsSummary {
  alarmSound: string;
  alarmNotifications: boolean;
  acceptableWrns: boolean;
  acceptableCmpncs: boolean;
  validityCompletion: boolean;
}

/** Notificating Store panel */
export interface NotificationsStore {
  remindOnReset: boolean;
  selfDismissing: boolean;
  unusetComplessible: boolean;
  enableNewAlarm: boolean;
  alarmClearDiagnostics: boolean;
  inboundRate: boolean;
}

/** Notification Log entry (read-only, fetched not saved) */
export interface NotificationLogEntry {
  id: string;
  type: "high" | "medium" | "low";
  mention: string;
  message: string;
  severity: string;
  status: "OK" | "DIAG" | "NEEDED";
}

export interface NotificationsTabData {
  settings: NotificationsSettingsSummary;
  store: NotificationsStore;
  log: NotificationLogEntry[];
}

export interface SaveNotificationsPayload {
  settings: NotificationsSettingsSummary;
  store: NotificationsStore;
}

// ============================================
// Log Analysis Tab
// ============================================

export interface LogAnalysisTabData {
  logResults: LogResultsConfig;
  trendAnalysis: TrendPlotConfig;
  alertNotifyAnalysis: AlertNotifyConfig;
  responseTime: ResponseTimeConfig;
  logEntries: LogEntry[];
}

export interface LogResultsConfig {
  dataFilterLevel: string;
  startTime: string;
  endTime: string;
}

export interface TrendPlotConfig {
  period: string;
  plots: {
    sbp: boolean;
    spp: boolean;
    bhp: boolean;
    hlw: boolean;
  };
}

export interface AlertNotifyConfig {
  criticalAlerts: {
    cb: number;
    ch: number;
    spp: number;
    sbpAccepted: number;
    arAlerts: number;
  };
  alertPlotEnabled: boolean;
}

export interface ResponseTimeConfig {
  enabled: boolean;
  period: string;
}

export interface LogEntry {
  id: string;
  problemId: string;
  pigging: string;
  time: string;
  message: string;
  severity: "high" | "medium" | "low" | "info";
}

export interface SaveLogAnalysisPayload {
  logResults: LogResultsConfig;
  trendAnalysis: TrendPlotConfig;
  alertNotifyAnalysis: AlertNotifyConfig;
  responseTime: ResponseTimeConfig;
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
  systemSettings: {
    systemType: string;
    mudSystem: string;
    controlMode: string;
    exportCompatibility: string;
    cursorDataRate: string;
    displayLanguage: string;
    quickLaunchGUI: string;
    autoPresetRestoreTime: boolean;
    restoreAfterHours: string;
    presetToRestore: string;
  };
  alarmSettings: {
    soundVolume: string;
    alertLength: string;
    surfaceTempOffset: string;
    hpLow: string;
    hpHigh: string;
    bitSize: string;
    bitSizeStandard: string;
    bitSizePlus: string;
    emailAlerts: string;
    emailAudity: string;
    realtimeStreamingEnabled: boolean;
    realtimeStreaming: string;
    autoMuteAlarms: boolean;
    captureRecirculation: string;
  };
  accountSecurity: {
    timeouts: string;
    systemSecurity: string;
    backupDirectory: string;
  };
  scheduleTime: {
    autoUTCSync: boolean;
    syncTime: string;
    clipTimeMode: string;
    localTime: string;
  };
}

export type SaveSystemSettingsPayload = SystemSettingsTabData;

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

// ============================================
// Options Data Types
// ============================================

export interface DisplayOptionsData {
  sectionTypeOptions: Array<{ label: string; value: string }>;
}

export interface StreamingOptionsData {
  witsLevelOptions: Array<{ label: string; value: string }>;
  formatOptions: Array<{ label: string; value: string }>;
  baudRateOptions: Array<{ label: string; value: number }>;
}

export interface NotificationsOptionsData {
  alarmSoundOptions: Array<{ label: string; value: string }>;
  channelTypeOptions: Array<{ label: string; value: string }>;
}

export interface LogAnalysisOptionsData {
  timeRangeOptions: Array<{ label: string; value: string }>;
  reportFormatOptions: Array<{ label: string; value: string }>;
}

export interface SensorPermsOptionsData {
  permissionTypeOptions: Array<{ label: string; value: string }>;
}

export interface CalibrationOptionsData {
  statusOptions: Array<{ label: string; value: string }>;
  roleOptions: Array<{ label: string; value: string }>;
}

export interface HydraulicsOptionsData {
  modelTypeOptions: Array<{ label: string; value: string }>;
  mudTypeOptions: Array<{ label: string; value: string }>;
}

export interface SystemSettingsOptionsData {
  controlModeOptions: Array<{ label: string; value: string }>;
  systemTypeOptions: Array<{ label: string; value: string }>;
  mudSystemOptions: Array<{ label: string; value: string }>;
  exportCompatibilityOptions: Array<{ label: string; value: string }>;
  displayLanguageOptions: Array<{ label: string; value: string }>;
  quickLaunchGUIOptions: Array<{ label: string; value: string }>;
  restoreAfterHoursOptions: Array<{ label: string; value: string }>;
  presetToRestoreOptions: Array<{ label: string; value: string }>;
  soundVolumeOptions: Array<{ label: string; value: string }>;
  alertLengthOptions: Array<{ label: string; value: string }>;
  bitSizeStandardOptions: Array<{ label: string; value: string }>;
  emailAlertsOptions: Array<{ label: string; value: string }>;
  emailAudityOptions: Array<{ label: string; value: string }>;
  realtimeStreamingOptions: Array<{ label: string; value: string }>;
  captureRecirculationOptions: Array<{ label: string; value: string }>;
  timeoutsOptions: Array<{ label: string; value: string }>;
  clipTimeModeOptions: Array<{ label: string; value: string }>;
  localTimeFormatOptions: Array<{ label: string; value: string }>;
  utcTimeOptions: Array<{ label: string; value: string }>;
}

export interface DownloadsOptionsData {
  timeRangeOptions: Array<{ label: string; value: string }>;
  exportFormatOptions: Array<{ label: string; value: string }>;
  exportTypeOptions: Array<{ label: string; value: string }>;
}
