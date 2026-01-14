/*
  Warnings:

  - You are about to drop the column `expiryAt` on the `UserOTP` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_serviceId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "legalInfoId" TEXT;

-- AlterTable
ALTER TABLE "UserOTP" DROP COLUMN "expiryAt";

-- CreateTable
CREATE TABLE "CompanyLegalInfo" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "tin" TEXT NOT NULL,
    "dateOfIncorporation" TIMESTAMP(3) NOT NULL,
    "structure" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyLegalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyLegalInfo_companyId_key" ON "CompanyLegalInfo"("companyId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_legalInfoId_fkey" FOREIGN KEY ("legalInfoId") REFERENCES "CompanyLegalInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyLegalInfo" ADD CONSTRAINT "CompanyLegalInfo_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
