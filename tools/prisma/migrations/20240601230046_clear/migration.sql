/*
  Warnings:

  - Made the column `orderType` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderStatus` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "orderType" SET NOT NULL,
ALTER COLUMN "orderStatus" SET NOT NULL;
