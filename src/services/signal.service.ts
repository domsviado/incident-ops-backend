import { prisma } from "../prisma/client";

interface CreateSignalInput {
  source: string;
  serviceKey: string;
  type: string;
  severity: "info" | "warning" | "critical";
  metricValue?: number;
  threshold?: number;
  reason?: string;
  region?: string;
  alarmName?: string;
  window?: string;
}

export const create = async (data: CreateSignalInput) => {
  return prisma.signals.create({ data });
};

export const list = async (query: any) => {
  const page = Math.max(Number(query.page ?? 1), 1);
  const pageSize = Math.max(Number(query.pageSize ?? 10), 1);

  const total = await prisma.signals.count();

  const signals = await prisma.signals.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  return {
    data: signals,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const getById = async (id: number) => {
  return prisma.signals.findUnique({
    where: { id },
    include: { incident: true },
  });
};
