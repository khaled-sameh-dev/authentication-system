import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid connection string"),

  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
  COOKIE_DOMAIN: z.string().default(""),

  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  MAIL_FROM: z.string().email("MAIL_FROM must be a valid email address"),

  JWT_SECRET: z
    .string()
    .min(10, "JWT_SECRET should be at least 10 characters long"),
  JWT_EXPIRES_IN: z.string().default("15m"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
export default env;
