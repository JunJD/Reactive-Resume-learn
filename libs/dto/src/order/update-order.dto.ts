import { createZodDto } from "nestjs-zod/dto";

import { createOrderSchema } from "./create-order.dto";

export class UpdateOrderDto extends createZodDto(createOrderSchema) {}

export default UpdateOrderDto;
