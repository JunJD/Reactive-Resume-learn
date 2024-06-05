import { idSchema } from "@reactive-resume/schema";
import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

import { secretsSchema } from "../secrets";

export const usernameSchema = z
  .string()
  .min(3, { message: "用户名至少需要 3 个字符" })
  .max(255, { message: "用户最多需要 255 个字符" })
  .regex(/^[\d._a-z-]+$/, {
    message: "用户名只能包含小写字母、数字、点、连字符和下划线。",
  });

export const userSchema = z.object({
  id: idSchema,
  name: z
    .string()
    .min(1, { message: "用户名至少需要 1 个字符" })
    .max(255, { message: "用户最多需要 255 个字符" }),
  picture: z.literal("").or(z.null()).or(z.string().url()),
  username: usernameSchema,
  email: z.string().email({ message: "无效电子邮件" }),
  locale: z.string().default("en-US"),
  emailVerified: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  provider: z.enum(["email", "github", "google"]).default("email"),
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
});

export class UserDto extends createZodDto(userSchema) {}

export const userWithSecretsSchema = userSchema.merge(z.object({ secrets: secretsSchema }));

export class UserWithSecrets extends createZodDto(userWithSecretsSchema) {}
