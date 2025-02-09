/*
  Warnings:

  - You are about to drop the column `userId` on the `UserActionsLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserActionsLog" DROP CONSTRAINT "UserActionsLog_userId_fkey";

-- DropIndex
DROP INDEX "UserActionsLog_userId_idx";

-- AlterTable
ALTER TABLE "UserActionsLog" DROP COLUMN "userId";
