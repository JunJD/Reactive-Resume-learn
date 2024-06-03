import { createZodDto } from "nestjs-zod/dto";

import { createProductSchema } from "./create-product.dto";

export const updateProductSchema = createProductSchema.partial();

export class UpdateProductDto extends createZodDto(updateProductSchema) {}
