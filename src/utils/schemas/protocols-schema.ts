import { z } from "zod";

export const protocolsFormSchema = z.object({
  rigPlc: z.object({
    type: z.enum(["modbus-tcp", "opc-ua", "ethernet-ip"]),
    modbusEndpoints: z.array(z.string()).optional(),
    opcEndpoint: z.string().optional(),
    ethernetEndpoint: z.string().optional(),
  }),
  pwd: z.object({
    type: z.enum(["direct-wits", "witsml-left", "mqtt", "tcp-udp-left", "witsml-right", "tcp-udp-right"]),
    endpoint: z.string().optional(),
  }),
}).superRefine((data, ctx) => {
  if (data.rigPlc.type === "modbus-tcp") {
    if (!data.rigPlc.modbusEndpoints || data.rigPlc.modbusEndpoints.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one Modbus endpoint is required",
        path: ["rigPlc", "modbusEndpoints"],
      });
    } else {
      data.rigPlc.modbusEndpoints.forEach((endpoint, index) => {
        if (!endpoint || endpoint.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Endpoint cannot be empty",
            path: ["rigPlc", "modbusEndpoints", index],
          });
        }
      });
    }
  } else if (data.rigPlc.type === "opc-ua") {
    if (!data.rigPlc.opcEndpoint || data.rigPlc.opcEndpoint.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "OPC-UA endpoint is required",
        path: ["rigPlc", "opcEndpoint"],
      });
    }
  } else if (data.rigPlc.type === "ethernet-ip") {
    if (!data.rigPlc.ethernetEndpoint || data.rigPlc.ethernetEndpoint.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ethernet/IP endpoint is required",
        path: ["rigPlc", "ethernetEndpoint"],
      });
    }
  }
});

export type ProtocolsFormValues = z.infer<typeof protocolsFormSchema>;
