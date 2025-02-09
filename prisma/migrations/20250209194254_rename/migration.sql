/*
  Warnings:

  - You are about to drop the column `activity` on the `UserActionsLog` table. All the data in the column will be lost.
  - Added the required column `payload` to the `UserActionsLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserActionsLog" DROP COLUMN "activity",
ADD COLUMN     "payload" JSONB NOT NULL;
