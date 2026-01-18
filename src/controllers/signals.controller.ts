import { Request, Response } from "express";
import * as SignalService from "../services/signal.service";
import { SignalProcessor } from "../services/signal-processor";

export const createSignal = async (req: Request, res: Response) => {
  try {
    const signal = await SignalService.create(req.body);

    await SignalProcessor.process(signal.id);

    res.status(201).json(signal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create signal" });
  }
};

export const listSignals = async (req: Request, res: Response) => {
  const signals = await SignalService.list(req.query);
  console.log("signals", signals);
  res.json(signals);
};

export const getSignal = async (req: Request, res: Response) => {
  const signal = await SignalService.getById(Number(req.params.id));

  if (!signal) return res.status(404).json({ error: "Signal not found" });

  res.json(signal);
};
