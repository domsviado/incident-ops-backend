import { Router } from "express";
import {
  createSignal,
  getSignals,
  getSignalById,
  updateSignal,
  deleteSignal,
} from "../controllers/signal.controller";

const router = Router();

router.post("/", createSignal);
router.get("/", getSignals);
router.get("/:id", getSignalById);
router.put("/:id", updateSignal);
router.delete("/:id", deleteSignal);

export default router;
