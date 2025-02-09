/*
  Warnings:

  - The `defaultCurrency` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `currency` column on the `Wish` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultCurrency",
ADD COLUMN     "defaultCurrency" TEXT;

-- AlterTable
ALTER TABLE "Wish" DROP COLUMN "currency",
ADD COLUMN     "currency" TEXT;

-- DropEnum
DROP TYPE "Currency";
