import Joi from "joi";

export const createSignalSchema = Joi.object({
  source: Joi.string().required(),
  serviceKey: Joi.string().required(),
  type: Joi.string().required(),
  severity: Joi.string().valid("critical", "warning", "info").required(),
  threshold: Joi.number().optional(),
  metricValue: Joi.number().optional(),
  reason: Joi.string().optional(),
  alarmName: Joi.string().optional(),
  window: Joi.string().optional(),
  timestamp: Joi.date().optional(),
});
