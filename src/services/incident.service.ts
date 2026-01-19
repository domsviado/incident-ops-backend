import { prisma } from "../prisma/client";

interface CreateIncidentInput {
  serviceKey: string;
  severity: string;
  status?: string;
}

interface ListIncidentsInput {
  filters: Record<string, any>;
  skip: number;
  take: number;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  open: ["acknowledged"],
  acknowledged: ["resolved"],
  resolved: [],
};

function assertTransition(from: string, to: string) {
  const allowed = STATUS_TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    throw new Error(`Invalid status transition: ${from} → ${to}`);
  }
}

export class IncidentService {
  static async create(data: CreateIncidentInput) {
    return prisma.incidents.create({
      data,
    });
  }

  static async getOrCreateOpenCritical(serviceKey: string, severity: string) {
    let incident = await prisma.incidents.findFirst({
      where: {
        serviceKey,
        severity,
        status: "open",
      },
    });

    if (!incident) {
      incident = await prisma.incidents.create({
        data: {
          serviceKey,
          severity,
          status: "open",
        },
      });
    }

    return incident;
  }

  list = async (query: any) => {
    const page = Math.max(Number(query.page ?? 1), 1);
    const pageSize = Math.max(Number(query.pageSize ?? 10), 1);

    const total = await prisma.incidents.count();

    const incidents = await prisma.incidents.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
    return {
      data: incidents,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  };

  static async get(id: number) {
    return prisma.incidents.findUnique({
      where: { id },
      include: { signals: true },
    });
  }

  static async acknowledge(id: number) {
    const incident = await prisma.incidents.findUnique({
      where: { id },
    });

    if (!incident) {
      throw new Error("Incident not found");
    }

    assertTransition(incident.status, "acknowledged");

    return prisma.incidents.update({
      where: { id },
      data: { status: "acknowledged" },
    });
  }

  static async resolve(id: number) {
    const incident = await prisma.incidents.findUnique({
      where: { id },
    });

    if (!incident) {
      throw new Error("Incident not found");
    }

    assertTransition(incident.status, "resolved");

    return prisma.incidents.update({
      where: { id },
      data: { status: "resolved" },
    });
  }
}
