/*
  Warnings:

  - You are about to drop the column `value` on the `signals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "signals" DROP COLUMN "value",
ADD COLUMN     "metricValue" DOUBLE PRECISION,
ADD COLUMN     "threshold" DOUBLE PRECISION;
