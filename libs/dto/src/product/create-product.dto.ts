import { idSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

export const createProductSchema = z.object({
  id: idSchema,
  // productCode: z.string(),
  productName: z.string(),
  price: z.number().min(0),
});

export class CreateProductDto extends createZodDto(createProductSchema) {}
