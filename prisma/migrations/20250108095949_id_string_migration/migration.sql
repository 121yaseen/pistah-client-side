/*
  Warnings:

  - The primary key for the `Ad` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `AdBoard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BoardAvailability` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
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
ALTER COLUMN "adId" DROP DEFAULT,
ALTER COLUMN "adId" SET DATA TYPE TEXT,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT,
ADD CONSTRAINT "Ad_pkey" PRIMARY KEY ("adId");
DROP SEQUENCE "Ad_adId_seq";

-- AlterTable
ALTER TABLE "AdBoard" DROP CONSTRAINT "AdBoard_pkey",
ALTER COLUMN "adBoardId" DROP DEFAULT,
ALTER COLUMN "adBoardId" SET DATA TYPE TEXT,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AdBoard_pkey" PRIMARY KEY ("adBoardId");
DROP SEQUENCE "AdBoard_adBoardId_seq";

-- AlterTable
ALTER TABLE "BoardAvailability" DROP CONSTRAINT "BoardAvailability_pkey",
ALTER COLUMN "boardAvailId" DROP DEFAULT,
ALTER COLUMN "boardAvailId" SET DATA TYPE TEXT,
ALTER COLUMN "adBoardId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BoardAvailability_pkey" PRIMARY KEY ("boardAvailId");
DROP SEQUENCE "BoardAvailability_boardAvailId_seq";

-- AlterTable
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_pkey",
ALTER COLUMN "bookingId" DROP DEFAULT,
ALTER COLUMN "bookingId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "adId" SET DATA TYPE TEXT,
ALTER COLUMN "adBoardId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("bookingId");
DROP SEQUENCE "Booking_bookingId_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");
DROP SEQUENCE "User_userId_seq";

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdBoard" ADD CONSTRAINT "AdBoard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardAvailability" ADD CONSTRAINT "BoardAvailability_adBoardId_fkey" FOREIGN KEY ("adBoardId") REFERENCES "AdBoard"("adBoardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("adId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_adBoardId_fkey" FOREIGN KEY ("adBoardId") REFERENCES "AdBoard"("adBoardId") ON DELETE RESTRICT ON UPDATE CASCADE;
