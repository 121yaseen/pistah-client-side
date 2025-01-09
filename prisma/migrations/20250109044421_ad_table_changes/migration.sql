/*
  Warnings:

  - You are about to drop the column `adType` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Ad` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "adType",
DROP COLUMN "description",
ADD COLUMN     "duration" INTEGER NOT NULL;
