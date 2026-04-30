/*
  Warnings:

  - You are about to drop the column `status` on the `performance_reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "performance_reviews" DROP COLUMN "status";

-- DropEnum
DROP TYPE "ReviewStatus";
