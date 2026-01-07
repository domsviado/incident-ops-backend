import { prisma } from "../prisma/client";
import { IncidentService } from "./incident.service";

export class SignalProcessor {
  static async process(signalId: number) {
    const signal = await prisma.signals.findUnique({
      where: { id: signalId },
    });

    if (!signal) return;

    // Only process critical signals
    if (signal.severity !== "critical") return;

    const incident = await IncidentService.getOrCreateOpenCritical(
      signal.serviceKey,
      signal.severity
    );

    // Associate signal to the incident if not already linked
    if (!signal.incidentId) {
      await prisma.signals.update({
        where: { id: signal.id },
        data: { incident: { connect: { id: incident.id } } },
      });
    }
  }
}
