import { z } from "zod";

export const verifyEmailQuerySchema = z.object({
  token: z
    .string({ message: "رمز التفعيل مطلوب" })
    .trim()
    .min(1, "رمز التفعيل غير صالح"),
});