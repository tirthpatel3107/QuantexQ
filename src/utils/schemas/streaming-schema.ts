import { z } from "zod";

export const streamingFormSchema = z.object({
  streaming: z.object({
    enabled: z.boolean(),
    realTimeLevel: z.string(),
    destination: z.string(),
  }),
  loggingStatus: z.object({
    enabled: z.boolean(),
    frequency: z.string(),
    autoCache: z.boolean(),
    startLoggingUponSystemReady: z.boolean(),
    appendOnLogStop: z.boolean(),
  }),
  loggingDestinations: z.object({
    exportLogFiles: z.object({
      destinationLogsTo: z.string(),
      anotherDirectory: z.string(),
      diskCacheDirectory: z.string(),
    }),
    network: z.object({
      networkLocation: z.string(),
      directory: z.string(),
    }),
  }),
  ftpServer: z.object({
    ftpUrl1: z.string(),
    ftpUrl2: z.string(),
    ftpPas: z.string(),
  }),
});


export type StreamingFormValues = z.infer<typeof streamingFormSchema>;

