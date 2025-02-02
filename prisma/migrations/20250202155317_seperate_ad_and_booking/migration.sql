/*
  Warnings:

  - The primary key for the `Ad` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adId` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Ad` table. All the data in the column will be lost.
  - The primary key for the `AdBoard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adBoardId` on the `AdBoard` table. All the data in the column will be lost.
  - You are about to drop the column `boardLength` on the `AdBoard` table. All the data in the column will be lost.
  - You are about to drop the column `boardWidth` on the `AdBoard` table. All the data in the column will be lost.
  - You are about to drop the column `defaultCapacity` on the `AdBoard` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `AdBoard` table. All the data in the column will be lost.
  - The primary key for the `BoardAvailability` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `boardAvailId` on the `BoardAvailability` table. All the data in the column will be lost.
  - The primary key for the `Booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookingId` on the `Booking` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - Added the required column `adDuration` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Ad` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `remarks` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardType` to the `AdBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dimensions` to the `AdBoard` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `AdBoard` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `isAvailable` to the `AdBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastMaintenanceDate` to the `AdBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerContact` to the `AdBoard` table without a default value. This is not possible if the table is not empty.
  - Made the column `dailyRate` on table `AdBoard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `operationalHours` on table `AdBoard` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `BoardAvailability` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Booking` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADVERTISER', 'OWNER');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ad" DROP CONSTRAINT "Ad_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "AdBoard" DROP CONSTRAINT "AdBoard_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "BoardAvailability" DROP CONSTRAINT "BoardAvailability_adBoardId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_adBoardId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_adId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- AlterTable
ALTER TABLE "Ad" DROP CONSTRAINT "Ad_pkey",
DROP COLUMN "adId",
DROP COLUMN "createdBy",
DROP COLUMN "duration",
ADD COLUMN     "adBoardId" TEXT,
ADD COLUMN     "adDuration" TEXT NOT NULL,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "remarks" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT NOT NULL DEFAULT '',
ADD CONSTRAINT "Ad_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AdBoard" DROP CONSTRAINT "AdBoard_pkey",
DROP COLUMN "adBoardId",
DROP COLUMN "boardLength",
DROP COLUMN "boardWidth",
DROP COLUMN "defaultCapacity",
DROP COLUMN "thumbnailUrl",
ADD COLUMN     "boardType" TEXT NOT NULL,
ADD COLUMN     "dimensions" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL,
ADD COLUMN     "lastMaintenanceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ownerContact" TEXT NOT NULL,
ALTER COLUMN "dailyRate" SET NOT NULL,
ALTER COLUMN "operationalHours" SET NOT NULL,
ADD CONSTRAINT "AdBoard_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BoardAvailability" DROP CONSTRAINT "BoardAvailability_pkey",
DROP COLUMN "boardAvailId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "BoardAvailability_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_pkey",
DROP COLUMN "bookingId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "profilePicUrl" TEXT DEFAULT '',
ALTER COLUMN "password" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Account_provider_idx" ON "Account"("provider");

-- CreateIndex
CREATE INDEX "Account_providerAccountId_idx" ON "Account"("providerAccountId");

-- CreateIndex
CREATE INDEX "Ad_title_idx" ON "Ad"("title");

-- CreateIndex
CREATE INDEX "Ad_createdById_idx" ON "Ad"("createdById");

-- CreateIndex
CREATE INDEX "AdBoard_boardName_idx" ON "AdBoard"("boardName");

-- CreateIndex
CREATE INDEX "AdBoard_location_idx" ON "AdBoard"("location");

-- CreateIndex
CREATE INDEX "AdBoard_ownerId_idx" ON "AdBoard"("ownerId");

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdBoard" ADD CONSTRAINT "AdBoard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardAvailability" ADD CONSTRAINT "BoardAvailability_adBoardId_fkey" FOREIGN KEY ("adBoardId") REFERENCES "AdBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_adBoardId_fkey" FOREIGN KEY ("adBoardId") REFERENCES "AdBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
