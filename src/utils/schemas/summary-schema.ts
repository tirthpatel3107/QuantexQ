import { z } from "zod";

export const summaryFormSchema = z.object({
  mudSystemOverview: z.object({
    mudSystem: z.string().min(1, "Mud system is required"),
    baseFluid: z.string().min(1, "Base fluid is required"),
  }),
  rheology: z.object({
    model: z.string().min(1, "Model is required"),
    pv: z.string().min(1, "PV is required"),
    yp: z.string().min(1, "YP is required"),
    gels: z.string().min(1, "Gels is required"),
    derivedWarning: z.boolean().optional(),
  }),
  densitySolids: z.object({
    mudWeightIn: z.string().min(1, "MW In is required"),
    mudWeightOut: z.string().min(1, "MW Out is required"),
    lgs: z.string().min(1, "LGS is required"),
    hgs: z.string().min(1, "HGS is required"),
    salinity: z.string().min(1, "Salinity is required"),
  }),
  temperature: z.object({
    surfaceTemp: z.string().min(1, "Surface temp is required"),
    bottomholeTemp: z.string().min(1, "Bottomhole temp is required"),
    calculation: z.string().min(1, "Calculation is required"),
    densitometryTemp: z.string().min(1, "Densitometry temp is required"),
  }),
  gasCompressibility: z.object({
    compressibility: z.boolean(),
    gasCut: z.string().optional(),
    compressibilityFactor: z.string().optional(),
    gasStatus: z.enum(["OK", "Warning", "Error"]).optional(),
    gasDetected: z.boolean().optional(),
  }),
  activePitsVolume: z.object({
    volume: z.string().min(1, "Volume is required"),
  }),
  flowlineTemperature: z.object({
    temperature: z.string().min(1, "Temperature is required"),
  }),
  oilWaterRatio: z.object({
    ratio: z.string().min(1, "Ratio is required"),
  }),
});

export type SummaryFormValues = z.infer<typeof summaryFormSchema>;
