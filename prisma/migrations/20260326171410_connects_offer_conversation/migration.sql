-- AlterEnum
ALTER TYPE "EConversationType" ADD VALUE 'OFFER_ROOM';

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "offerId" TEXT;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
