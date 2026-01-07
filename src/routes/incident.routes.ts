import { Router } from "express";
import {
  createIncident,
  listIncidents,
  getIncident,
  acknowledgeIncident,
  resolveIncident,
} from "../controllers/incidents.controller";
import { createIncidentSchema } from "../validation/incident.validation";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.post("/", validateRequest(createIncidentSchema), createIncident);
router.get("/", listIncidents);
router.get("/:id", getIncident);
router.patch("/:id/acknowledge", acknowledgeIncident);
router.patch("/:id/resolve", resolveIncident);

export default router;
