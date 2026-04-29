-- CreateEnum
CREATE TYPE "EBannerPagePosition" AS ENUM ('TOP', 'MIDDLE', 'BOTTOM', 'SIDEBAR', 'OTHER');

-- AlterTable
ALTER TABLE "BannerPlan" ADD COLUMN     "pagePosition" "EBannerPagePosition" NOT NULL DEFAULT 'MIDDLE';
