import { z } from "zod";

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is Required" })
    .min(8, { message: "Password must be at least 8 charchter" })
    .regex(/[A-Z]/, "password must contain at least one capital letter.")
    .regex(/[a-z]/, "password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "password must contain at least one number."),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
