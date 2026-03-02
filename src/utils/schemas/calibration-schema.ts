import { z } from "zod";

export const calibrationFormSchema = z.object({
  onPermissions: z.string().min(1, "Permission type is required"),
  applyType: z.enum(["auto", "manual", "acmPerms"]),
  weightOnBit: z.enum(["auto", "manual", "own"]),
  permissions: z.array(
    z.object({
      sensor: z.string(),
      depth: z.boolean(),
      primary: z.boolean(),
      secondary: z.boolean(),
      validation: z.string(),
      comments: z.string(),
    }),
  ),
  defaultPermissions: z.array(
    z.object({
      name: z.string(),
      auto: z.boolean(),
    }),
  ),
  senectoPermissions: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      enabled: z.boolean(),
      hydrations: z.boolean(),
      edits: z.coerce.number().min(0, "Must be at least 0").max(1, "Must be at most 1"),
      hasSelectType: z.boolean(),
    }),
  ).refine((items) => items.every((item) => item.edits !== null && item.edits !== undefined), {
    message: "All edits fields are required",
  }),
  sensorPermissionsOk: z.boolean(),
  validateAll: z.boolean(),
});

export type CalibrationFormValues = z.infer<typeof calibrationFormSchema>;
