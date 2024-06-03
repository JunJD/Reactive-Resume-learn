import { idSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export type OrderStatusEnum = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export const createOrderSchema = z.object({
  id: idSchema,
  // orderCode: z.string(),
  orderType: z.enum(["VM_SERVE_VIP"]),
  products: z.array(z.string()),
  orderStatus: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  quantity: z.number().int().min(1),
  totalPrice: z.number().min(0),
});

export const paymentInfoSchema = z.object({
  orderId: idSchema,
  tradeNo: z.string(),
  qrCode: z.string(),
  traceId: z.string(),
  amount: z.number(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

// 继承createOrderSchema，并拓展一个paymentInfo字段
export const orderTypeSchema = z.object({
  paymentInfo: z.object({
    ...paymentInfoSchema.shape,
  }),
  ...createOrderSchema.shape,
});

export class CreateOrderDto extends createZodDto(createOrderSchema) {}

export class OrderType extends createZodDto(orderTypeSchema) {}

export default CreateOrderDto;
