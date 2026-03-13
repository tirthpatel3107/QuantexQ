import { z } from "zod";

export const displaySectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  enabled: z.boolean(),
  type: z.string().optional(),
});

export const displayFormSchema = z.object({
  sections: z.array(displaySectionSchema),
  // Add other settings if needed, for now we follow the DisplayTabData structure
});

export type DisplayFormValues = z.infer<typeof displayFormSchema>;
