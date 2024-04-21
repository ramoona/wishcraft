/*
  Warnings:

  - You are about to drop the column `reservedByUserId` on the `Wish` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Wish" DROP CONSTRAINT "Wish_reservedByUserId_fkey";

-- AlterTable
ALTER TABLE "Wish" DROP COLUMN "reservedByUserId",
ADD COLUMN     "reservedById" TEXT;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_reservedById_fkey" FOREIGN KEY ("reservedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
