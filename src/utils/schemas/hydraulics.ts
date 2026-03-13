import { z } from "zod";

export const hydraulicModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["mw-rheological", "friction-loss", "standing-pressure"]),
  active: z.boolean(),
});

export const hydraulicParameterListSchema = z.object({
  id: z.string(),
  name: z.string(),
  mudOut: z.string(),
  mudIn: z.string(),
  mudType: z.string(),
  temp: z.string(),
  bbt: z.string(),
});

export const frictionLossesSummarySchema = z.object({
  calculatedBy: z.string(),
  circulatedFlow: z.string(),
  circulatingFlowIn: z.number(),
  circulatingFlowOut: z.number(),
  psValue: z.string(),
  flowValue: z.string(),
  outFlowValue: z.string(),
  temperature: z.string(),
  simplified: z.string(),
  vedPuff: z.string(),
  nippleInnerDiameter: z.string(),
  outerDiameter: z.string(),
  panelCostInfo: z.string(),
  simulated: z.boolean(),
  ssAf: z.boolean(),
  mp73Pf: z.boolean(),
});

export const hydraulicsFormSchema = z.object({
  modelsUsed: z.array(hydraulicModelSchema),
  parameterLists: z.array(hydraulicParameterListSchema),
  frictionLosses: frictionLossesSummarySchema,
  parameterListSelection: z.string().optional(),
  applyParameter: z.string().optional(),
  applyBatch: z.string().optional(),
});

export type HydraulicsFormValues = z.infer<typeof hydraulicsFormSchema>;
export type HydraulicsParameterItem = z.infer<
  typeof hydraulicParameterListSchema
>;
