import { z } from "zod";

export const sourcesFormSchema = z.object({
  rigPlc: z.object({
    enabled: z.boolean(),
    connectionStatus: z.enum(["Primary", "Connected", "Disconnected"]),
    sourceType: z.string(),
    endpoint: z.string(),
    port: z.string(),
    tagMap: z.string(),
    dataRate: z.string(),
  }),
  pwdWits: z.object({
    enabled: z.boolean(),
    endpoint: z.string(),
    port: z.string(),
    dataRate: z.string(),
    frequency: z.string(),
    tagMap: z.string(),
  }),
  devices: z.object({
    enabled: z.boolean(),
    items: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        tags: z.string(),
        healthStatus: z.enum(["OK", "Warning", "Error"]),
        healthCount: z.string(),
      })
    ),
  }),
});

export type SourcesFormValues = z.infer<typeof sourcesFormSchema>;
