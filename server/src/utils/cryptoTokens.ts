import { UserRole } from "@/types";

import jwt, { Secret, SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import env from "@/config/env";

interface JWTPayload {
  userId: string;
  isEmailVerfied: boolean;
  role: UserRole;
}

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};
export const generateToken = () => crypto.randomBytes(40).toString("hex");

export const hashToken = (plain: string) =>
  crypto.createHash("sha256").update(plain).digest("hex");

export const compareTokens = (plain: string, hashedPlain: string): boolean =>
  hashToken(plain) === hashedPlain;
