-- AlterTable
ALTER TABLE "CompanyVerification" ADD COLUMN     "isBronzeVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isGoldVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSilverVerified" BOOLEAN NOT NULL DEFAULT false;
