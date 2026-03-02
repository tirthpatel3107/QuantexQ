import { z } from "zod";

export const diagnosticsFormSchema = z.object({
  packetCapture: z.object({
    enabled: z.boolean(),
    duration: z.string().min(1, "Duration is required"),
  }),
  jitterAnalysis: z.object({
    showMask: z.boolean().default(false),
  }),
});

export const MOCK_CHART_DATA = {
  latency: Array.from({ length: 20 }, (_, i) => ({
    time: i.toString(),
    value: Math.floor(Math.random() * 400) + 100,
  })),
  dropRate: Array.from({ length: 20 }, (_, i) => ({
    time: i.toString(),
    value: Math.random() * 2,
  })),
  messages: Array.from({ length: 20 }, (_, i) => ({
    time: i.toString(),
    value: Math.floor(Math.random() * 50) + 100,
  })),
};

export type DiagnosticsFormValues = z.infer<typeof diagnosticsFormSchema>;
