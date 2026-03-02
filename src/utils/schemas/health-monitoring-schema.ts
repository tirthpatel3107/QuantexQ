import { z } from "zod";

export const healthMonitoringFormSchema = z.object({
  thresholds: z.object({
    cpuWarning: z.number().min(0).max(100),
    cpuCritical: z.number().min(0).max(100),
    memoryWarning: z.number().min(0).max(100),
    memoryCritical: z.number().min(0).max(100),
  }),
  alerts: z.object({
    emailEnabled: z.boolean(),
    smsEnabled: z.boolean(),
    webhookEnabled: z.boolean(),
  }),
});

export const HEALTH_INITIAL_DATA = {
  thresholds: {
    cpuWarning: 70,
    cpuCritical: 90,
    memoryWarning: 80,
    memoryCritical: 95,
  },
  alerts: {
    emailEnabled: true,
    smsEnabled: false,
    webhookEnabled: false,
  },
};

export type HealthMonitoringFormValues = z.infer<
  typeof healthMonitoringFormSchema
>;
