import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import * as IncidentService from "../services/incident.service";
import {
  createIncidentSchema,
  acknowledgeIncidentSchema,
} from "../validation/incident.validation";

export const createIncident = async (req: Request, res: Response) => {
  try {
    const { error, value } = createIncidentSchema.validate(req.body);

    if (error) {
      return res.status(422).json({
        error: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    const incident = await IncidentService.create(value);

    res.status(201).json(incident);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create incident", details: error });
  }
};

export const listIncidents = async (req: Request, res: Response) => {
  try {
    const incidents = await IncidentService.list(req.query);
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: "Failed to get incidents", details: error });
  }
};

export const getIncident = async (req: Request, res: Response) => {
  try {
    const incident = await IncidentService.getById(Number(req.params.id));

    if (!incident) return res.status(404).json({ error: "Incident not found" });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: "Failed to get incident", details: error });
  }
};

export const acknowledgeIncident = async (req: Request, res: Response) => {
  try {
    const { error, value } = acknowledgeIncidentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const incident = await IncidentService.acknowledge(
      Number(req.params.id),
      value.assignee
    );
    res.json(incident);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to acknowledge incident", details: error });
  }
};

export const resolveIncident = async (req: Request, res: Response) => {
  try {
    const incident = await IncidentService.resolve(Number(req.params.id));
    res.json(incident);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to resolve incident", details: error });
  }
};
