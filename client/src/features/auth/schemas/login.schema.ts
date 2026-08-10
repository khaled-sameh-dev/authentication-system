import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email()
    .trim()
    .min(1, { message: "Email is Required" })
    .max(255, { message: "Email is too Long" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is Required" })
    .min(8, { message: "Password must be at least 8 charchter" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
