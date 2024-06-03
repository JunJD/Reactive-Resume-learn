import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

const paginationSchema = z.object({
  page: z.preprocess(Number, z.number().int().positive()),
  limit: z.preprocess(Number, z.number().int().positive()),
});

export class PaginationDto extends createZodDto(paginationSchema) {}

export default PaginationDto;
