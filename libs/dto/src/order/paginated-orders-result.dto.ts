import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

import { createOrderSchema } from "./create-order.dto";

const paginatedOrdersResultSchema = z.object({
  data: z.array(createOrderSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalCount: z.number().int().min(0),
});

export class PaginatedOrdersResultDto extends createZodDto(paginatedOrdersResultSchema) {}

export default PaginatedOrdersResultDto;
