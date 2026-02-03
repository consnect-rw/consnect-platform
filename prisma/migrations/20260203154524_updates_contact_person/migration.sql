/*
  Warnings:

  - You are about to drop the column `licenseNumber` on the `ContactPerson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContactPerson" DROP COLUMN "licenseNumber",
ADD COLUMN     "regNumber" TEXT;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "contactPersonId" TEXT;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "ContactPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
