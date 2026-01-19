import { Request, Response } from "express";
import * as SignalService from "../services/signal.service";
import { SignalProcessor } from "../services/signal-processor";
import { createSignalSchema } from "../validation/signal.validation";

export const createSignal = async (req: Request, res: Response) => {
  try {
    const { error, value } = createSignalSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        error: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }
    const signal = await SignalService.create(value);

    await SignalProcessor.process(signal.id);

    res.status(201).json(signal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create signal" });
  }
};

export const listSignals = async (req: Request, res: Response) => {
  try {
    const signals = await SignalService.list(req.query);
    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: "Failed to get signal", details: error });
  }
};

export const getSignal = async (req: Request, res: Response) => {
  try {
    const signal = await SignalService.getById(Number(req.params.id));

    if (!signal) return res.status(404).json({ error: "Signal not found" });

    res.json(signal);
  } catch (error) {
    res.status(500).json({ error: "Failed to get signal", details: error });
  }
};
