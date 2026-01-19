import Joi from "joi";

export const createIncidentSchema = Joi.object({
  serviceKey: Joi.string().required(),
  severity: Joi.string().valid("critical", "warning", "info").required(),
  status: Joi.string().valid("open", "resolved").required(),
  acknowledgedBy: Joi.string().optional(),
  acknowledgedAt: Joi.date().optional(),
  resolvedAt: Joi.date().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
});

export const acknowledgeIncidentSchema = Joi.object({
  assignee: Joi.string().required(),
});
