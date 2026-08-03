import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string("Email is required")
    .trim()
    .min(1, { message: "Email Cannot be empty" })
    .email("Email format is invalid"),
});

export type forgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
