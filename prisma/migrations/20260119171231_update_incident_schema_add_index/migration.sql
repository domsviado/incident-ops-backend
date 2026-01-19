/*
  Warnings:

  - The `status` column on the `incidents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('open', 'acknowledged', 'resolved');

-- AlterTable
ALTER TABLE "incidents" ADD COLUMN     "acknowledgedBy" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "IncidentStatus" NOT NULL DEFAULT 'open';

-- CreateIndex
CREATE INDEX "incidents_status_idx" ON "incidents"("status");

-- CreateIndex
CREATE INDEX "incidents_severity_idx" ON "incidents"("severity");

-- CreateIndex
CREATE INDEX "incidents_serviceKey_idx" ON "incidents"("serviceKey");

-- CreateIndex
CREATE INDEX "incidents_createdAt_idx" ON "incidents"("createdAt");
