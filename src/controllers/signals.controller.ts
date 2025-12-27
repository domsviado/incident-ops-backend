import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const createSignal = async (req: Request, res: Response) => {
  const { source, serviceKey, type, severity, value, window } = req.body;
  try {
    const signal = await prisma.signals.create({
      data: { source, serviceKey, type, severity, value, window },
    });

    // Optional: auto-create incident if critical
    if (severity === "critical") {
      await prisma.incidents.create({
        data: { serviceKey, severity, status: "open" },
      });
      console.log("incident created automatically due to critical severity");
    }

    res.status(201).json(signal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create signal" });
  }
};

export const getSignals = async (req: Request, res: Response) => {
  try {
    const signals = await prisma.signals.findMany();
    res.json(signals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch signals" });
  }
};

export const getSignalById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const signal = await prisma.signals.findUnique({
      where: { id: Number(id) },
    });
    if (!signal) return res.status(404).json({ error: "Signal not found" });
    res.json(signal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch signal" });
  }
};

export const updateSignal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated = await prisma.signals.update({
      where: { id: Number(id) },
      data,
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update signal" });
  }
};

export const deleteSignal = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.signals.delete({
      where: { id: Number(id) },
    });
    res.json(deleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete signal" });
  }
};
