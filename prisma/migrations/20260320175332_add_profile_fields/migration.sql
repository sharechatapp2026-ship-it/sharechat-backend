/*
  Warnings:

  - You are about to drop the `interests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "interests" DROP CONSTRAINT "interests_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "displayStyle" TEXT,
ADD COLUMN     "educationLevel" TEXT,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "workField" TEXT;

-- DropTable
DROP TABLE "interests";
