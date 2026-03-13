import { z } from "zod";

export const securityFormSchema = z.object({
  rigPlc: z.object({
    enabled: z.boolean(),
    endpoint: z.string().min(1, "Endpoint is required"),
    subnet: z.string().min(1, "Subnet is required"),
    port: z.string().min(1, "Port is required"),
    portConfig: z.string().min(1, "Port config is required"),
  }),
  authentication: z
    .object({
      method: z.enum(["none", "user-pass", "certificate"]),
      username: z.string().optional(),
      password: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.method === "user-pass") {
          return (
            data.username &&
            data.username.length > 0 &&
            data.password &&
            data.password.length > 0
          );
        }
        return true;
      },
      {
        message:
          "Username and password are required when User/Pass is selected",
        path: ["username"],
      },
    ),
  pwd: z
    .object({
      authMethod: z.enum(["none", "user-pass", "certificate"]),
      username: z.string().optional(),
      password: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.authMethod === "user-pass") {
          return (
            data.username &&
            data.username.length > 0 &&
            data.password &&
            data.password.length > 0
          );
        }
        return true;
      },
      {
        message:
          "Username and password are required when User/Pass is selected",
        path: ["username"],
      },
    ),
});

export type SecurityFormValues = z.infer<typeof securityFormSchema>;
