import { z } from "zod";

export const generalSettingsSchema = z.object({
  defaultWellName: z
    .string()
    .min(1, "Well name is required")
    .max(100, "Well name must be less than 100 characters"),
  defaultRigName: z.string().min(1, "Rig name is required"),
  defaultScenario: z.string().min(1, "Scenario is required"),
  startupScreen1: z.string().min(1, "Startup screen is required"),
  startupScreen2: z.string().min(1, "Secondary startup screen is required"),
  safetyConfirmations: z.boolean(),
});

export type GeneralFormData = z.infer<typeof generalSettingsSchema>;
