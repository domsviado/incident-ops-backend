import Joi from "joi";

export const createIncidentSchema = Joi.object({
  serviceKey: Joi.string().required(),
  severity: Joi.string().valid("critical", "warning", "info").required(),
  status: Joi.string().valid("open", "resolved").required(),
});
