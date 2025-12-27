import { PrismaClient, Prisma } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

const signalsData: Prisma.signalsCreateInput[] = [
  {
    source: "AWS CloudWatch",
    serviceKey: "service-123",
    type: "CPUUsageHigh",
    severity: "critical",
    value: 95,
    window: "5m",
  },
  {
    source: "Datadog",
    serviceKey: "service-456",
    type: "MemoryUsageHigh",
    severity: "warning",
    value: 80,
    window: "10m",
  },
  {
    source: "Prometheus",
    serviceKey: "service-123",
    type: "DiskSpaceLow",
    severity: "critical",
    value: 10,
    window: "15m",
  },
];

const incidentsData: Prisma.incidentsCreateInput[] = [
  {
    serviceKey: "service-123",
    severity: "critical",
    status: "open",
  },
  {
    serviceKey: "service-456",
    severity: "warning",
    status: "resolved",
  },
];

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data
  await prisma.signals.deleteMany();
  await prisma.incidents.deleteMany();

  // Create incidents
  const incidents = [];
  for (const i of incidentsData) {
    const incident = await prisma.incidents.create({ data: i });
    incidents.push(incident);
    console.log(`Created incident with id: ${incident.id}`);
  }

  // Create signals and attach to incidents if desired
  for (const signal of signalsData) {
    const incidentId =
      signal.serviceKey === "service-123"
        ? incidents.find((i) => i.serviceKey === "service-123")?.id
        : incidents.find((i) => i.serviceKey === "service-456")?.id;

    await prisma.signals.create({ data: signal });
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
