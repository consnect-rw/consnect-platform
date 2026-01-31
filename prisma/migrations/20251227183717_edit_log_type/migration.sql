/*
  Warnings:

  - The values [CREATE,UPDATE,DELETE,VIEW,DOWNLOAD,LOGIN,LOGOUT,PERMISSION_DENIED,SIGN,VERIFY,FAIL] on the enum `ELogType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ELogType_new" AS ENUM ('AUTH', 'USER_ACTION', 'SYSTEM', 'ERROR');
ALTER TABLE "Log" ALTER COLUMN "type" TYPE "ELogType_new" USING ("type"::text::"ELogType_new");
ALTER TYPE "ELogType" RENAME TO "ELogType_old";
ALTER TYPE "ELogType_new" RENAME TO "ELogType";
DROP TYPE "public"."ELogType_old";
COMMIT;
