import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { IncidentService } from "../services/incident.service";

export const createIncident = async (req: Request, res: Response) => {
  try {
    const { serviceKey, severity, status } = req.body;

    const incident = await IncidentService.create({
      serviceKey,
      severity,
      status,
    });

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
    const {
      page = "1",
      pageSize = "10",
      severity,
      status,
      serviceKey,
    } = req.query;

    const pageNum = Math.max(Number(page), 1);
    const limit = Math.max(Number(pageSize), 1);
    const skip = (pageNum - 1) * limit;

    const filters: any = {};
    if (severity) filters.severity = severity;
    if (status) filters.status = status;
    if (serviceKey) filters.serviceKey = serviceKey;

    const [incidents, total] = await Promise.all([
      prisma.incidents.findMany({
        where: filters,
        include: { signals: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.incidents.count({ where: filters }),
    ]);

    res.json({
      data: incidents,
      pagination: {
        total,
        page: pageNum,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch incidents", details: error });
  }
};

export const getIncident = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const incident = await prisma.incidents.findUnique({
      where: { id: Number(id) },
      include: { signals: true },
    });

    if (!incident) return res.status(404).json({ error: "Incident not found" });
    res.json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch incident", details: error });
  }
};

export const acknowledgeIncident = async (req: Request, res: Response) => {
  try {
    const incident = await IncidentService.acknowledge(Number(req.params.id));
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
