-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "requiredDocuments" TEXT[];

-- CreateTable
CREATE TABLE "InterestAttachment" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "fileType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "offerInterestId" TEXT NOT NULL,

    CONSTRAINT "InterestAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterestAttachment" ADD CONSTRAINT "InterestAttachment_offerInterestId_fkey" FOREIGN KEY ("offerInterestId") REFERENCES "OfferInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
