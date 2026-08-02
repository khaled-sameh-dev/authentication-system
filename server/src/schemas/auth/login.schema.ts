import z from "zod";

export const loginSchema = z.object({
  email: z
    .string("Email is Required")
    .trim()
    .min(1, "Email Cannot be empty")
    .email("Email Format is incorrect")
    .max(255, "Email is too long"),
  password: z.string("Password is Required").min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export type loginSchema = z.infer<typeof loginSchema>;
