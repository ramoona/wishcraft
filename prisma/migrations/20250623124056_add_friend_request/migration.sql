-- CreateTable
CREATE TABLE "FriendRequest" (
    "requestedById" TEXT NOT NULL,
    "receivedByd" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("requestedById","receivedByd")
);

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receivedByd_fkey" FOREIGN KEY ("receivedByd") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
