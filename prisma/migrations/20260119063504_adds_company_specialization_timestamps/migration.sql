/*
  Warnings:

  - Added the required column `updatedAt` to the `CompanySpecialization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanySpecialization" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
