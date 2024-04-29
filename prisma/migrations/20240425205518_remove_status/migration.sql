/*
  Warnings:

  - The values [RESERVED_BY_CURRENT_USER] on the enum `WishStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WishStatus_new" AS ENUM ('AVAILABLE', 'RESERVED', 'BOUGHT', 'GIFTED', 'ARCHIVED');
ALTER TABLE "Wish" ALTER COLUMN "status" TYPE "WishStatus_new" USING ("status"::text::"WishStatus_new");
ALTER TYPE "WishStatus" RENAME TO "WishStatus_old";
ALTER TYPE "WishStatus_new" RENAME TO "WishStatus";
DROP TYPE "WishStatus_old";
COMMIT;
