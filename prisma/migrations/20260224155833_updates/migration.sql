/*
  Warnings:

  - You are about to alter the column `budgetMin` on the `OfferPricing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to alter the column `budgetMax` on the `OfferPricing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "OfferPricing" ALTER COLUMN "budgetMin" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "budgetMax" SET DATA TYPE DOUBLE PRECISION;
