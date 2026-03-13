/**
 * Settings Section API Types
 * Types for Settings section tabs
 */

// ============================================
// Settings Section - Complete Data Structure
// ============================================

export interface SettingsData {
  general: GeneralSettingsTabData;
  display: DisplaySettingsTabData;
  notifications: NotificationsSettingsTabData;
}

// ============================================
// General Settings Tab
// ============================================

export interface GeneralSettingsTabData {
  applicationName: string;
  defaultRigName: string;
  defaultScenario: string;
  startupScreen1: string;
  startupScreen2: string;
  safetyConfirmations: boolean;
}

export interface SaveGeneralPayload extends Record<string, unknown> {
  applicationName: string;
  defaultRigName: string;
  defaultScenario: string;
  startupScreen1: string;
  startupScreen2: string;
  safetyConfirmations: boolean;
}

export interface SaveGeneralSettingsPayload {
  applicationName: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  autoSave: boolean;
  autoSaveInterval: number;
}

// ============================================
// Display Settings Tab
// ============================================

export interface DisplaySettingsTabData {
  theme: "light" | "dark" | "auto";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  compactMode: boolean;
  showGridLines: boolean;
  animationsEnabled: boolean;
}

export interface SaveDisplaySettingsPayload {
  theme: "light" | "dark" | "auto";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  compactMode: boolean;
  showGridLines: boolean;
  animationsEnabled: boolean;
}

// ============================================
// Notifications Settings Tab
// ============================================

export interface NotificationsSettingsTabData {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  notificationTypes: NotificationType[];
}

export interface NotificationType {
  id: string;
  name: string;
  enabled: boolean;
  priority: "low" | "medium" | "high";
}

export interface SaveNotificationsSettingsPayload {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  notificationTypes: NotificationType[];
}
