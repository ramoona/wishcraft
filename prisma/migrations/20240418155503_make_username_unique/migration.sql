/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
