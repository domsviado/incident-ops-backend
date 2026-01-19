import { prisma } from "../prisma/client";

interface CreateIncidentInput {
  serviceKey: string;
  severity: string;
  status?: string;
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

export const list = async (query: any) => {
  const page = Math.max(Number(query.page ?? 1), 1);
  const pageSize = Math.max(Number(query.pageSize ?? 10), 1);
  const where: any = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.severity) {
    where.severity = query.severity;
  }

  if (query.serviceKey) {
    where.serviceKey = query.serviceKey;
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) where.createdAt.gte = new Date(query.from);
    if (query.to) where.createdAt.lte = new Date(query.to);
  }

  const total = await prisma.incidents.count({ where });

  const incidents = await prisma.incidents.findMany({
    where,
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

export const create = async (data: CreateIncidentInput) => {
  return prisma.incidents.create({ data });
};

export const getOrCreateOpenCritical = async (
  serviceKey: string,
  severity: string
) => {
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
};

export const resolve = async (id: number) => {
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
};

export const getById = async (id: number) => {
  return prisma.incidents.findUnique({
    where: { id },
    include: { signals: true },
  });
};

export const acknowledge = async (id: number) => {
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
};
