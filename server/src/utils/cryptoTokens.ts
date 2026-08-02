import { UserRole } from "@/types";

import jwt, { Secret, SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import env from "@/config/env";
import { JwtPayload } from "@/types/express";

const options: SignOptions = {
  expiresIn: (env.JWT_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"],
};

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET as Secret, options);
};
export const generateToken = () => crypto.randomBytes(40).toString("hex");

export const hashToken = (plain: string) =>
  crypto.createHash("sha256").update(plain).digest("hex");

export const compareTokens = (plain: string, hashedPlain: string): boolean =>
  hashToken(plain) === hashedPlain;

export const verifyToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET!) as JwtPayload;
