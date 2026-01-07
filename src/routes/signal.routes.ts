import { Router } from "express";
import {
  createSignal,
  listSignals,
  getSignal,
} from "../controllers/signals.controller";
import { createSignalSchema } from "../validation/signal.validation";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.post("/", validateRequest(createSignalSchema), createSignal);
router.get("/", listSignals);
router.get("/:id", getSignal);

export default router;
