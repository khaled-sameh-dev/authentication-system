import z from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is Required" }),
  email: z
    .email()
    .trim()
    .min(1, { message: "Email is Required" })
    .max(255, { message: "Email is too Long" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is Required" })
    .min(8, { message: "Password must be at least 8 charchter" })
    .regex(/[A-Z]/, "password must contain at least one capital letter.")
    .regex(/[a-z]/, "password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "password must contain at least one number."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
