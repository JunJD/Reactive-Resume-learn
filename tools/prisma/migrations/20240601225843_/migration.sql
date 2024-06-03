-- This is an empty migration.
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
