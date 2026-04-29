-- CreateEnum
CREATE TYPE "EBannerLocation" AS ENUM ('HOME', 'COMPANY', 'OFFER', 'TENDER', 'BLOG', 'ALL', 'OTHER');

-- CreateEnum
CREATE TYPE "EBannerOrientation" AS ENUM ('HORIZONTAL', 'VERTICAL', 'SQUARE');

-- CreateEnum
CREATE TYPE "EBannerOwnerType" AS ENUM ('USER', 'COMPANY', 'SYSTEM');

-- CreateTable
CREATE TABLE "BannerPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "benefits" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "orientation" "EBannerOrientation" NOT NULL,
    "location" "EBannerLocation" NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "durationUnit" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BannerPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "destinationUrl" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expireAt" TIMESTAMP(3),
    "planId" TEXT NOT NULL,
    "userId" TEXT,
    "companyId" TEXT,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_planId_fkey" FOREIGN KEY ("planId") REFERENCES "BannerPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
