-- CreateTable
CREATE TABLE "UserActionsLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activity" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActionsLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserActionsLog_userId_idx" ON "UserActionsLog"("userId");

-- AddForeignKey
ALTER TABLE "UserActionsLog" ADD CONSTRAINT "UserActionsLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
