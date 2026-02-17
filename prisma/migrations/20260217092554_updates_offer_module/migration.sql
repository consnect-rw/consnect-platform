/*
  Warnings:

  - A unique constraint covering the columns `[offerId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,offerId]` on the table `OfferInterest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contractType` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('WORK_TASK', 'MATERIAL_SUPPLY', 'EQUIPMENT_RENTAL', 'CONSULTANCY', 'SUBCONTRACTING', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "EOfferPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "EOfferStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OfferVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "EOFferContractType" AS ENUM ('FIXED_PRICE', 'TIME_AND_MATERIALS', 'COST_PLUS', 'UNIT_PRICING', 'PERFORMANCE_BASED');

-- CreateEnum
CREATE TYPE "EOfferExecutionStatus" AS ENUM ('NONE', 'NEGOTIATING', 'AWARDED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EDurationUnit" AS ENUM ('HOURS', 'DAYS', 'WEEKS', 'MONTHS', 'YEARS');

-- CreateEnum
CREATE TYPE "EOfferDocumentType" AS ENUM ('DRAWING_AUTOCAD', 'DRAWING_ARCHICAD', 'BOQ', 'SPECIFICATION', 'SITE_PHOTO', 'SITE_VIDEO', 'CONTRACT_DRAFT', 'PERMIT', 'CERTIFICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "EOfferDocumentAccessLevel" AS ENUM ('PUBLIC', 'INTERESTED_ONLY', 'SHORTLISTED_ONLY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "EOfferInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_companyId_fkey";

-- DropForeignKey
ALTER TABLE "OfferInterest" DROP CONSTRAINT "OfferInterest_companyId_fkey";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "offerId" TEXT,
ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "contractType" "EOFferContractType" NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deliverables" TEXT[],
ADD COLUMN     "executionStatus" "EOfferExecutionStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "priority" "EOfferPriority" NOT NULL,
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "qualityStandards" TEXT,
ADD COLUMN     "requiredCertifications" TEXT[],
ADD COLUMN     "requiredSkills" TEXT[],
ADD COLUMN     "safetyRequirements" TEXT,
ADD COLUMN     "scopeOfWork" TEXT,
ADD COLUMN     "specificTasks" TEXT[],
ADD COLUMN     "status" "EOfferStatus" NOT NULL,
ADD COLUMN     "technicalSpecifications" TEXT,
ADD COLUMN     "type" "OfferType" NOT NULL,
ADD COLUMN     "visibility" "OfferVisibility" NOT NULL,
ALTER COLUMN "companyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OfferInterest" ADD COLUMN     "respondedAt" TIMESTAMP(3),
ADD COLUMN     "shortlistedAt" TIMESTAMP(3),
ADD COLUMN     "viewedByOwner" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "companyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "companyId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OfferTimeLine" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "duration" INTEGER,
    "durationUnit" "EDurationUnit",
    "offerId" TEXT NOT NULL,

    CONSTRAINT "OfferTimeLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferPricing" (
    "id" TEXT NOT NULL,
    "budgetMin" DECIMAL(15,2),
    "budgetMax" DECIMAL(15,2),
    "currency" TEXT,
    "paymentTerms" TEXT,
    "paymentMethods" TEXT[],
    "offerId" TEXT NOT NULL,

    CONSTRAINT "OfferPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferDocument" (
    "id" TEXT NOT NULL,
    "type" "EOfferDocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "accessLevel" "EOfferDocumentAccessLevel" NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "offerId" TEXT NOT NULL,

    CONSTRAINT "OfferDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferSubmissionInfo" (
    "id" TEXT NOT NULL,
    "proposalFormat" TEXT,
    "submissionGuidelines" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "expiresAt" TIMESTAMP(3),
    "autoClose" BOOLEAN NOT NULL DEFAULT true,
    "offerId" TEXT NOT NULL,

    CONSTRAINT "OfferSubmissionInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferInvitation" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "reply" TEXT,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "respondedAt" TIMESTAMP(3),
    "status" "EOfferInvitationStatus" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,

    CONSTRAINT "OfferInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfferTimeLine_offerId_key" ON "OfferTimeLine"("offerId");

-- CreateIndex
CREATE UNIQUE INDEX "OfferPricing_offerId_key" ON "OfferPricing"("offerId");

-- CreateIndex
CREATE INDEX "OfferDocument_offerId_accessLevel_idx" ON "OfferDocument"("offerId", "accessLevel");

-- CreateIndex
CREATE UNIQUE INDEX "OfferSubmissionInfo_offerId_key" ON "OfferSubmissionInfo"("offerId");

-- CreateIndex
CREATE INDEX "OfferInvitation_offerId_idx" ON "OfferInvitation"("offerId");

-- CreateIndex
CREATE INDEX "OfferInvitation_companyId_idx" ON "OfferInvitation"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "OfferInvitation_offerId_companyId_key" ON "OfferInvitation"("offerId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_offerId_key" ON "Location"("offerId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_projectId_key" ON "Location"("projectId");

-- CreateIndex
CREATE INDEX "Offer_type_idx" ON "Offer"("type");

-- CreateIndex
CREATE INDEX "Offer_status_idx" ON "Offer"("status");

-- CreateIndex
CREATE INDEX "Offer_priority_idx" ON "Offer"("priority");

-- CreateIndex
CREATE INDEX "Offer_categoryId_idx" ON "Offer"("categoryId");

-- CreateIndex
CREATE INDEX "Offer_createdAt_idx" ON "Offer"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OfferInterest_companyId_offerId_key" ON "OfferInterest"("companyId", "offerId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferTimeLine" ADD CONSTRAINT "OfferTimeLine_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferPricing" ADD CONSTRAINT "OfferPricing_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferDocument" ADD CONSTRAINT "OfferDocument_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferSubmissionInfo" ADD CONSTRAINT "OfferSubmissionInfo_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferInterest" ADD CONSTRAINT "OfferInterest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferInvitation" ADD CONSTRAINT "OfferInvitation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferInvitation" ADD CONSTRAINT "OfferInvitation_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
