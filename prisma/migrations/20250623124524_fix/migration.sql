/*
  Warnings:

  - The primary key for the `FriendRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `receivedByd` on the `FriendRequest` table. All the data in the column will be lost.
  - Added the required column `receivedById` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_receivedByd_fkey";

-- AlterTable
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_pkey",
DROP COLUMN "receivedByd",
ADD COLUMN     "receivedById" TEXT NOT NULL,
ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("requestedById", "receivedById");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
