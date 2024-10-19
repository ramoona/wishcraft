/*
  Warnings:

  - You are about to drop the column `google_id` on the `Types` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Types` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstName` to the `Types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "google_id",
DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "VerificationToken";
