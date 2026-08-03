import { z } from "zod";

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z
      .string({
        message: "Token is required",
      })
      .trim()
      .min(1, "Token cannot be empty"),

    newPassword: z
      .string({
        message: "New password is required",
      })
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
  }),
});

export type resetPasswordSchema = z.infer<typeof resetPasswordSchema>["body"];
