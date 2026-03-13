import { z } from "zod";

export const sensorLimitSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Sensor name is required"),
  lowLimit: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Low limit must be a valid non-negative number"
  ),
  highLimit: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "High limit must be a valid non-negative number"
  ),
  unit: z.string().min(1, "Unit is required"),
});

export const alarmsFormSchema = z.object({
  sensors: z.array(sensorLimitSchema),
  dynamicLimitsEnabled: z.boolean(),
  kickLimit: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Kick limit must be a valid positive number"
  ),
  lossLimit: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Loss limit must be a valid positive number"
  ),
  pitGainLimit: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Pit gain limit must be a valid positive number"
  ),
  sppHighLimit: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "SPP high limit must be a valid positive number"
  ),
  pppHighLimit: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "PPP high limit must be a valid positive number"
  ),
  pitVolumeHighLimit: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Pit volume high limit must be a valid positive number"
  ),
  pitVolumeHighLimitBbl: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Pit volume high limit (bbl) must be a valid positive number"
  ),
  logicActivateWhenGainsStop: z.boolean(),
  logicActivateStickyAlarms: z.boolean(),
  logicActivateSecondaryAlarms: z.boolean(),
  logicDelay: z.string().min(1, "Delay is required"),
  logicMonitorDuration: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Monitor duration must be a valid positive number"
  ),
  notifyOfflineAlarm: z.boolean(),
  notifyOnlineAlarm: z.boolean(),
  kickDelay: z.string().min(1, "Kick delay is required"),
  lossDelay: z.string().min(1, "Loss delay is required"),
  offlineOutput: z.string().min(1, "Offline output is required"),
  onlineOutput: z.string().min(1, "Online output is required"),
});

export type AlarmsFormValues = z.infer<typeof alarmsFormSchema>;
export type SaveAlarmsPayload = AlarmsFormValues;
