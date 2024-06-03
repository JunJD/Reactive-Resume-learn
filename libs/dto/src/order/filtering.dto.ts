import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

const filteringSchema = z.object({
  id: z.string().optional(),
  orderCode: z.string().optional(),
  orderType: z.enum(["VM_SERVE_VIP"]).optional(),
  orderStatus: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
});

export class FilteringDto extends createZodDto(filteringSchema) {}

export default FilteringDto;
