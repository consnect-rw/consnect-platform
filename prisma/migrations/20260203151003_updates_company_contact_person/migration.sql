-- AlterTable
ALTER TABLE "ContactPerson" ADD COLUMN     "experienceYears" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "expertiseAreas" TEXT[],
ADD COLUMN     "isLicenseVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "licenseNumber" TEXT;
