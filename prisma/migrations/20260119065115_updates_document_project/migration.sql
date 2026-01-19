-- AlterEnum
ALTER TYPE "EDocumentModelType" ADD VALUE 'PROJECT';

-- AlterEnum
ALTER TYPE "EDocumentType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
