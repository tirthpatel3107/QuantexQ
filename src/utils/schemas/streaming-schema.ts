import { z } from "zod";

const REQUIRED_MESSAGE = "This field is required";

export const streamingFormSchema = z.object({
  streaming: z.object({
    enabled: z.boolean().default(true),
    realTimeLevel: z.string().min(1, "Real-time level is required"),
    destination: z.string().min(1, "Streaming destination is required"),
  }),
  loggingStatus: z.object({
    enabled: z.boolean().default(true),
    frequency: z.string().optional().or(z.literal("")),
    autoCache: z.boolean().default(false),
    startLoggingUponSystemReady: z.boolean().default(false),
    appendOnLogStop: z.boolean().default(false),
  }),
  loggingDestinations: z.object({
    exportLogFiles: z.object({
      destinationLogsTo: z.string().optional().or(z.literal("")),
      anotherDirectory: z.string().optional().or(z.literal("")),
      diskCacheDirectory: z.string().optional().or(z.literal("")),
    }),
    network: z.object({
      networkLocation: z.string().optional().or(z.literal("")),
      directory: z.string().optional().or(z.literal("")),
    }),
  }),
  ftpServer: z.object({
    ftpUrl1: z
      .string()
      .min(1, "FTP URL 1 is required")
      .regex(
        /^(?:[a-zA-Z0-9]+:\/\/)?(?:[a-zA-Z0-9.-]+)(?::[0-9]+)?(?:\/.*)?$/,
        "Invalid URL format (e.g., tcp://192.168.1.100:5000)",
      ),
    ftpUrl2: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) =>
          !val ||
          /^(?:[a-zA-Z0-9]+:\/\/)?(?:[a-zA-Z0-9.-]+)(?::[0-9]+)?(?:\/.*)?$/.test(
            val,
          ),
        {
          message: "Invalid URL format",
        },
      ),
    ftpPas: z.string().min(1, "FTP Password is required"),
  }),
});




export type StreamingFormValues = z.infer<typeof streamingFormSchema>;

