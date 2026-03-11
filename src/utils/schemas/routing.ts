import { z } from "zod";

export const routingFormSchema = z.object({
  rigPlc: z.object({
    enabled: z.boolean(),
    endpoint: z.string().min(1, "Endpoint is required"),
    subnet: z.string().min(1, "Subnet is required"),
    port: z.string().min(1, "Port is required"),
    portConfig: z.string().min(1, "Port config is required"),
  }),
  pwd: z.object({
    protocol: z.string().min(1, "Protocol is required"),
    tag: z.string().min(1, "Tag is required"),
  }),
  outputChannels: z.object({
    enabled: z.boolean(),
    chokeA: z.string().min(1, "Choke A is required"),
    mpdSbp: z.string().min(1, "MPD SBP is required"),
    chokeOutputs: z.string().min(1, "Choke outputs is required"),
    sbInCoop: z.string().min(1, "SB In Coop is required"),
    sbpSsp: z.string().min(1, "SBP SSP is required"),
    sbpSspOutput: z.string().min(1, "SBP SSP output is required"),
  }),
  dualQControl: z.object({
    enabled: z.boolean(),
    mpdQIn: z.string().min(1, "MPD Q In is required"),
    chokeQOut: z.string().min(1, "Choke Q Out is required"),
    flowQIn: z.string().min(1, "Flow Q In is required"),
    mpdQInAlt: z.string().min(1, "MPD Q In Alt is required"),
    flowOutputs: z.string().min(1, "Flow outputs is required"),
    mpdQAux: z.string().min(1, "MPD Q Aux is required"),
    mpdQSet: z.string().min(1, "MPD Q Set is required"),
    mpdQAex: z.string().min(1, "MPD Q Aex is required"),
  }),
});

export const ROUTING_INITIAL_DATA = {
  rigPlc: {
    enabled: true,
    endpoint: "",
    subnet: "",
    port: "",
    portConfig: "",
  },
  pwd: {
    protocol: "",
    tag: "",
  },
  outputChannels: {
    enabled: false,
    chokeA: "",
    mpdSbp: "",
    chokeOutputs: "",
    sbInCoop: "",
    sbpSsp: "",
    sbpSspOutput: "",
  },
  dualQControl: {
    enabled: false,
    mpdQIn: "",
    chokeQOut: "",
    flowQIn: "",
    mpdQInAlt: "",
    flowOutputs: "",
    mpdQAux: "",
    mpdQSet: "",
    mpdQAex: "",
  },
};

export type RoutingFormValues = z.infer<typeof routingFormSchema>;
