/*
  Warnings:

  - You are about to drop the column `isOnboarded` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOnboarded",
ADD COLUMN     "completedOnboardingSteps" TEXT[];
