-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" DATE,
ADD COLUMN     "defaultCurrency" "Currency",
ADD COLUMN     "showReserved" BOOLEAN;

-- AlterTable
ALTER TABLE "Wish" ADD COLUMN     "isPrivate" BOOLEAN;
