/*
  Warnings:

  - Changed the type of `orderType` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orderStatus` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
-- 为 `orderType` 添加临时列并迁移数据
-- 为 `orderType` 添加临时列并迁移数据
ALTER TABLE "Order" ADD COLUMN "newOrderType" "OrderType";
UPDATE "Order" SET "newOrderType" = "orderType"::"OrderType";
ALTER TABLE "Order" DROP COLUMN "orderType";
ALTER TABLE "Order" RENAME COLUMN "newOrderType" TO "orderType";

-- 为 `orderStatus` 添加临时列并迁移数据
ALTER TABLE "Order" ADD COLUMN "newOrderStatus" "OrderStatus";
UPDATE "Order" SET "newOrderStatus" = "orderStatus"::"OrderStatus";
ALTER TABLE "Order" DROP COLUMN "orderStatus";
ALTER TABLE "Order" RENAME COLUMN "newOrderStatus" TO "orderStatus";


-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "tradeNo" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "traceId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
