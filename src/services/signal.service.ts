import { prisma } from "../prisma/client";

interface CreateSignalInput {
  source: string;
  serviceKey: string;
  type: string;
  severity: "info" | "warning" | "critical";
  value?: number;
  window?: string;
}

export const create = async (data: CreateSignalInput) => {
  return prisma.signals.create({ data });
};

export const list = async (query: any) => {
  const page = Math.max(Number(query.page ?? 1), 1);
  const pageSize = Math.max(Number(query.pageSize ?? 10), 1);

  return prisma.signals.findMany({
    include: { incident: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
};

export const getById = async (id: number) => {
  return prisma.signals.findUnique({
    where: { id },
    include: { incident: true },
  });
};
