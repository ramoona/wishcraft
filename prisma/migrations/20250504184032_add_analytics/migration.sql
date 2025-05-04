-- CreateTable
CREATE TABLE "AnalyticsEvents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,

    CONSTRAINT "AnalyticsEvents_pkey" PRIMARY KEY ("id")
);
