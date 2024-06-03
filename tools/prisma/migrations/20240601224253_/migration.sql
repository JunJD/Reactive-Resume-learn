/*
  Warnings:

  - Added the required column `orderType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderStatus` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderType",
ADD COLUMN     "orderType" "OrderType" NOT NULL,
DROP COLUMN "orderStatus",
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL;
