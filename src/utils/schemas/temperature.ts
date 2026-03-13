import { z } from "zod";

export const temperatureFormSchema = z.object({
  surfaceTemp: z.string().min(1, "Surface temperature is required"),
  bottomholeTemp: z.string().min(1, "Bottomhole temperature is required"),
  tempGradient: z.string().min(1, "Temperature gradient is required"),
  densitometryTempSett: z
    .string()
    .min(1, "Densitometry temperature is required"),
  applyTempCorrection: z.boolean(),
  viscosityModel: z.string().min(1, "Viscosity model is required"),
});

export type TemperatureFormValues = z.infer<typeof temperatureFormSchema>;
