import { CookieOptions } from "express";
import env from "./env";

const IS_PRODUCTION = env.NODE_ENV === "production";

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? "strict" : "lax",
  path: "/api/v1/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  domain: IS_PRODUCTION && env.COOKIE_DOMAIN ? env.COOKIE_DOMAIN : undefined,
};

export const clearCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? "strict" : "lax",
  path: "/api/v1/auth",
  domain: IS_PRODUCTION && env.COOKIE_DOMAIN ? env.COOKIE_DOMAIN : undefined,
};
