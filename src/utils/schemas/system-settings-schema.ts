import { z } from "zod";

export const systemSettingsFormSchema = z.object({
  systemSettings: z.object({
    systemType: z.string().min(1, "System Type is required"),
    mudSystem: z.string().min(1, "Mud System is required"),
    controlMode: z.string().min(1, "Control Mode is required"),
    exportCompatibility: z.string().min(1, "Export Compatibility is required"),
    cursorDataRate: z
      .string()
      .min(1, "Cursor Data Rate is required")
      .regex(/^\d+$/, "Must be a number"),
    displayLanguage: z.string().min(1, "Display Language is required"),
    quickLaunchGUI: z.string().min(1, "Quick Launch GUI is required"),
    autoPresetRestoreTime: z.boolean(),
    restoreAfterHours: z.string(),
    presetToRestore: z.string(),
  }),
  alarmSettings: z.object({
    soundVolume: z.string().min(1, "Sound Volume is required"),
    alertLength: z.string().min(1, "Alert Length is required"),
    surfaceTempOffset: z.string(),
    hpLow: z.string().regex(/^\d*$/, "HP Low must be a number"),
    hpHigh: z.string().regex(/^\d*$/, "HP High must be a number"),
    bitSize: z.string(),
    bitSizeStandard: z.string(),
    bitSizePlus: z.string(),
    emailAlerts: z.string().email("Invalid email format"),
    emailAudity: z.string(),
    realtimeStreamingEnabled: z.boolean(),
    realtimeStreaming: z.string(),
    autoMuteAlarms: z.boolean(),
    captureRecirculation: z.string(),
  }),
  accountSecurity: z.object({
    timeouts: z.string(),
    systemSecurity: z.string(),
    backupDirectory: z.string(),
  }),
  scheduleTime: z.object({
    autoUTCSync: z.boolean(),
    syncTime: z.string(),
    clipTimeMode: z.string(),
    localTime: z.string(),
  }),
});

export type SystemSettingsFormValues = z.infer<typeof systemSettingsFormSchema>;
