/*
  Warnings:

  - Changed the type of `action` on the `AuthLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EAuthAction" AS ENUM ('LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'TWO_FACTOR_ENABLE', 'TWO_FACTOR_DISABLE', 'EMAIL_VERIFICATION', 'ACCOUNT_LOCK', 'ACCOUNT_UNLOCK');

-- AlterTable
ALTER TABLE "AuthLog" DROP COLUMN "action",
ADD COLUMN     "action" "EAuthAction" NOT NULL;

-- DropEnum
DROP TYPE "EAction";
