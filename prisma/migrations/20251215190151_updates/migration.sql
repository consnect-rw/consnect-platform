/*
  Warnings:

  - Added the required column `offerId` to the `OfferInterest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OfferInterest" ADD COLUMN     "offerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OfferInterest" ADD CONSTRAINT "OfferInterest_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
