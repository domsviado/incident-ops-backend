import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// Create incident manually (optional, usually auto-created)
export const createIncident = async (req: Request, res: Response) => {
  const { serviceKey, severity, status = "open", description } = req.body;
  try {
    const incident = await prisma.incidents.create({
      data: { serviceKey, severity, status, description },
    });
    res.status(201).json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create incident" });
  }
};

export const getIncidents = async (req: Request, res: Response) => {
  const { status } = req.query;
  try {
    const incidents = await prisma.incidents.findMany({
      where: status ? { status: String(status) } : {},
      include: { signals: true },
    });
    res.json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
};

export const getIncidentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const incident = await prisma.incidents.findUnique({
      where: { id: Number(id) },
      include: { signals: true },
    });
    if (!incident) return res.status(404).json({ error: "Incident not found" });
    res.json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch incident" });
  }
};

export const updateIncident = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated = await prisma.incidents.update({
      where: { id: Number(id) },
      data,
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update incident" });
  }
};

export const deleteIncident = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.incidents.delete({
      where: { id: Number(id) },
    });
    res.json(deleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete incident" });
  }
};
