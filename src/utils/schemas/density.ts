import { z } from "zod";

export const densityFormSchema = z.object({
  mudWeight: z.object({
    mwIn: z.string().min(1, "MW In is required"),
    mwOut: z.string().min(1, "MW Out is required"),
    useMwInOnly: z.boolean(),
  }),
  solids: z.object({
    lgs: z.string().min(1, "LGS is required"),
    hgs: z.string().min(1, "HGS is required"),
  }),
  oilWaterRatio: z.string().min(1, "Oil/Water ratio is required"),
  salinity: z.string().min(1, "Salinity is required"),
});

export type DensityFormValues = z.infer<typeof densityFormSchema>;
