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
  streaming: {
    enabled: boolean;
    realTimeLevel: string;
    destination: string;
  };
  loggingStatus: {
    enabled: boolean;
    frequency: string;
    autoCache: boolean;
    startLoggingUponSystemReady: boolean;
    appendOnLogStop: boolean;
  };
  loggingDestinations: {
    exportLogFiles: {
      destinationLogsTo: string;
      anotherDirectory: string;
      diskCacheDirectory: string;
    };
    network: {
      networkLocation: string;
      directory: string;
    };
  };
  ftpServer: {
    ftpUrl1: string;
    ftpUrl2: string;
    ftpPas: string;
  };
}

export type SaveStreamingPayload = StreamingTabData;

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

/** A single sensor row in the Sensor Permissions table */
export interface CalibrationSensorPermission {
  sensor: string;
  depth: boolean;
  primary: boolean;
  secondary: boolean;
  validation: string; // e.g. "OK", "HP Alarm", ""
  comments: string;
}

/** A named preset list item (WildLife, Depth, etc.) */
export interface CalibrationDefaultPermissionItem {
  name: string;
  auto: boolean;
}

/** A single row in the Default Settings Permissions table */
export interface CalibrationSenectoPermission {
  key: string; // "opti" | "gasDetectorHP" | "spp" | "flowlineTemp" | "applyPerms" | "lgs"
  label: string;
  enabled: boolean;
  hydrations: boolean;
  edits: number;
  hasSelectType: boolean;
}

/** A single point on the Perm Permissions chart */
export interface CalibrationChartPoint {
  label: string; // X-axis label
  value: number; // Y-axis value
}

export interface CalibrationTabData {
  onPermissions: string;
  applyType: string;
  weightOnBit: string;
  permissions: CalibrationSensorPermission[];
  defaultPermissions: CalibrationDefaultPermissionItem[];
  senectoPermissions: CalibrationSenectoPermission[];
  sensorPermissionsOk: boolean;
  validateAll: boolean;
  chartData: CalibrationChartPoint[];
}

export interface SaveCalibrationPayload {
  onPermissions: string;
  applyType: string;
  weightOnBit: string;
  permissions: CalibrationSensorPermission[];
  defaultPermissions: CalibrationDefaultPermissionItem[];
  senectoPermissions: CalibrationSenectoPermission[];
  sensorPermissionsOk: boolean;
  validateAll: boolean;
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
  mudOut: string;
  mudIn: string; // was 85.01 in UI
  mudType: string;
  temp: string;
  bbt: string;
}

export interface HydraulicsAnalysis {
  ebtCharts: Record<string, unknown>;
  pressurePlots: Record<string, unknown>;
}

export interface FrictionLossesSummary {
  calculatedBy: string;
  circulatedFlow: string;
  circulatingFlowIn: number;
  circulatingFlowOut: number;
  psValue: string;
  flowValue: string;
  outFlowValue: string;
  temperature: string;
  simplified: string;
  vedPuff: string;
  nippleInnerDiameter: string;
  outerDiameter: string;
  panelCostInfo: string;
  simulated: boolean;
  ssAf: boolean;
  mp73Pf: boolean;
}

export interface SaveHydraulicsPayload {
  modelsUsed: HydraulicModel[];
  parameterLists: HydraulicParameterList[];
  frictionLosses: FrictionLossesSummary;
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
  destinationOptions: Array<{ label: string; value: string }>;
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
  calculatedByOptions: Array<{ label: string; value: string }>;
  circulatedFlowOptions: Array<{ label: string; value: string }>;
  temperatureOptions: Array<{ label: string; value: string }>;
  simplifiedOptions: Array<{ label: string; value: string }>;
  vedPuffOptions: Array<{ label: string; value: string }>;
  outerDiameterOptions: Array<{ label: string; value: string }>;
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
