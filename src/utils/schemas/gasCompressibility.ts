import { z } from "zod";

export const gasCompressibilityFormSchema = z.object({
  enableCompressibility: z.boolean(),
  mudCompressibility: z.string().min(1, "Mud compressibility is required"),
  gasCut: z.string().min(1, "Gas-cut is required"),
  gasDensity: z.string().min(1, "Gas density is required"),
});

export type GasCompressibilityFormValues = z.infer<
  typeof gasCompressibilityFormSchema
>;
