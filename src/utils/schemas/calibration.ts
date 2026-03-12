import { z } from "zod";

// Helper function to validate numeric string
const numericString = (min: number, max: number, fieldName: string) =>
  z
    .string()
    .refine((val) => val === "" || !isNaN(Number(val)), {
      message: `${fieldName} must be a valid number`,
    })
    .refine((val) => val === "" || (Number(val) >= min && Number(val) <= max), {
      message: `${fieldName} must be between ${min} and ${max}`,
    });

export const calibrationFormSchema = z.object({
  gasCompressibility: z.object({
    densitySensorOffset: numericString(-1, 1, "Density sensor offset"),
    pvYpCorrectionFactor: numericString(-100, 100, "PV/YP correction factor"),
    temperatureSensorOffset: numericString(-50, 50, "Temperature sensor offset"),
    gasCut: numericString(0, 100, "Gas-cut"),
  }),
  sanityCheck: z.object({
    enabled: z.boolean(),
    lastCheck: z.string().optional(),
    densityMatch: z.boolean().optional(),
    rheologyMatch: z.boolean().optional(),
    temperatureMatch: z.boolean().optional(),
  }),
  validationStatus: z.object({
    annularTemperature: z.string(),
    ecdAtBit: z.string(),
    requiredInputs: z.boolean(),
    densityWithinRange: z.boolean(),
    tempPressureLogic: z.boolean(),
    requiredInputsComplete: z.string(),
  }),
  auditLog: z.array(
    z.object({
      id: z.string(),
      timestamp: z.string(),
      checkType: z.string(),
      matchCount: z.number(),
      details: z.string().optional(),
    })
  ),
});

export type CalibrationFormValues = z.infer<typeof calibrationFormSchema>;
