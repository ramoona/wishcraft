/*
  Warnings:

  - A unique constraint covering the columns `[friendAId,friendBId]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requestedById,receivedById]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Friend_friendAId_friendBId_key" ON "Friend"("friendAId", "friendBId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_requestedById_receivedById_key" ON "FriendRequest"("requestedById", "receivedById");
