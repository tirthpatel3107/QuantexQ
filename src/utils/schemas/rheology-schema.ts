import { z } from "zod";

export const rheologyFormSchema = z.object({
  rheologyModel: z.object({
    model: z.string().min(1, "Rheology model is required"),
    formula: z.string(),
  }),
  pv: z.object({
    value: z.string().min(1, "PV value is required"),
    unit: z.string(),
  }),
  yp: z.object({
    value: z.string().min(1, "YP value is required"),
    unit: z.string(),
  }),
  deriveFromViscometer: z.boolean(),
  calibration: z.object({
    viscosityVsShearRate: z.array(
      z.object({
        shearRate: z.number(),
        viscosity: z.number(),
      }),
    ),
  }),
  temperature: z.object({
    shearStressVsShearRate: z.array(
      z.object({
        shearRate: z.number(),
        shearStress: z.number(),
      }),
    ),
  }),
  rheologyOutputs: z.object({
    flowlineTemperature: z.object({
      value: z.string(),
      unit: z.string(),
    }),
    annularVelocity: z.object({
      value: z.string(),
      unit: z.string(),
    }),
    shearRate: z.object({
      value: z.string(),
      unit: z.string(),
    }),
    pvOutput: z.object({
      value: z.string(),
      unit: z.string(),
      status: z.enum(["OK", "Warning", "Error"]),
    }),
    ypOutput: z.object({
      value: z.string(),
      unit: z.string(),
      status: z.enum(["OK", "Warning", "Error"]),
    }),
    gel10s: z.object({
      value: z.string(),
      unit: z.string(),
      status: z.enum(["OK", "Warning", "Error"]),
    }),
    gel10m: z.object({
      value: z.string(),
      unit: z.string(),
      status: z.enum(["OK", "Warning", "Error"]),
    }),
  }),
  pressureDrop: z.object({
    psl: z.object({
      value: z.string(),
      unit: z.string(),
    }),
    flow: z.object({
      value: z.string(),
      unit: z.string(),
    }),
    drillpipe: z.object({
      value: z.string(),
      unit: z.string(),
    }),
    bit: z.object({
      value: z.string(),
      unit: z.string(),
    }),
  }),
});

export type RheologyFormValues = z.infer<typeof rheologyFormSchema>;
