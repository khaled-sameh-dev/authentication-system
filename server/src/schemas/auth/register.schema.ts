import z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string("Name is Required")
      .min(1)
      .trim(),
    email: z
      .string("Email is Required")
      .trim()
      .email("Invalid email format")
      .max(255),
    password: z.string("Password is Required").min(8, {
      message: "Password must be at least 8 characters",
    }),
  })
  .strict();

export type registerSchema = z.infer<typeof registerSchema>;
