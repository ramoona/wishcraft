-- CreateTable
CREATE TABLE "Friend" (
    "friendAId" TEXT NOT NULL,
    "friendBId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("friendAId","friendBId")
);

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendAId_fkey" FOREIGN KEY ("friendAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendBId_fkey" FOREIGN KEY ("friendBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
